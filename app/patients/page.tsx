import React from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import PatientForm from "@/components/forms/PatientForm";
import PaaskeyModal from "@/components/PaaskeyModal";
import Copyright from "@/components/copyright/Copyright";
import Link from "next/link";
import { getUser } from "@/lib/actions/patient.actions";

const PatientPage = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin || false;
  const isTestUser = searchParams?.test === "true" || false;
  const testUserId = "669684290016ddb49cac";

  let testUser;

  if (isTestUser) {
    testUser = await getUser(testUserId);
  }

  console.log("testUser", testUser);

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PaaskeyModal />}

      <section className="container remove-scrollbar my-auto">
        <div className="sub-container flex-col space-y-20 max-w-[496px]">
          <Logo w="w-[32px]" h="w-[32px]" />

          <PatientForm testUser={testUser} />
          <section className="text-14-regular mt-20 flex justify-between items-center">
            <Copyright />

            <div className="flex gap-3">
              {!isTestUser && (
                <Link href={"/patients?test=true"} className="text-green-500">
                  Test User
                </Link>
              )}
              <Link href={"/patients?admin=true"} className="text-green-500">
                Admin
              </Link>
            </div>
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
