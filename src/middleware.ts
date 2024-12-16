import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/dashboard","/billing","profile","prompts","prompts/add","sites","sites/add"];
const publicRoutes = ["/auth/signin"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
    }

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/billing", req.nextUrl));
    }

    return NextResponse.next();
}

export async function session_data() {
     const cookie = (await cookies()).get("session")?.value
     const session_data = await decrypt(cookie)
     return session_data

}