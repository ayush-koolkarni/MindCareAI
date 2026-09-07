import json
from pathlib import Path
from collections import Counter

import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

MODEL_NAME = "SamLowe/roberta-base-go_emotions"

BENCHMARK_FILE = Path(
    "evaluation/data/balanced_test.json"
)

OUTPUT_FILE = Path(
    "evaluation/results/error_analysis.txt"
)

BATCH_SIZE = 16


# ---------------------------------------------------------
# Load benchmark
# ---------------------------------------------------------

print("=" * 70)
print("MindCareAI - RoBERTa Error Analysis")
print("=" * 70)

with open(
    BENCHMARK_FILE,
    "r",
    encoding="utf-8"
) as file:

    benchmark = json.load(file)

print(
    f"\nBenchmark samples: {len(benchmark)}"
)


# ---------------------------------------------------------
# Load model
# ---------------------------------------------------------

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(f"Device: {device}")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME
)

model.to(device)
model.eval()

id2label = model.config.id2label


# ---------------------------------------------------------
# Run predictions
# ---------------------------------------------------------

texts = [
    item["text"]
    for item in benchmark
]

true_labels = [
    item["label_id"]
    for item in benchmark
]

predictions = []


print("\nRunning predictions...")


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
        max_length=128,
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

    predictions.extend(
        batch_predictions
        .cpu()
        .tolist()
    )

    print(
        f"Processed {end}/{len(texts)}",
        end="\r"
    )


print("\nPrediction complete.")


# ---------------------------------------------------------
# Find errors
# ---------------------------------------------------------

errors = []

confusion_pairs = Counter()


for item, prediction in zip(
    benchmark,
    predictions
):

    true_id = item["label_id"]

    if true_id != prediction:

        true_emotion = id2label[true_id]

        predicted_emotion = id2label[prediction]

        errors.append(
            {
                "text": item["text"],
                "true": true_emotion,
                "predicted": predicted_emotion
            }
        )

        confusion_pairs[
            (
                true_emotion,
                predicted_emotion
            )
        ] += 1


# ---------------------------------------------------------
# Display summary
# ---------------------------------------------------------

print("\n")
print("=" * 70)
print("ERROR SUMMARY")
print("=" * 70)

print(
    f"Total examples : {len(benchmark)}"
)

print(
    f"Incorrect      : {len(errors)}"
)

print(
    f"Correct        : {len(benchmark) - len(errors)}"
)


# ---------------------------------------------------------
# Most common confusion pairs
# ---------------------------------------------------------

print("\n")
print("=" * 70)
print("MOST COMMON CONFUSIONS")
print("=" * 70)

for (
    (true_emotion, predicted_emotion),
    count
) in confusion_pairs.most_common(20):

    print(
        f"{true_emotion:<20}"
        f"→ {predicted_emotion:<20}"
        f"{count}"
    )


# ---------------------------------------------------------
# Show examples
# ---------------------------------------------------------

print("\n")
print("=" * 70)
print("SAMPLE ERRORS")
print("=" * 70)


for i, error in enumerate(
    errors[:30],
    start=1
):

    print(f"\n{i}.")
    print(
        f"Text       : {error['text']}"
    )
    print(
        f"True       : {error['true']}"
    )
    print(
        f"Predicted  : {error['predicted']}"
    )


# ---------------------------------------------------------
# Save results
# ---------------------------------------------------------

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
        "MindCareAI - RoBERTa Error Analysis\n"
    )

    file.write("=" * 60 + "\n\n")

    file.write(
        f"Benchmark samples: {len(benchmark)}\n"
    )

    file.write(
        f"Errors: {len(errors)}\n\n"
    )

    file.write(
        "Most common confusion pairs\n"
    )

    file.write("-" * 60 + "\n")

    for (
        (true_emotion, predicted_emotion),
        count
    ) in confusion_pairs.most_common(20):

        file.write(
            f"{true_emotion} -> "
            f"{predicted_emotion}: "
            f"{count}\n"
        )

    file.write("\n\nSample errors\n")
    file.write("-" * 60 + "\n")

    for i, error in enumerate(
        errors[:100],
        start=1
    ):

        file.write(
            f"\n{i}. {error['text']}\n"
        )

        file.write(
            f"True: {error['true']}\n"
        )

        file.write(
            f"Predicted: "
            f"{error['predicted']}\n"
        )


print("\n")
print(
    f"Error analysis saved to: {OUTPUT_FILE}"
)