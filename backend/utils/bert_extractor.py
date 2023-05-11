import json
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

# Load BERT model for sentiment analysis
tokenizer = AutoTokenizer.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# Load BART model for zero-shot classification
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")
model = AutoModelForSequenceClassification.from_pretrained("facebook/bart-large-mnli")
classification_pipeline = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer)

def bert_extract_text(input_text, sentiment_labels=None, topic_labels=None):
    value_dict = {}
    value_dict[0] = "Value Type"
    value_dict[1] = "BERT Value"
    value_dict[2] = "Confidence Score"

    sentiment_result = sentiment_pipeline(input_text)
    sentiment_star_rating = int(sentiment_result[0]['label'].split()[0])
    sentiment_score = sentiment_result[0]['score']

    # Map star rating to sentiment labels
    sentiment_mapping = {
        1: "Negative",
        2: "Negative",
        3: "Neutral",
        4: "Positive",
        5: "Positive"
    }
    sentiment_label = sentiment_mapping[sentiment_star_rating]

    if sentiment_labels is None:
        sentiment_labels = ["positive", "negative", "neutral"]

    if topic_labels is None:
        topic_labels = [
            "sports", "politics", "technology", "entertainment", "finance",
            "medical", "legal", "lawsuit", "healthcare", "pharmaceuticals",
            "regulations", "contracts", "intellectual property", "dispute resolution"
        ]

    classification_result = classification_pipeline(input_text, candidate_labels=topic_labels)
    classification_label = classification_result["labels"][0]
    classification_score = classification_result["scores"][0]

    values = []
    values.append({
        value_dict[0]: "Sentiment",
        value_dict[1]: f"{sentiment_label} ({sentiment_star_rating} Stars)",
        value_dict[2]: sentiment_score,
    })
    values.append({
        value_dict[0]: "Topic",
        value_dict[1]: classification_label,
        value_dict[2]: classification_score,
    })

    extracted_info = {"values": values}
    json_output = json.dumps(extracted_info)
    return json_output