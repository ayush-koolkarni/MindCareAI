from datasets import load_dataset
from collections import defaultdict
import json
import random
from pathlib import Path


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

SAMPLES_PER_CLASS = 30

OUTPUT_DIR = Path("evaluation/data")

OUTPUT_FILE = OUTPUT_DIR / "balanced_test.json"


# ---------------------------------------------------------
# Load dataset
# ---------------------------------------------------------

print("Loading GoEmotions...")

dataset = load_dataset(
    "google-research-datasets/go_emotions"
)

test_dataset = dataset["test"]

label_names = (
    test_dataset
    .features["labels"]
    .feature
    .names
)

print(
    f"Test examples available: {len(test_dataset)}"
)

print(
    f"Number of emotion classes: {len(label_names)}"
)


# ---------------------------------------------------------
# Group single-label examples
# ---------------------------------------------------------

examples_by_label = defaultdict(list)


for example in test_dataset:

    labels = example["labels"]

    # Keep only examples with exactly one
    # ground-truth emotion.
    if len(labels) != 1:
        continue

    label_id = labels[0]

    examples_by_label[label_id].append(
        {
            "text": example["text"],
            "label_id": label_id,
            "label": label_names[label_id]
        }
    )


# ---------------------------------------------------------
# Display class availability
# ---------------------------------------------------------

print("\nAvailable single-label examples:")

for label_id, label in enumerate(label_names):

    count = len(
        examples_by_label[label_id]
    )

    print(
        f"{label:<20} {count}"
    )


# ---------------------------------------------------------
# Build reproducible balanced benchmark
# ---------------------------------------------------------

benchmark = []

print("\nBuilding balanced benchmark...")

random.seed(42)

for label_id, label in enumerate(label_names):

    available = examples_by_label[label_id]

    if len(available) < SAMPLES_PER_CLASS:

        print(
            f"WARNING: {label} has only "
            f"{len(available)} examples."
        )

        selected = list(available)

    else:

        selected = random.sample(
            available,
            SAMPLES_PER_CLASS
        )

    benchmark.extend(selected)
    
# ---------------------------------------------------------
# Create output directory
# ---------------------------------------------------------

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ---------------------------------------------------------
# Save benchmark
# ---------------------------------------------------------

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        benchmark,
        file,
        indent=2,
        ensure_ascii=False
    )


# ---------------------------------------------------------
# Summary
# ---------------------------------------------------------

print("\n")
print("=" * 60)
print("BALANCED BENCHMARK CREATED")
print("=" * 60)

print(
    f"Total examples: {len(benchmark)}"
)

print(
    f"Saved to: {OUTPUT_FILE}"
)