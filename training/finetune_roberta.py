import random
from pathlib import Path

import numpy as np
import torch

import datasets
from datasets import load_dataset

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)


# =========================================================
# Configuration
# =========================================================

MODEL_NAME = "SamLowe/roberta-base-go_emotions"

OUTPUT_DIR = Path("training/output/roberta-go-emotions")

SEED = 42

# ---------------------------------------------------------
# CPU validation configuration
# ---------------------------------------------------------

# This is intentionally small for the first CPU run.
# We will scale this later on GPU.
MAX_TRAIN_SAMPLES = 3000
MAX_VALIDATION_SAMPLES = 1000

NUM_EPOCHS = 1

BATCH_SIZE = 4

MAX_LENGTH = 128


# =========================================================
# Reproducibility
# =========================================================

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)


# =========================================================
# Device
# =========================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 70)
print("MindCareAI - RoBERTa Fine-Tuning")
print("=" * 70)

print(f"\nDevice: {device}")

if device.type == "cpu":
    print(
        "\nWARNING: Running fine-tuning on CPU."
    )
    print(
        "This is a small pipeline-validation run."
    )


# =========================================================
# Load GoEmotions
# =========================================================

print("\nLoading GoEmotions dataset...")

dataset = load_dataset(
    "google-research-datasets/go_emotions"
)

train_dataset = dataset["train"]
validation_dataset = dataset["validation"]

print(
    f"Original training examples: "
    f"{len(train_dataset)}"
)

print(
    f"Original validation examples: "
    f"{len(validation_dataset)}"
)


# =========================================================
# Label information
# =========================================================

label_names = (
    train_dataset
    .features["labels"]
    .feature
    .names
)

num_labels = len(label_names)

print(
    f"Number of emotion classes: {num_labels}"
)

print("\nEmotion labels:")

for index, label in enumerate(label_names):
    print(f"{index:2d}: {label}")


# =========================================================
# Select reproducible subsets
# =========================================================

print("\nSelecting CPU validation subsets...")

train_size = min(
    MAX_TRAIN_SAMPLES,
    len(train_dataset)
)

validation_size = min(
    MAX_VALIDATION_SAMPLES,
    len(validation_dataset)
)

train_dataset = train_dataset.shuffle(
    seed=SEED
).select(
    range(train_size)
)

validation_dataset = validation_dataset.shuffle(
    seed=SEED
).select(
    range(validation_size)
)

print(
    f"Training subset: {len(train_dataset)}"
)

print(
    f"Validation subset: {len(validation_dataset)}"
)


# =========================================================
# Convert labels to multi-hot vectors
# =========================================================

def create_multi_hot(example):
    """
    Convert GoEmotions label IDs into a multi-hot vector.

    The targets are explicitly stored as float32 because
    multi-label classification uses BCEWithLogitsLoss,
    which requires floating-point targets.
    """

    multi_hot = np.zeros(
        num_labels,
        dtype=np.float32
    )

    for label_id in example["labels"]:
        multi_hot[label_id] = 1.0

    example["labels"] = multi_hot.tolist()

    return example


print("\nPreparing multi-label targets...")

train_dataset = train_dataset.map(
    create_multi_hot
)

validation_dataset = validation_dataset.map(
    create_multi_hot
)


# ---------------------------------------------------------
# Ensure multi-label targets are stored as float32
# ---------------------------------------------------------

train_dataset = train_dataset.cast_column(
    "labels",
    datasets.Sequence(
        datasets.Value("float32")
    )
)

validation_dataset = validation_dataset.cast_column(
    "labels",
    datasets.Sequence(
        datasets.Value("float32")
    )
)

print("\nLabel feature type:")
print(train_dataset.features["labels"])

print(
    "\nFirst training label vector type:",
    type(train_dataset[0]["labels"][0])
)

# =========================================================
# Load tokenizer
# =========================================================

print("\nLoading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)


# =========================================================
# Tokenization
# =========================================================

def tokenize_function(examples):

    return tokenizer(
        examples["text"],
        padding=False,
        truncation=True,
        max_length=MAX_LENGTH,
    )


print("\nTokenizing training data...")

tokenized_train = train_dataset.map(
    tokenize_function,
    batched=True,
    desc="Tokenizing train"
)

print("\nTokenizing validation data...")

tokenized_validation = validation_dataset.map(
    tokenize_function,
    batched=True,
    desc="Tokenizing validation"
)

# =========================================================
# Prepare dataset columns
# =========================================================

# Keep the labels column because Trainer needs it as the
# target during training.
#
# Remove only the original text column.
# The "id" column is also unnecessary.

columns_to_remove = [
    "text",
    "id",
]

tokenized_train = tokenized_train.remove_columns(
    [
        column
        for column in columns_to_remove
        if column in tokenized_train.column_names
    ]
)

tokenized_validation = tokenized_validation.remove_columns(
    [
        column
        for column in columns_to_remove
        if column in tokenized_validation.column_names
    ]
)


print("\nFinal training columns:")
print(tokenized_train.column_names)

print("\nFinal validation columns:")
print(tokenized_validation.column_names)

# =========================================================
# Load model
# =========================================================

print("\nLoading RoBERTa model...")

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=num_labels,
    problem_type="multi_label_classification",
    id2label={
        index: label
        for index, label in enumerate(label_names)
    },
    label2id={
        label: index
        for index, label in enumerate(label_names)
    },
)

model.to(device)


# =========================================================
# Training arguments
# =========================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

training_args = TrainingArguments(

    output_dir=str(OUTPUT_DIR),

    num_train_epochs=NUM_EPOCHS,

    per_device_train_batch_size=BATCH_SIZE,

    per_device_eval_batch_size=BATCH_SIZE,

    learning_rate=2e-5,

    weight_decay=0.01,

    logging_steps=50,

    eval_strategy="epoch",

    save_strategy="epoch",

    save_total_limit=2,

    load_best_model_at_end=True,

    metric_for_best_model="eval_loss",

    greater_is_better=False,

    report_to="none",

    fp16=False,

    seed=SEED,
)


# =========================================================
# Trainer
# =========================================================

trainer = Trainer(

    model=model,

    args=training_args,

    train_dataset=tokenized_train,

    eval_dataset=tokenized_validation,

    processing_class=tokenizer,
)


# =========================================================
# Train
# =========================================================

print("\n")
print("=" * 70)
print("STARTING FINE-TUNING")
print("=" * 70)

trainer.train()


# =========================================================
# Save final model
# =========================================================

FINAL_MODEL_DIR = (
    OUTPUT_DIR / "final"
)

print("\nSaving fine-tuned model...")

trainer.save_model(
    str(FINAL_MODEL_DIR)
)

tokenizer.save_pretrained(
    str(FINAL_MODEL_DIR)
)


# =========================================================
# Final validation evaluation
# =========================================================

print("\nRunning validation evaluation...")

validation_results = trainer.evaluate()

print("\nValidation results:")

for key, value in validation_results.items():

    if isinstance(value, float):

        print(
            f"{key}: {value:.4f}"
        )

    else:

        print(
            f"{key}: {value}"
        )


# =========================================================
# Completion
# =========================================================

print("\n")
print("=" * 70)
print("FINE-TUNING COMPLETE")
print("=" * 70)

print(
    f"\nFine-tuned model saved to:\n"
    f"{FINAL_MODEL_DIR}"
)