import json
from pathlib import Path

import numpy as np
import torch
from datasets import load_dataset
from sklearn.metrics import f1_score, precision_score, recall_score
from transformers import AutoModelForSequenceClassification, AutoTokenizer


MODEL_PATH = "training/output/roberta-go-emotions/final"
BATCH_SIZE = 16

print("=" * 70)
print("MindCareAI - Multi-Label Threshold Calibration")
print("=" * 70)

# Load validation data
print("\nLoading GoEmotions validation set...")
dataset = load_dataset("google-research-datasets/go_emotions")
validation = dataset["validation"]

label_names = validation.features["labels"].feature.names
num_labels = len(label_names)

print(f"Validation samples: {len(validation)}")
print(f"Emotion classes: {num_labels}")

# Load fine-tuned model
print("\nLoading fine-tuned RoBERTa...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device: {device}")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

model.to(device)
model.eval()

# Prepare true multi-label targets
true_labels = np.zeros((len(validation), num_labels), dtype=np.int32)

for i, example in enumerate(validation):
    for label_id in example["labels"]:
        true_labels[i, label_id] = 1

texts = validation["text"]

# Run inference
print("\nRunning inference...")
probabilities = []

for start in range(0, len(texts), BATCH_SIZE):
    end = min(start + BATCH_SIZE, len(texts))

    inputs = tokenizer(
        texts[start:end],
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="pt",
    )

    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = model(**inputs)
        batch_probabilities = torch.sigmoid(outputs.logits)

    probabilities.append(
        batch_probabilities.cpu().numpy()
    )

    print(f"Processed {end}/{len(texts)}", end="\r")

probabilities = np.vstack(probabilities)

print("\nInference complete.")

# Test global thresholds
thresholds_to_test = np.arange(0.10, 0.91, 0.05)

best_threshold = None
best_macro_f1 = -1

print("\nGlobal threshold results")
print("-" * 70)

for threshold in thresholds_to_test:
    predictions = (probabilities >= threshold).astype(int)

    macro_f1 = f1_score(
        true_labels,
        predictions,
        average="macro",
        zero_division=0,
    )

    micro_f1 = f1_score(
        true_labels,
        predictions,
        average="micro",
        zero_division=0,
    )

    macro_precision = precision_score(
        true_labels,
        predictions,
        average="macro",
        zero_division=0,
    )

    macro_recall = recall_score(
        true_labels,
        predictions,
        average="macro",
        zero_division=0,
    )

    print(
        f"Threshold {threshold:.2f} | "
        f"Macro F1: {macro_f1:.4f} | "
        f"Micro F1: {micro_f1:.4f} | "
        f"Precision: {macro_precision:.4f} | "
        f"Recall: {macro_recall:.4f}"
    )

    if macro_f1 > best_macro_f1:
        best_macro_f1 = macro_f1
        best_threshold = float(threshold)

print("\n")
print("=" * 70)
print("BEST GLOBAL THRESHOLD")
print("=" * 70)
print(f"Threshold : {best_threshold:.2f}")
print(f"Macro F1  : {best_macro_f1:.4f}")

# Save threshold
output_dir = Path("evaluation/results")
output_dir.mkdir(parents=True, exist_ok=True)

threshold_file = output_dir / "calibrated_threshold.json"

with open(threshold_file, "w", encoding="utf-8") as file:
    json.dump(
        {
            "model": MODEL_PATH,
            "threshold": best_threshold,
            "validation_macro_f1": best_macro_f1,
        },
        file,
        indent=2,
    )

print(f"\nSaved to: {threshold_file}")