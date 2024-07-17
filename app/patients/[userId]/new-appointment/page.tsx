import Logo from "@/components/Logo";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

const NewAppointment = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const patient = await getPatient(userId);
  const isTestUser = searchParams?.test === "true" || false;

  Sentry.metrics.set("patient_view_new_appointment", patient?.name as string);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Logo w="w-[32px]" h="h-[32px]" />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id as string}
            isTestUser={isTestUser}
          />
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        alt="background"
        width={1000}
        height={1000}
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default NewAppointment;
