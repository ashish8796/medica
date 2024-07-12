import React from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import OnboardingForm from "@/components/forms/OnboardingForm";
import PaaskeyModal from "@/components/PaaskeyModal";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const Onboarding = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      <PaaskeyModal />
      <section className="container remove-scrollbar">
        <div className="sub-container space-y-10 max-w-[496px]">
          <Logo w="w-[32px]" h="w-[32px]" />

          <div className="space-y-4 pt-8">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Get Started with Appointments.</p>
          </div>

          <OnboardingForm />
        </div>
      </section>

      <Image
        src={"/assets/images/onboarding-img.png"}
        alt="onboarding image"
        width={1000}
        height={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Onboarding;
