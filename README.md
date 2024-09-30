# Anonymization Service

This project provides an API for text anonymization and deanonymization using FastAPI and Presidio. It also includes a React frontend for interacting with the API.

## Features

- **Anonymization**: Detects and replaces Personally Identifiable Information (PII) in text.
- **Deanonymization**: Restores the original text from the anonymized text using a mapping.

## Technologies Used

- **Backend**: FastAPI, Presidio
- **Frontend**: React, Chakra UI

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/anikethhebbar/anonymization-service.git
    cd anonymization-service
    ```

2. **Backend Setup**:
    - Create a virtual environment and activate it:
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        ```
    - Install the required packages:
        ```bash
        pip install -r requirements.txt
        ```

3. **Frontend Setup**:
    - Navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    - Install the required packages:
        ```bash
        npm install
        ```

## Running the Application

1. **Start the Backend**:
    ```bash
    uvicorn main:app --reload
    ```

2. **Start the Frontend**:
    ```bash
    npm start
    ```

## API Endpoints

- **POST /api/anonymize**: Anonymizes the provided text.
    - **Request Body**:
        ```json
        {
            "text": "Your text here"
        }
        ```
    - **Response**:
        ```json
        {
            "anonymized_text": "Anonymized text here",
            "mapping": {
                "<<ANON_entity_type_start>>": "original_text"
            }
        }
        ```

- **POST /api/deanonymize**: Deanonymizes the provided text using the mapping.
    - **Request Body**:
        ```json
        {
            "anonymized_text": "Anonymized text here",
            "mapping": {
                "<<ANON_entity_type_start>>": "original_text"
            }
        }
        ```
    - **Response**:
        ```json
        {
            "text": "Original text here"
        }
        ```

## Frontend Usage

- **Original Text**: Enter the text you want to anonymize and click "Anonymize".
- **Anonymized Text**: View the anonymized text and click "Deanonymize" to restore the original text.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [Presidio](https://microsoft.github.io/presidio/)
- [Chakra UI](https://chakra-ui.com/)
