import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token);

    // Return token in Authorization header
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    
    response.headers.set("Authorization", `Bearer ${token}`);
    response.headers.set("Access-Control-Expose-Headers", "Authorization");


    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
