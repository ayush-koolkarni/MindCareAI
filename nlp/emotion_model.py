import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


MODEL_NAME = "training/output/roberta-go-emotions/final"


class EmotionClassifier:
    """
    RoBERTa-based contextual emotion classifier.
    """

    def __init__(self, model_name: str = MODEL_NAME):

        print(f"Loading model: {model_name}")

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Using device: {self.device}")

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name
        )

        self.model.to(self.device)

        self.model.eval()

        # Mapping from model output index to emotion label
        self.id2label = self.model.config.id2label

        print("Model loaded successfully.")
        print(f"Number of emotion classes: {len(self.id2label)}")


    def predict(
        self,
        text: str,
        top_k: int = 5,
        threshold: float = 0.25
    ) -> list[dict]:
       

        if not isinstance(text, str) or not text.strip():
            return []

        # Tokenize input
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        # Move tensors to the correct device
        inputs = {
            key: value.to(self.device)
            for key, value in inputs.items()
        }

        # Disable gradient calculation for inference
        with torch.no_grad():

            outputs = self.model(**inputs)

            # Convert logits into probabilities
            probabilities = torch.sigmoid(outputs.logits)[0]

        # Build emotion results
        results = []

        for index, probability in enumerate(probabilities):

            emotion = self.id2label[index]

            score = float(probability.cpu().item())

            if score >= threshold:

                results.append({
                    "emotion": emotion,
                    "score": score
                })

        # Sort from highest to lowest confidence
        results.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        return results[:top_k]


if __name__ == "__main__":

    classifier = EmotionClassifier()

    test_sentences = [
    "I am happy today.",
    "I am not happy today.",
    "I feel scared.",
    "I am not scared anymore.",
    "I am angry and disappointed.",
    "I feel completely alone and hopeless.",
    "I am feeling better after talking to someone.",
    "I don't know how I will get through tomorrow."
]

    print("\nEmotion classification test")
    print("=" * 60)

    for sentence in test_sentences:

        print(f"\nText: {sentence}")

        predictions = classifier.predict(sentence)

        for prediction in predictions:

            print(
                f"  {prediction['emotion']:<20}"
                f"{prediction['score']:.4f}"
            )