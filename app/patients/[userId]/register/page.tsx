import Logo from "@/components/Logo";
import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";
import { Patient } from "@/types/appwrite";

const Register = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const user = await getUser(userId);
  const isTestUser = searchParams?.test === "true" || false;
  const testUserId = "669684290016ddb49cac";
  let testPatient;

  if (isTestUser) {
    testPatient = await getPatient(testUserId);
  }

  Sentry.metrics.set("user_view_register", user.name);

  // console.log("Test Patient", testPatient);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Logo w="w-[32px]" h="h-[32px]" />
          <RegisterForm
            user={user}
            testPatient={isTestUser ? (testPatient as Patient) : null}
          />
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        alt="background"
        width={1000}
        height={1000}
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
