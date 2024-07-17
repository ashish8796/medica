"use client";

import { PatientFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { registerPatient } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import Image from "next/image";
import FileUpload from "../FileUpload";
import { SelectItem } from "../ui/select";
import { Patient } from "@/types/appwrite";
import { getPatientDefaultValues } from "@/lib/helper";

const RegisterForm = ({
  user,
  testPatient = null,
}: {
  user: User;
  testPatient: Patient | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: testPatient
      ? { ...getPatientDefaultValues(testPatient), identificationDocument: [] }
      : {
          ...PatientFormDefaultValues,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        isTestUser: testPatient ? true : false,
      };

      const newPatient = await registerPatient(patient);
      if (newPatient) {
        router.push(
          `/patients/${user.$id}/new-appointment${
            testPatient ? "?test=true" : ""
          }`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-3 pt-14">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="Ethan Smith"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="xyz@email.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
          </div>

          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone"
              placeholder="+91-1234567890"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />

          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="123 Main St"
            />
          </div>
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />
          </div>
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="+91-1234567890"
            />
          </div>
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        {/* PRIMARY CARE PHYSICIAN */}
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary care Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor, i) => {
            return (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    height={32}
                    width={32}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            );
          })}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="BlueCross BlueShield"
            />
          </div>

          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />
          </div>
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medication (if any)"
              placeholder="Ibuprofen 20mg, Paracetamol 500mg"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family medical history"
              placeholder="Mother had brain cancer, Father had heart disease"
            />
          </div>

          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Broken arm, Appendicitis"
            />
          </div>
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="identificationType"
              label="Identification Type"
              placeholder="Select identification type"
            >
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>

          <div className="xl:flex-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />
          </div>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUpload files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
