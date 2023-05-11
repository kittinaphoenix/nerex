import json
import spacy
import pandas as pd
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

nlp = spacy.load("en_core_web_trf")

tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")
model = AutoModelForSequenceClassification.from_pretrained("facebook/bart-large-mnli")
classification_pipeline = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer)

def parse_large_number(text):
    multipliers = {
        'thousand': 1_000,
        'million': 1_000_000,
        'billion': 1_000_000_000,
        'trillion': 1_000_000_000_000
    }

    for multiplier, value in multipliers.items():
        if multiplier in text.lower():
            num = float(text.lower().replace(multiplier, "").replace(",", "").strip())
            return num * value

    return float(text.replace(",", "").strip())

def extract_entities(input_text):
    relevant_labels = ["MONEY", "TIME", "CARDINAL", "DATE", "PERCENT", "QUANTITY", "ORDINAL"]
    doc = nlp(input_text)
    entities = []

    for ent in doc.ents:
        if ent.label_ in relevant_labels:
            entities.append({
                "text": ent.text,
                "type": ent.label_,
                "start_char": ent.start_char,
                "end_char": ent.end_char
            })

    return entities

def compare_summary(text1, text2, classification_labels=None):
    if classification_labels is None:
        classification_labels = [
            "viable", "not viable", "expensive", "cheap", "fast", "slow",
            "high quality", "low quality", "high risk", "low risk"
        ]

    summary_data = []
    for label in classification_labels:
        score1 = classification_pipeline(text1, candidate_labels=[label])["scores"][0]
        score2 = classification_pipeline(text2, candidate_labels=[label])["scores"][0]
        summary_data.append({
            "label": label,
            "text1_score": score1,
            "text2_score": score2
        })

    return summary_data

def compare_summary(text1, text2, classification_labels=None):
    if classification_labels is None:
        classification_labels = [
            "viable", "not viable", "expensive", "cheap", "fast", "slow",
            "high quality", "low quality", "high risk", "low risk"
        ]

    summary_data = []
    for label in classification_labels:
        score1 = classification_pipeline(text1, candidate_labels=[label])["scores"][0]
        score2 = classification_pipeline(text2, candidate_labels=[label])["scores"][0]
        summary_data.append({
            "label": label,
            "text1_score": score1,
            "text2_score": score2
        })

    return summary_data

def compare_texts(text1, text2, classification_labels=None):
    if classification_labels is None:
        classification_labels = [
            "viable", "not viable", "expensive", "cheap", "fast", "slow",
            "high quality", "low quality", "high risk", "low risk"
        ]

    entities1 = extract_entities(text1)
    entities2 = extract_entities(text2)

    # Generate the comparison summary table
    summary_table_data = compare_summary(text1, text2, classification_labels)

    summary = f"Text 1 has {len(entities1)} relevant entities, while Text 2 has {len(entities2)} relevant entities. "
    results = [
        {"type": "table", "title": "Table 1", "data": entities1},
        {"type": "table", "title": "Table 2", "data": entities2},
        {"type": "text", "title": "Summary", "data": summary},
        {"type": "table", "title": "Summary Comparison", "data": summary_table_data}
    ]

    return json.dumps(results)