import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");
  
    if (!email) {
      return NextResponse.json({ error: "Email parameter is required." }, { status: 400 });
    }
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
  
      const transactions = await prisma.onRampTransaction.findMany({
        where: { userId: user.id },
        orderBy: { startTime: "desc" },
      });
  
      return NextResponse.json(transactions);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error fetching transactions." }, { status: 500 });
    }
  }
  