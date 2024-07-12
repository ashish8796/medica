import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import Image from "next/image";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const SuccessAppointment = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const user = await getUser(userId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment?.primaryPhysician
  );

  Sentry.metrics.set("user_view_new_appointment", user?.name as string);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px]">
          <Link href="/">
            <Logo w="w-[32px]" h="h-[32px]" />
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center">
        <Image
          src="/assets/gifs/success.gif"
          alt="success"
          width={300}
          height={280}
        />

        <h2 className="header mb-6 max-w-[600px] text-center">
          Your <span className="text-green-500">appointment request</span> has
          been successfully submitted!
        </h2>

        <p>We will be in touch shortly to confirm.</p>
      </section>

      <section className="request-details">
        <p>Requested appointment details:</p>

        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image as string}
            alt="doctor"
            height={100}
            width={100}
          />

          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>

        <div className="flex gap-2">
          <Image
            src="/assets/icons/calendar.svg"
            alt="calendar"
            width={24}
            height={24}
          />

          <p>{formatDateTime(appointment?.schedule as Date).dateTime}</p>
        </div>
      </section>

      <Button variant={"outline"} className="shad-primary-btn" asChild>
        <Link href={`/patients/${userId}/new-appointment`}>
          New Appointment
        </Link>
      </Button>

      <p className="copyright">Copyright © 2022. All rights reserved.</p>
    </div>
  );
};

export default SuccessAppointment;
