from nlp.preprocess import (
    preprocess_text,
    split_sentences,
    get_linguistic_features,
)
from nlp.emotion_model import EmotionClassifier


class NLPInference:
    def __init__(self):
        print("Initializing NLP inference pipeline...")
        self.emotion_classifier = EmotionClassifier()
        print("NLP inference pipeline ready.")

    def analyze(self, text: str) -> dict:
        if not isinstance(text, str) or not text.strip():
            return {
                "text": "",
                "sentences": [],
                "linguistic_features": {},
                "emotions": [],
            }

        original_text = text.strip()

        # spaCy-based processing
        sentences = split_sentences(original_text)
        linguistic_features = get_linguistic_features(original_text)

        # Preserve natural text for RoBERTa
        processed_text = preprocess_text(original_text)

        # RoBERTa emotion classification
        emotions = self.emotion_classifier.predict(
            processed_text,
            top_k=5,
            threshold=0.25,
        )

        return {
            "text": original_text,
            "sentences": sentences,
            "linguistic_features": linguistic_features,
            "emotions": emotions,
        }


if __name__ == "__main__":
    pipeline = NLPInference()

    test_texts = [
        "I feel completely overwhelmed and scared.",
        "I am not happy anymore.",
        "I was scared yesterday, but today I feel a little better.",
        "I don't know how I will get through tomorrow.",
    ]

    print("\n")
    print("=" * 70)
    print("MindCareAI - Combined NLP Pipeline Test")
    print("=" * 70)

    for text in test_texts:
        result = pipeline.analyze(text)

        print(f"\nText: {result['text']}")
        print(f"Sentences: {result['sentences']}")
        print(f"Linguistic features: {result['linguistic_features']}")
        print("Emotions:")

        for emotion in result["emotions"]:
            print(
                f"  {emotion['emotion']:<20}"
                f"{emotion['score']:.4f}"
            )