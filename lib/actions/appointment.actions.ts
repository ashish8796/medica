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
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite";

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

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
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
