# Nerex

The application is designed to extract financial data from texts using various extraction methods such as Regex, Spacy, Word2Number, and BERT sentiment analysis. The frontend provides a user-friendly interface for inputting and analyzing texts and comparing the extracted results.

# Instructions

Clone the git repository by running git clone https://github.com/kittinaphoenix/nerex.git.
Navigate to the root directory of the project.
Create a new file called .env based on the provided .env.template file, and set the values for BACKEND_PORT and FRONTEND_PORT.
In a terminal window, navigate to the backend directory and run docker build -t [backend-image-name] . to build the Docker image for the backend.
In the same terminal window, run docker run -p [backend-host-port]:[backend-container-port] [backend-image-name] to start the backend container.
In another terminal window, navigate to the frontend directory and run docker build -t [frontend-image-name] . to build the Docker image for the frontend.
In the same terminal window, run docker run -p [frontend-host-port]:[frontend-container-port] [frontend-image-name] to start the frontend container.
Open a web browser and navigate to http://localhost:[frontend-host-port] to view the main application page.
To view the comparison feature, navigate to http://localhost:[frontend-host-port]/comparsion.

Note: CORS needs to be disabled in the browser for running the frontend locally. This is a known bug and may be fixed in future iterations.

# Backend

This is a Flask-based API that extracts information from text using different methods.

## API endpoints

POST /api/extract/string:method

Extracts information from text using the specified method.

### Request format

```json
{
  "text": "Sample text",
  "text1": "Sample text 1",
  "text2": "Sample text 2"
}
```
'text' is required for all methods except comparsion.
'text1' and 'text2' are required only for the comparsion method.

### Response format
```json
{
  "result": "Extracted information"
}
```

The output inside 'result' is an array of dictionaries representing a table.

### Supported methods
regex: '/api/extract/regex' extracts information using regular expressions .
spacy: '/api/extract/spacy'  extracts information using the spaCy library.
wordtwonumber: '/api/extract/wordtwonumber'  extracts numbers from text written as words.
bert: '/api/extract/bert'  extracts information using the BERT model.
comparsion: '/api/extract/comparsion'  compares two texts and returns their similarity score.
Notes
The comparsion method returns a value between 0 and 1, where 0 means that the texts are completely different, and 1 means that they are exactly the same.
Manually add the Access-Control-Allow-Origin header using the Flask after_request decorator to allow cross-origin requests.

# Frontend for NLP-powered Named Entity Recognition (NER) Application

## Features
- Extract financial data using different extraction methods
- Analyze and compare multiple input texts
- View extracted data in a table format

## How to Run the Frontend

## Frontend Structure
- server.js: Main server file
- package.json: Contains the project's dependencies and configuration
- public/css/: Styles libraries used for the project
- public/libs/: JS libraries used for the project
- public/webfonts/: FontAwesome fonts
- public/src/app.js: Handles the front-end logic for the main application
- public/src/app.comparsion.js: Handles the front-end logic for the comparison feature
- views/index.ejs: Main application page
- views/comparsion.ejs: Comparison feature page
- public/css/style.css: Styles for the main application
- public/css/style.comparsion.css: Styles for the comparison feature