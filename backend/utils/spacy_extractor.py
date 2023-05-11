import spacy
import json

nlp = spacy.load("en_core_web_trf")

def spacy_extract_text(input_text):
    value_dict = {}
    value_dict[0] = "Raw Value"
    value_dict[2] = "Value Type"
    value_dict[3] = "Spacy Value"
    value_dict[5] = "Start-End Positions"
    
    label_map = {
        "MONEY": "money",
        "TIME": "time",
        "CARDINAL": "number",
        "DATE": "date",
        "PERCENT": "percent",
        "QUANTITY": "quantity",
        "ORDINAL": "ordinal",
        "GPE": "location",
        "ORG": "organization",
        "PERSON": "person",
    }
    doc = nlp(input_text)
    values = []

    for ent in doc.ents:
        if ent.label_ in label_map:
            values.append({
                value_dict[0]: ent.text,
                value_dict[2]: label_map[ent.label_],
                value_dict[3]: ent.label_,
                value_dict[5]: (ent.start_char, ent.end_char)
            })

    extracted_info = {"values": values}
    json_output = json.dumps(extracted_info)
    return json_output