'use server';
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function getUserId() {
    const session = await getServerSession(options);
    if (!session) {
        return { msg: "user not logged in" }
    }

    return session.user.id
}