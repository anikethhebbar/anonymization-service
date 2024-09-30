import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from typing import List, Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Initialize Presidio engines
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

class TextInput(BaseModel):
    text: str

class AnonymizationResult(BaseModel):
    anonymized_text: str
    mapping: Dict[str, str]  # {replacement_text: original_text, ...}

@app.post("/api/anonymize", response_model=AnonymizationResult)
async def anonymize_text(input: TextInput):
    try:
        # Analyze the text for PII entities
        analyzer_results = analyzer.analyze(text=input.text, language="en")
        
        # Store the mapping of replacement text to original text
        mapping = {}
        anonymized_text = input.text
        
        # Iterate over analyzer results in reverse to avoid replacing indices too early
        for result in sorted(analyzer_results, key=lambda x: x.start, reverse=True):
            # Define the replacement text
            replacement = f"<<ANON_{result.entity_type.lower()}_{result.start}>>"
            original_text = input.text[result.start:result.end]
            
            # Replace in the text at specific positions (avoid substring issues)
            anonymized_text = (
                anonymized_text[:result.start] + replacement + anonymized_text[result.end:]
            )
            
            # Keep track of original text and its replacement for deanonymization
            mapping[replacement] = original_text
        
        return AnonymizationResult(anonymized_text=anonymized_text, mapping=mapping)
    except Exception as e:
        logger.error(f"Error during anonymization: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during anonymization")

@app.post("/api/deanonymize", response_model=TextInput)
async def deanonymize_text(input: AnonymizationResult):
    try:
        deanonymized_text = input.anonymized_text
        for replacement, original_text in input.mapping.items():
            deanonymized_text = deanonymized_text.replace(replacement, original_text)
        return TextInput(text=deanonymized_text)
    except Exception as e:
        logger.error(f"Error during deanonymization: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during deanonymization")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)