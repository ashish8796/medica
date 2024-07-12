import Logo from "@/components/Logo";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px]">
          <Logo w="w-[32px]" h="h-[32px]" />
        </div>

        <div className="space-y-4 pt-8">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </div>

        <AppointmentForm
          type="create"
          userId={userId}
          patientId={patient?.id}
        />
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
