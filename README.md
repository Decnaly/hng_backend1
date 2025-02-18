# hng_backend1
# Number Classify API

A simple Node.js API that classifies a given number based on its mathematical properties and retrieves a fun fact about it from the Numbers API. This project is part of a task to demonstrate backend development skills for the HNG12 internship.

## Features

- **Mathematical Classification**:  
  - Checks if the number is **prime** and **perfect**.
  - Determines if the number is an **Armstrong** number.
  - Identifies whether the number is **odd** or **even**.
  - Calculates the **digit sum** of the number.
- **Fun Fact**:  
  - Retrieves a fun fact about the number using the [Numbers API](http://numbersapi.com/#42).
- **Error Handling**:  
  - Returns a `400 Bad Request` response for invalid inputs.
- **CORS Support**:  
  - Handles Cross-Origin Resource Sharing for integration with any front-end.

## API Endpoint

### GET `/api/classify-number?number=<number>`

#### **Successful Response (200 OK)**

```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}

Error Response (400 Bad Request)
{
  "number": "alphabet",
  "error": true
}

