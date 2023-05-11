import re
import json

def regex_extract_text(input_text):
    value_dict = {
        0: "Raw Value",
        2: "Value Type",
        4: "Numeric Value"
    }

    value_regex = r"\d+"
    multiplier_regex = r"(thousand|k|million|billion)"

    values = []
    for match in re.finditer(value_regex, input_text):
        raw_value = match.group(0)
        if any(multiplier in raw_value for multiplier in ("thousand", "million", "billion", "k", "M")):
            continue
        num_value = float(raw_value.replace(',', ''))
        values.append({
            value_dict[0]: raw_value,
            value_dict[2]: "number",
            value_dict[4]: num_value
        })

    percent_regex = r"\d+(?:\.\d+)?\s?(?:%|percent|percentage)"
    percent_changes = []
    for match in re.finditer(percent_regex, input_text):
        raw_value = match.group(0)
        percent_changes.append({
            value_dict[0]: raw_value,
            value_dict[2]: "percent",
            value_dict[4]: ""
        })

    extracted_info = {
        "values": values,
        "percent_changes": percent_changes
    }

    json_output = json.dumps(extracted_info)
    return json_output