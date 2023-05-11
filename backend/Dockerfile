FROM python:3.9.16-slim-buster
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
RUN python -m spacy download en_core_web_trf
CMD ["python", "app/main.py"]