"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  messaging,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "./../utils";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    console.log({ newAppointment });

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating the appointment:", error);
    return null;
  }
};

export const getAppointment = async (
  appointmentId: string
): Promise<Appointment | null> => {
  try {
    const appointmentDocument = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointmentDocument);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the appointment details:",
      error
    );
    return null;
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      pending: 0,
      cancelled: 0,
      appointments: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc: any, appointment: any) => {
        if (appointment.status === "pending") {
          acc.pending += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelled += 1;
        } else {
          acc.appointments += 1;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      ...counts,
      totalCount: appointments.total,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {}
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `
    Hi, it's Medica.
    ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}.`
        : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}.`
    }`;

    // Send SMS
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");

    return parseStringify(updatedAppointment);
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the appointment details:",
      error
    );

    if (error && error?.code && error?.code === 400) {
      return parseStringify({
        message: error.response.message,
        status: error.code,
      });
    }

    return null;
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};
