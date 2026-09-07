import json
from pathlib import Path

import numpy as np
import torch
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
)


# =========================================================
# Configuration
# =========================================================

MODEL_DIR = Path(
    "training/output/roberta-go-emotions/final"
)

BENCHMARK_FILE = Path(
    "evaluation/data/balanced_test.json"
)

BATCH_SIZE = 16

MAX_LENGTH = 128


# =========================================================
# Header
# =========================================================

print("=" * 70)
print("MindCareAI - Fine-Tuned RoBERTa Benchmark")
print("=" * 70)


# =========================================================
# Check model
# =========================================================

if not MODEL_DIR.exists():

    raise FileNotFoundError(
        f"Fine-tuned model not found:\n{MODEL_DIR}"
    )


# =========================================================
# Load benchmark
# =========================================================

print("\nLoading benchmark...")

with open(
    BENCHMARK_FILE,
    "r",
    encoding="utf-8"
) as file:

    benchmark = json.load(file)

print(
    f"Benchmark samples: {len(benchmark)}"
)


# =========================================================
# Load model
# =========================================================

print("\nLoading fine-tuned RoBERTa model...")

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(f"Device: {device}")

tokenizer = AutoTokenizer.from_pretrained(
    str(MODEL_DIR)
)

model = AutoModelForSequenceClassification.from_pretrained(
    str(MODEL_DIR)
)

model.to(device)

model.eval()

id2label = model.config.id2label

label_names = [
    id2label[i]
    for i in range(len(id2label))
]

num_labels = len(label_names)

print(
    f"Emotion classes: {num_labels}"
)


# =========================================================
# Prepare benchmark
# =========================================================

texts = [
    item["text"]
    for item in benchmark
]

true_labels = [
    item["label_id"]
    for item in benchmark
]


# =========================================================
# Run inference
# =========================================================

predicted_probabilities = []

print("\nRunning inference...")
print("-" * 70)


for start in range(
    0,
    len(texts),
    BATCH_SIZE
):

    end = min(
        start + BATCH_SIZE,
        len(texts)
    )

    batch_texts = texts[start:end]

    inputs = tokenizer(
        batch_texts,
        padding=True,
        truncation=True,
        max_length=MAX_LENGTH,
        return_tensors="pt"
    )

    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():

        outputs = model(**inputs)

        probabilities = torch.sigmoid(
            outputs.logits
        )

    predicted_probabilities.extend(
        probabilities
        .cpu()
        .numpy()
    )

    print(
        f"Processed {end}/{len(texts)}",
        end="\r"
    )


print("\n\nInference complete.")


# =========================================================
# Convert predictions
# =========================================================

probabilities = np.array(
    predicted_probabilities
)

true_labels = np.array(
    true_labels
)

# Same primary-emotion rule used by the
# pretrained baseline.
predicted_labels = np.argmax(
    probabilities,
    axis=1
)


# =========================================================
# Metrics
# =========================================================

accuracy = accuracy_score(
    true_labels,
    predicted_labels
)

macro_precision = precision_score(
    true_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

macro_recall = recall_score(
    true_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

macro_f1 = f1_score(
    true_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

weighted_f1 = f1_score(
    true_labels,
    predicted_labels,
    average="weighted",
    zero_division=0
)


# =========================================================
# Display results
# =========================================================

print("\n")
print("=" * 70)
print("FINE-TUNED ROBERTA RESULTS")
print("=" * 70)

print(
    f"Accuracy          : {accuracy:.4f}"
)

print(
    f"Macro Precision   : {macro_precision:.4f}"
)

print(
    f"Macro Recall      : {macro_recall:.4f}"
)

print(
    f"Macro F1          : {macro_f1:.4f}"
)

print(
    f"Weighted F1       : {weighted_f1:.4f}"
)


# =========================================================
# Classification report
# =========================================================

print("\n")
print("=" * 70)
print("CLASSIFICATION REPORT")
print("=" * 70)

report = classification_report(
    true_labels,
    predicted_labels,
    labels=list(range(num_labels)),
    target_names=label_names,
    digits=4,
    zero_division=0
)

print(report)


# =========================================================
# Save results
# =========================================================

results_dir = Path(
    "evaluation/results"
)

results_dir.mkdir(
    parents=True,
    exist_ok=True
)

results_file = (
    results_dir /
    "roberta_finetuned.txt"
)


with open(
    results_file,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        "MindCareAI - Fine-Tuned RoBERTa Benchmark\n"
    )

    file.write("=" * 60 + "\n\n")

    file.write(
        f"Model: {MODEL_DIR}\n"
    )

    file.write(
        f"Benchmark samples: {len(benchmark)}\n"
    )

    file.write(
        f"Device: {device}\n\n"
    )

    file.write(
        "Metrics\n"
    )

    file.write(
        f"Accuracy: {accuracy:.4f}\n"
    )

    file.write(
        f"Macro Precision: {macro_precision:.4f}\n"
    )

    file.write(
        f"Macro Recall: {macro_recall:.4f}\n"
    )

    file.write(
        f"Macro F1: {macro_f1:.4f}\n"
    )

    file.write(
        f"Weighted F1: {weighted_f1:.4f}\n\n"
    )

    file.write(
        "Classification Report\n"
    )

    file.write(report)


print("\n")
print("=" * 70)

print(
    f"Results saved to: {results_file}"
)

print("=" * 70)