import json
from collections import Counter
from pathlib import Path

import numpy as np
import torch
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

OUTPUT_FILE = Path(
    "evaluation/results/error_analysis_finetuned.txt"
)

BATCH_SIZE = 16
MAX_LENGTH = 128


# =========================================================
# Header
# =========================================================

print("=" * 70)
print("MindCareAI - Fine-Tuned RoBERTa Error Analysis")
print("=" * 70)


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

print("\nLoading fine-tuned model...")

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

print(
    f"Emotion classes: {len(label_names)}"
)


# =========================================================
# Prepare data
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

predicted_labels = []

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

    batch_predictions = torch.argmax(
        probabilities,
        dim=1
    )

    predicted_labels.extend(
        batch_predictions
        .cpu()
        .numpy()
        .tolist()
    )

    print(
        f"Processed {end}/{len(texts)}",
        end="\r"
    )


print("\n\nInference complete.")


# =========================================================
# Identify errors
# =========================================================

errors = []

correct_count = 0

for index, (
    true_label,
    predicted_label
) in enumerate(
    zip(true_labels, predicted_labels)
):

    if true_label == predicted_label:

        correct_count += 1

    else:

        errors.append(
            {
                "text": texts[index],
                "true_label": label_names[true_label],
                "predicted_label": label_names[predicted_label],
            }
        )


# =========================================================
# Confusion analysis
# =========================================================

confusion_pairs = Counter(
    (
        error["true_label"],
        error["predicted_label"]
    )
    for error in errors
)


# =========================================================
# Per-class error counts
# =========================================================

class_errors = Counter(
    error["true_label"]
    for error in errors
)


# =========================================================
# Display summary
# =========================================================

print("\n")
print("=" * 70)
print("ERROR ANALYSIS SUMMARY")
print("=" * 70)

print(
    f"\nTotal examples : {len(benchmark)}"
)

print(
    f"Correct        : {correct_count}"
)

print(
    f"Incorrect      : {len(errors)}"
)


# ---------------------------------------------------------
# Most common confusion pairs
# ---------------------------------------------------------

print("\nMost common confusion pairs:")
print("-" * 70)

for (
    true_label,
    predicted_label
), count in confusion_pairs.most_common(25):

    print(
        f"{true_label:<18} → "
        f"{predicted_label:<18} "
        f"{count}"
    )


# ---------------------------------------------------------
# Classes with most errors
# ---------------------------------------------------------

print("\nClasses with most errors:")
print("-" * 70)

for label, count in class_errors.most_common():

    print(
        f"{label:<20} {count}"
    )


# =========================================================
# Sample errors
# =========================================================

print("\n")
print("=" * 70)
print("SAMPLE ERRORS")
print("=" * 70)

for index, error in enumerate(
    errors[:30],
    start=1
):

    print(
        f"\n{index}. Text:"
    )

    print(
        f"   {error['text']}"
    )

    print(
        f"   True      : "
        f"{error['true_label']}"
    )

    print(
        f"   Predicted : "
        f"{error['predicted_label']}"
    )


# =========================================================
# Save results
# =========================================================

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        "MindCareAI - Fine-Tuned RoBERTa Error Analysis\n"
    )

    file.write("=" * 70 + "\n\n")

    file.write(
        f"Total examples : {len(benchmark)}\n"
    )

    file.write(
        f"Correct        : {correct_count}\n"
    )

    file.write(
        f"Incorrect      : {len(errors)}\n\n"
    )

    file.write(
        "Most common confusion pairs\n"
    )

    file.write("-" * 70 + "\n")

    for (
        true_label,
        predicted_label
    ), count in confusion_pairs.most_common(25):

        file.write(
            f"{true_label:<18} → "
            f"{predicted_label:<18} "
            f"{count}\n"
        )

    file.write("\n\n")

    file.write(
        "Classes with most errors\n"
    )

    file.write("-" * 70 + "\n")

    for label, count in class_errors.most_common():

        file.write(
            f"{label:<20} {count}\n"
        )

    file.write("\n\n")

    file.write(
        "Sample errors\n"
    )

    file.write("=" * 70 + "\n")

    for index, error in enumerate(
        errors[:30],
        start=1
    ):

        file.write(
            f"\n{index}. Text:\n"
        )

        file.write(
            f"   {error['text']}\n"
        )

        file.write(
            f"   True      : "
            f"{error['true_label']}\n"
        )

        file.write(
            f"   Predicted : "
            f"{error['predicted_label']}\n"
        )


print("\n")
print("=" * 70)
print(
    f"Results saved to: {OUTPUT_FILE}"
)
print("=" * 70)