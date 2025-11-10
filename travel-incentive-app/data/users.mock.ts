const MOCK_USER_DATA = {
  "users": [
    {
      "id": "test_user_1",
      "email": "mario.rossi@example.com",
      "password": "hashedPassword123",
      "profile": {
        "firstName": "Mario",
        "lastName": "Rossi",
        "birthDate": "1980-05-15",
        "gender": "M",
        "phone": "+39 333 1234567"
      },
      "passport": {
        "number": "YA1234567",
        "expiryDate": "2028-06-20",
        "countryOfIssue": "IT"
      },
      "travelPreferences": {
        "departureAirport": "MXP",
        "mealPreference": "regular",
        "specialAssistance": []
      },
      "emergencyContact": {
        "name": "Anna Rossi",
        "relationship": "Spouse",
        "phone": "+39 333 7654321",
        "email": "anna.rossi@example.com"
      },
      "registrationStatus": {
        "completed": true,
        "completedAt": "2025-08-15T10:30:00Z",
        "documents": {
          "passport": true,
          "photo": true,
          "termsAccepted": true
        }
      },
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    },
    {
      "id": "test_user_2",
      "email": "laura.bianchi@example.com",
      "password": "hashedPassword456",
      "profile": {
        "firstName": "Laura",
        "lastName": "Bianchi",
        "birthDate": "1985-08-20",
        "gender": "F",
        "phone": "+39 333 2345678"
      },
      "passport": {
        "number": "YB7654321",
        "expiryDate": "2027-12-15",
        "countryOfIssue": "IT"
      },
      "travelPreferences": {
        "departureAirport": "FCO",
        "mealPreference": "vegetarian",
        "specialAssistance": []
      },
      "emergencyContact": {
        "name": "Marco Bianchi",
        "relationship": "Brother",
        "phone": "+39 333 8765432",
        "email": "marco.bianchi@example.com"
      },
      "registrationStatus": {
        "completed": true,
        "completedAt": "2025-08-16T14:45:00Z",
        "documents": {
          "passport": true,
          "photo": true,
          "termsAccepted": true
        }
      },
      "notifications": {
        "email": true,
        "push": true,
        "sms": true
      }
    },
    {
      "id": "test_user_3",
      "email": "giuseppe.verdi@example.com",
      "password": "hashedPassword789",
      "profile": {
        "firstName": "Giuseppe",
        "lastName": "Verdi",
        "birthDate": "1975-03-10",
        "gender": "M",
        "phone": "+39 333 3456789"
      },
      "passport": {
        "number": "YC9876543",
        "expiryDate": "2026-09-30",
        "countryOfIssue": "IT"
      },
      "travelPreferences": {
        "departureAirport": "VCE",
        "mealPreference": "regular",
        "specialAssistance": ["medical"]
      },
      "emergencyContact": {
        "name": "Maria Verdi",
        "relationship": "Wife",
        "phone": "+39 333 9876543",
        "email": "maria.verdi@example.com"
      },
      "registrationStatus": {
        "completed": true,
        "completedAt": "2025-08-17T09:15:00Z",
        "documents": {
          "passport": true,
          "photo": true,
          "termsAccepted": true
        }
      },
      "notifications": {
        "email": true,
        "push": false,
        "sms": true
      }
    }
  ]
}

export default MOCK_USER_DATA;