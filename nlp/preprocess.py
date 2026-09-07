import re
import spacy


# Load spaCy English pipeline
nlp = spacy.load("en_core_web_sm")


# Negation words are important for emotional interpretation
NEGATION_WORDS = {
    "not",
    "no",
    "never",
    "neither",
    "nor",
    "n't",
}


def normalize_text(text: str) -> str:
    """
    Basic text normalization while preserving natural language.

    This function intentionally does NOT reconstruct the sentence
    from spaCy tokens because RoBERTa works best with natural text.
    """

    if not isinstance(text, str):
        return ""

    # Normalize repeated whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def split_sentences(text: str) -> list[str]:
    """
    Split text into meaningful sentences using spaCy.
    """

    if not isinstance(text, str):
        return []

    text = normalize_text(text)

    if not text:
        return []

    doc = nlp(text)

    return [
        sentence.text.strip()
        for sentence in doc.sents
        if sentence.text.strip()
    ]


def extract_negation_words(text: str) -> list[str]:
    """
    Extract emotionally important negation words using spaCy.
    """

    if not isinstance(text, str):
        return []

    doc = nlp(text)

    return [
        token.text.lower()
        for token in doc
        if token.lower_ in NEGATION_WORDS
    ]


def get_linguistic_features(text: str) -> dict:
    """
    Extract useful linguistic features using spaCy.

    These features can later be used by the mental-health
    distress/safety layer without modifying the original text
    sent to RoBERTa.
    """

    if not isinstance(text, str):
        return {
            "sentence_count": 0,
            "token_count": 0,
            "negation_count": 0,
            "negations": [],
        }

    text = normalize_text(text)

    if not text:
        return {
            "sentence_count": 0,
            "token_count": 0,
            "negation_count": 0,
            "negations": [],
        }

    doc = nlp(text)

    negations = [
        token.text.lower()
        for token in doc
        if token.lower_ in NEGATION_WORDS
    ]

    return {
        "sentence_count": len(list(doc.sents)),
        "token_count": len(
            [
                token
                for token in doc
                if not token.is_space
            ]
        ),
        "negation_count": len(negations),
        "negations": negations,
    }


def preprocess_text(text: str) -> str:
    """
    Prepare text for the NLP pipeline.

    IMPORTANT:
    We preserve the natural-language sentence instead of
    reconstructing it from spaCy tokens.

    This means RoBERTa receives text that is as close as
    possible to the original user input.
    """

    return normalize_text(text)


if __name__ == "__main__":

    test_text = """
    I was scared yesterday.
    Today I feel a little better.
    But I am still worried about what might happen.
    I am not happy anymore.
    """

    print("\nSentence segmentation test\n")
    print("-" * 60)

    sentences = split_sentences(test_text)

    for i, sentence in enumerate(sentences, start=1):
        print(f"{i}. {sentence}")

    print("\nPreprocessing test\n")
    print("-" * 60)

    for sentence in sentences:
        print(f"Original : {sentence}")
        print(f"Processed: {preprocess_text(sentence)}")
        print("-" * 60)

    print("\nNegation detection test\n")
    print("-" * 60)

    print(extract_negation_words(test_text))

    print("\nLinguistic features test\n")
    print("-" * 60)

    print(get_linguistic_features(test_text))