import { Patient } from "@/types/appwrite";

export const getPatientDefaultValues = (patient: Patient) => {
  const {
    name,
    email,
    phone,
    birthDate,
    gender,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    primaryPhysician,
    insuranceProvider,
    insurancePolicyNumber,
    allergies,
    currentMedication,
    familyMedicalHistory,
    pastMedicalHistory,
    identificationType,
    identificationNumber,
    treatmentConsent,
    disclosureConsent,
    privacyConsent,
  } = patient;

  return {
    name,
    email,
    phone,
    birthDate: new Date(birthDate),
    gender,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    primaryPhysician,
    insuranceProvider,
    insurancePolicyNumber,
    allergies,
    currentMedication,
    familyMedicalHistory,
    pastMedicalHistory,
    identificationType,
    identificationNumber,
    treatmentConsent,
    disclosureConsent,
    privacyConsent,
  };
};

export const getPatientFormDefaultValues = (testUser: TestUser) => {
  console.log("Sending patient form default values");
  return { ...testUser };
};
