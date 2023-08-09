import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return { accesToken: session?.accessToken!, user: session?.user };
}

export async function getSession() {
  return getServerSession(authOptions);
}
