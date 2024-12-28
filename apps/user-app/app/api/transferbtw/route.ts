// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const { email, amount } = await req.json();

//   if (!email || !amount || amount <= 0) {
//     return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
//   }

//   try {
    
//     const user = await prisma.user.findUnique({ where: { email } });
//     console.log("Bank to wallet user - "+ user);
    

//     if (!user) {
//       return NextResponse.json({ error: "User not found." }, { status: 404 });
//     }

//     const [bankBalance] = await prisma.$transaction([
//       prisma.balance.findUnique({ where: { userId: user.id } }),
//     ]);
//     console.log("Bank to wallet bankbalance - "+ bankBalance);
//     if (!bankBalance || bankBalance.amount < amount) {
//       return NextResponse.json({ error: "Insufficient bank balance." }, { status: 400 });
//     }

//     await prisma.$transaction([
//       prisma.balance.update({
//         where: { userId: user.id },
//         data: {
//           amount: { decrement: amount },
//           locked: { increment: amount },
//         },
//       }),
//     ]);

//     return NextResponse.json({ message: "Transfer successful." });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Transaction failed." }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // For generating unique tokens

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, amount } = await req.json();

  if (!email || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Bank to wallet user - ", user);

    if (!user) {
      // Log failure in OnRampTransaction
      await prisma.onRampTransaction.create({
        data: {
          userId: -1,
          status: "Failure",
          token: uuidv4(),
          provider: "Bank to Wallet",
          amount,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const [bankBalance] = await prisma.$transaction([
      prisma.balance.findUnique({ where: { userId: user.id } }),
    ]);
    console.log("Bank to wallet bankbalance - ", bankBalance);

    if (!bankBalance || bankBalance.amount < amount) {
      // Log failure in OnRampTransaction
      await prisma.onRampTransaction.create({
        data: {
          userId: user.id,
          status: "Failure",
          token: uuidv4(),
          provider: "Bank to Wallet",
          amount,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ error: "Insufficient bank balance." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.balance.update({
        where: { userId: user.id },
        data: {
          amount: { decrement: amount },
          locked: { increment: amount },
        },
      }),
    ]);

    // Log success in OnRampTransaction
    await prisma.onRampTransaction.create({
      data: {
        userId: user.id,
        status: "Success",
        token: uuidv4(),
        provider: "Bank to Wallet",
        amount,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ message: "Transfer successful." });
  } catch (error) {
    console.error(error);

    // Log error in OnRampTransaction
    await prisma.onRampTransaction.create({
      data: {
        userId: -1,
        status: "Failure",
        token: uuidv4(),
        provider: "Bank to Wallet",
        amount,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ error: "Transaction failed." }, { status: 500 });
  }
}
