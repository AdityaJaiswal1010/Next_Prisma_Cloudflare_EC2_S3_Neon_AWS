import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "../../../../../packages/orm_prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, number } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        number,
        Balance: {
          create: {
            amount: 1000, // Initial bank balance
            locked: 0, // Initial wallet balance
          },
        },
      } as Prisma.UserCreateInput,
      include: {
        Balance: true,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
