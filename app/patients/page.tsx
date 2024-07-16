import React from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import PatientForm from "@/components/forms/PatientForm";
import PaaskeyModal from "@/components/PaaskeyModal";
import Copyright from "@/components/copyright/Copyright";
import Link from "next/link";

const PatientPage = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin || false;

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PaaskeyModal />}

      <section className="container remove-scrollbar my-auto">
        <div className="sub-container flex-col space-y-20 max-w-[496px]">
          <Logo w="w-[32px]" h="w-[32px]" />

          <PatientForm />
          <section className="text-14-regular mt-20 flex justify-between">
            <Copyright />
            <Link href={"/patients?admin=true"} className="text-green-500">
              Admin
            </Link>
          </section>
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

export default PatientPage;
