export const getTestFormData = () => {
  return {
    // Dati personali
    firstName: "Mario",
    lastName: "Rossi",
    email: "mario.rossi@example.com",
    mobilePhone: "+39 333 1234567",
    birthDate: "1980-01-01",
    nationality: "Italiana",
    passportNumber: "YA1234567",
    passportIssueDate: "2020-01-01",
    passportExpiryDate: "2030-01-01",
    passportInRenewal: false,
    
    // Dati aziendali
    companyName: "Test Company S.r.l.",
    billingCompanyName: "Test Company S.r.l.",
    vatNumber: "IT12345678901",
    billingStreet: "Via Test 123",
    billingCity: "Milano",
    billingPostalCode: "20123",
    billingCountry: "Italia",
    billingEmail: "billing@testcompany.com",
    
    // Accompagnatore
    hasCompanion: true,
    companionFirstName: "Anna",
    companionLastName: "Bianchi",
    companionEmail: "anna.bianchi@example.com",
    companionBirthDate: "1985-01-01",
    companionNationality: "Italiana",
    companionPassportNumber: "YB9876543",
    companionPassportIssueDate: "2020-01-01",
    companionPassportExpiryDate: "2030-01-01",
    companionPassportInRenewal: false,
    companionMobilePhone: "+39 333 7654321",
    companionDataProcessingConsent: true,

    // Preferenze
    dietaryRequirements: "Vegetariano",
    specialAssistance: "",
    
    // Consensi
    termsAndConditions: true,
    privacyPolicy: true,
    marketing: true,
    dataProcessingConsentCompanion: true
  };
};