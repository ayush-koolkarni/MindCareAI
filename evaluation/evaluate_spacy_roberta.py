import json
import sys
from pathlib import Path

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    precision_recall_fscore_support,
)

# ---------------------------------------------------------
# Make project root importable
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ---------------------------------------------------------
# Import our NLP components
# ---------------------------------------------------------

from nlp.preprocess import (
    preprocess_text,
    get_linguistic_features,
)

from nlp.emotion_model import EmotionClassifier


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

BENCHMARK_PATH = (
    PROJECT_ROOT
    / "evaluation"
    / "data"
    / "balanced_test.json"
)

RESULT_PATH = (
    PROJECT_ROOT
    / "evaluation"
    / "results"
    / "spacy_roberta_baseline.txt"
)


# ---------------------------------------------------------
# Load benchmark
# ---------------------------------------------------------

print("\nLoading fixed benchmark...")

with open(BENCHMARK_PATH, "r", encoding="utf-8") as file:
    benchmark = json.load(file)

print(f"Benchmark examples: {len(benchmark)}")


# ---------------------------------------------------------
# Load RoBERTa
# ---------------------------------------------------------

print("\nLoading RoBERTa model...")

classifier = EmotionClassifier()


# ---------------------------------------------------------
# Evaluate
# ---------------------------------------------------------

y_true = []
y_pred = []

total_negations = 0
examples_with_negation = 0


print("\nRunning spaCy + RoBERTa evaluation...\n")


for index, example in enumerate(benchmark, start=1):

    original_text = example["text"]
    true_label = example["label"]

    # -----------------------------------------------------
    # spaCy preprocessing
    # -----------------------------------------------------

    processed_text = preprocess_text(original_text)

    linguistic_features = get_linguistic_features(original_text)

    if linguistic_features["negation_count"] > 0:
        examples_with_negation += 1
        total_negations += linguistic_features["negation_count"]

    # -----------------------------------------------------
    # RoBERTa prediction
    # -----------------------------------------------------

    predictions = classifier.predict(
        processed_text,
        top_k=1,
    )

    predicted_label = predictions[0]["emotion"]

    y_true.append(true_label)
    y_pred.append(predicted_label)

    if index % 50 == 0:
        print(f"Processed {index}/{len(benchmark)} examples")


# ---------------------------------------------------------
# Metrics
# ---------------------------------------------------------

accuracy = accuracy_score(y_true, y_pred)

precision, recall, macro_f1, _ = precision_recall_fscore_support(
    y_true,
    y_pred,
    average="macro",
    zero_division=0,
)

_, _, weighted_f1, _ = precision_recall_fscore_support(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0,
)


report = classification_report(
    y_true,
    y_pred,
    digits=4,
    zero_division=0,
)


# ---------------------------------------------------------
# Print results
# ---------------------------------------------------------

print("\n" + "=" * 70)
print("SPACY + ROBERTA FIXED BENCHMARK RESULTS")
print("=" * 70)

print(f"\nAccuracy        : {accuracy:.4f}")
print(f"Macro Precision : {precision:.4f}")
print(f"Macro Recall    : {recall:.4f}")
print(f"Macro F1        : {macro_f1:.4f}")
print(f"Weighted F1     : {weighted_f1:.4f}")

print("\nspaCy linguistic statistics")
print("-" * 70)

print(f"Examples with negation : {examples_with_negation}")
print(f"Total negation tokens  : {total_negations}")

print("\nClassification Report")
print("-" * 70)

print(report)


# ---------------------------------------------------------
# Save results
# ---------------------------------------------------------

RESULT_PATH.parent.mkdir(
    parents=True,
    exist_ok=True,
)

with open(
    RESULT_PATH,
    "w",
    encoding="utf-8",
) as file:

    file.write(
        "SPACY + ROBERTA FIXED BENCHMARK RESULTS\n"
    )

    file.write("=" * 70 + "\n\n")

    file.write(
        f"Benchmark examples : {len(benchmark)}\n"
    )

    file.write(
        f"Accuracy           : {accuracy:.4f}\n"
    )

    file.write(
        f"Macro Precision    : {precision:.4f}\n"
    )

    file.write(
        f"Macro Recall       : {recall:.4f}\n"
    )

    file.write(
        f"Macro F1           : {macro_f1:.4f}\n"
    )

    file.write(
        f"Weighted F1        : {weighted_f1:.4f}\n\n"
    )

    file.write(
        f"Examples with negation : {examples_with_negation}\n"
    )

    file.write(
        f"Total negation tokens  : {total_negations}\n\n"
    )

    file.write("Classification Report\n")
    file.write("-" * 70 + "\n")

    file.write(report)


print(
    f"\nResults saved to:\n{RESULT_PATH}"
)