import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    console.log("Protected API Accessed");

    // Extract token from cookies or Authorization header
    const cookieHeader = req.headers.get("Cookie");
    console.log("Cookie Sending - "+cookieHeader)
    const token =
      cookieHeader
        ?.split("; ")
        .find((cookie) => cookie.startsWith("token="))
        ?.split("=")[1] ||
      req.headers.get("Authorization")?.replace("Bearer ", "");
      console.log("Token:", token);
      // console.log("Extracted Token:", token);

    if (!token) {
      console.error("No token provided");
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded: { id: number; email: string };
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
      console.log("Decoded Token:", decoded);
    } catch (err) {
      console.error("JWT Verification Error:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      console.error("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User from Database:", user);
    return NextResponse.json(
      { message: "Access granted", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
