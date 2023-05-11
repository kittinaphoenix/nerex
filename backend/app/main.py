import sys
from pathlib import Path
from flask import Flask

sys.path.append(str(Path(__file__).parent.parent))

from api.routes import bp as api_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api')

# Manually add the Access-Control-Allow-Origin header
@app.after_request
def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')