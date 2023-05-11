from word2number import w2n
import json

def word2number_extract_text(input_text):
    value_dict = {}
    value_dict[0] = "Raw Value"
    value_dict[2] = "Value Type"
    value_dict[4] = "Numeric Value"

    values = []
    words = input_text.split()
    for word in words:
        try:
            num_value = w2n.word_to_num(word)
            values.append({value_dict[0]: word, value_dict[2]: "number", value_dict[4]: num_value})
        except ValueError:
            pass

    extracted_info = {"values": values}
    json_output = json.dumps(extracted_info)
    return json_output