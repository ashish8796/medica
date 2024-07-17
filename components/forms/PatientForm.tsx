"use client";

import { UserFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useCallback, useEffect, useState } from "react";
import { createUser } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { getPatientFormDefaultValues } from "@/lib/helper";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = ({ testUser = null }: { testUser: TestUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (user)
        router.push(
          `/patients/${user.$id}/register${testUser ? "?test=true" : ""}`
        );
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (testUser) {
      form.reset(getPatientFormDefaultValues(testUser));
    }
  }, [form, testUser]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-3">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get Started with Appointments.</p>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Ethan Smith"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="xyz@email.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone"
          placeholder="+91-1234567890"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
