from flask import Flask, request, jsonify, Blueprint
from utils.regex_extractor import regex_extract_text
from utils.spacy_extractor import spacy_extract_text
from utils.word2number_extractor import word2number_extract_text
from utils.bert_extractor import bert_extract_text
from utils.comparsion import compare_texts

bp = Blueprint('api', __name__)

METHODS = {
    'regex': regex_extract_text,
    'spacy': spacy_extract_text,
    'wordtwonumber': word2number_extract_text,
    'bert': bert_extract_text,
    'comparsion': compare_texts
}

@bp.route('/extract/<string:method>', methods=['POST'])
def process(method):
    data = request.get_json()
    text = data.get('text')
    text1 = data.get('text1')
    text2 = data.get('text2')

    process_method = METHODS.get(method)
    if process_method is None:
        return jsonify({'error': f'Method {method} not found'}), 404

    try:
        print(f"Selected method: {method}")
        print(f"Executing method: {method}")
        
        if method == "comparsion":
            result = process_method(text1, text2)
        else:
            result = process_method(text)
        
        print(f"Result of method {method}: {result}")
    except Exception as e:
        print(f"Error while executing method: {method}")
        print(f"Error details: {e}")
        return jsonify({'error': str(e)}), 400

    return jsonify({'result': result}), 200