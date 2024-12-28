// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();


// export async function POST(req: NextRequest) {
//     const { senderEmail, recipientEmail, amount } = await req.json();
  
//     if (!senderEmail || !recipientEmail || !amount || amount <= 0) {
//       return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
//     }
  
//     try {
//       const [sender, recipient] = await prisma.$transaction([
//         prisma.user.findUnique({ where: { email: senderEmail } }),
//         prisma.user.findUnique({ where: { email: recipientEmail } }),
//       ]);
  
//       if (!sender || !recipient) {
//         return NextResponse.json({ error: "User(s) not found." }, { status: 404 });
//       }
  
//       const senderBalance = await prisma.balance.findUnique({ where: { userId: sender.id } });
  
//       if (!senderBalance || senderBalance.locked < amount) {
//         return NextResponse.json({ error: "Insufficient wallet balance." }, { status: 400 });
//       }
  
//       await prisma.$transaction([
//         prisma.balance.update({
//           where: { userId: sender.id },
//           data: { locked: { decrement: amount } },
//         }),
//         prisma.balance.update({
//           where: { userId: recipient.id },
//           data: { locked: { increment: amount } },
//         }),
//       ]);
  
//       return NextResponse.json({ message: "Transfer successful." });
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ error: "Transaction failed." }, { status: 500 });
//     }
//   }
  



import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // For generating unique tokens

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { senderEmail, recipientEmail, amount } = await req.json();

  if (!senderEmail || !recipientEmail || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  }

  try {
    const [sender, recipient] = await prisma.$transaction([
      prisma.user.findUnique({ where: { email: senderEmail } }),
      prisma.user.findUnique({ where: { email: recipientEmail } }),
    ]);

    if (!sender || !recipient) {
      // Log failure in OnRampTransaction for both users
      if (sender) {
        await prisma.onRampTransaction.create({
          data: {
            userId: sender.id,
            status: "Failure",
            token: uuidv4(),
            provider: "Wallet to Wallet",
            amount,
            startTime: new Date(),
          },
        });
      }
      if (recipient) {
        await prisma.onRampTransaction.create({
          data: {
            userId: recipient.id,
            status: "Failure",
            token: uuidv4(),
            provider: "Wallet to Wallet",
            amount,
            startTime: new Date(),
          },
        });
      }

      return NextResponse.json({ error: "User(s) not found." }, { status: 404 });
    }

    const senderBalance = await prisma.balance.findUnique({ where: { userId: sender.id } });

    if (!senderBalance || senderBalance.locked < amount) {
      // Log failure in OnRampTransaction for sender
      await prisma.onRampTransaction.create({
        data: {
          userId: sender.id,
          status: "Failure",
          token: uuidv4(),
          provider: "Wallet to Wallet",
          amount,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ error: "Insufficient wallet balance." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.balance.update({
        where: { userId: sender.id },
        data: { locked: { decrement: amount } },
      }),
      prisma.balance.update({
        where: { userId: recipient.id },
        data: { locked: { increment: amount } },
      }),
    ]);

    // Log success in OnRampTransaction for both sender and recipient
    await prisma.onRampTransaction.create({
      data: {
        userId: sender.id,
        status: "Success",
        token: uuidv4(),
        provider: "Wallet to Wallet",
        amount,
        startTime: new Date(),
      },
    });

    await prisma.onRampTransaction.create({
      data: {
        userId: recipient.id,
        status: "Success",
        token: uuidv4(),
        provider: "Wallet to Wallet",
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
        provider: "Wallet to Wallet",
        amount,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ error: "Transaction failed." }, { status: 500 });
  }
}
