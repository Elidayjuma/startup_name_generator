"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../../lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
const bcrypt = require('bcrypt');

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {

  const testUser = await prisma.user.findUnique({
    where: {
        email: formData.get("email") as string
    },
  });

  if (!testUser) {
    return {
      errors: { email: ["Invalid email or password"] },}}
   

  
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }


  const { password } = result.data;
  const comparison = await bcrypt.compare(password, testUser.password);
  if ( !comparison) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(testUser.id);

  redirect("/billing");
}

export async function logout() {
  await deleteSession();
  redirect("/auth/signin");
}