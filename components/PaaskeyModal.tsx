"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PaaskeyModal = () => {
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const path = usePathname();
  const router = useRouter();

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedPasskey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedPasskey);

      setOpen(false);
      router.push("/admin");
    } else {
      setError("Invalid passkey. Please try again");
    }
  };

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => closeModal()}
            />
          </AlertDialogTitle>

          <AlertDialogDescription>
            To access the admin page, please enter the passkey 123456 to verify.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot xs:size-12 " />
              <InputOTPSlot index={1} className="shad-otp-slot xs:size-12 " />
              <InputOTPSlot index={2} className="shad-otp-slot xs:size-12 " />
              <InputOTPSlot index={3} className="shad-otp-slot xs:size-12 " />
              <InputOTPSlot index={4} className="shad-otp-slot xs:size-12 " />
              <InputOTPSlot index={5} className="shad-otp-slot xs:size-12 " />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaaskeyModal;
