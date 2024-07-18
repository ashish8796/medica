"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
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

import { Patient } from "@/types/appwrite";
import { cookies } from "next/headers";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    console.log("Error creating user: ", error?.response);

    const phoneQuery = Query.equal("phone", [user.phone]);
    const emailQuery = Query.equal("email", [user.email]);

    // Combine the queries with a logical OR
    const combinedQuery = Query.or([phoneQuery, emailQuery]);
    if (error && error?.code === 409) {
      const documents = await users.list([combinedQuery]);

      return parseStringify(documents.users[0]);
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string): Promise<Patient | null> => {
  console.log("I m getting patient.");
  try {
    // disable cache for this server action
    const _cookies = cookies();

    const patientDocuments = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    console.log("Patient Documents: ", patientDocuments);

    return patientDocuments.documents.length > 0
      ? parseStringify(patientDocuments.documents[0])
      : null;
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    return null;
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  isTestUser,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file to storage
    let file;

    if (identificationDocument) {
      const blobFile = identificationDocument?.get("blobFile") as Blob;
      const fileName = identificationDocument?.get("fileName") as string;

      // Convert Blob to Buffer
      const arrayBuffer = await blobFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const inputFile = InputFile.fromBuffer(buffer, fileName);

      try {
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      } catch (storageError) {
        console.error(
          "An error occurred while uploading the file:",
          storageError
        );
        throw storageError; // Rethrow the error after logging
      }
    }

    if (isTestUser) {
      return parseStringify(await getPatient(patient?.userId));
    } else {
      // Create new patient document
      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id || null,
          identificationDocumentUrl: file?.$id
            ? `${ENDPOINT}/storage/bucket/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
            : null,
          ...patient,
        }
      );

      return parseStringify(newPatient);
    }
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
