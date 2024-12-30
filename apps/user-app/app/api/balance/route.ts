// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//     const email = req.nextUrl.searchParams.get("email");
  
//     if (!email) {
//       return NextResponse.json({ error: "Email parameter is required." }, { status: 400 });
//     }
  
//     try {
//       const user = await prisma.user.findUnique({ where: { email } });
  
//       if (!user) {
//         return NextResponse.json({ error: "User not found." }, { status: 404 });
//       }
  
//       const balance = await prisma.balance.findUnique({ where: { userId: user.id } });
  
//       if (!balance) {
//         return NextResponse.json({ error: "Balance not found." }, { status: 404 });
//       }
  
//       return NextResponse.json(balance);
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ error: "Error fetching balance." }, { status: 500 });
//     }
//   }
  




import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // For generating unique tokens

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Log the failure in OnRampTransaction
      await prisma.onRampTransaction.create({
        data: {
          userId: -1,
          status: "Failure",
          token: uuidv4(),
          provider: "Balance Check",
          amount: 0,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const balance = await prisma.balance.findUnique({ where: { userId: user.id } });

    if (!balance) {
      // Log the failure in OnRampTransaction
      await prisma.onRampTransaction.create({
        data: {
          userId: user.id,
          status: "Failure",
          token: uuidv4(),
          provider: "Balance Check",
          amount: 0,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ error: "Balance not found." }, { status: 404 });
    }

    // Log the success in OnRampTransaction
    await prisma.onRampTransaction.create({
      data: {
        userId: user.id,
        status: "Success",
        token: uuidv4(),
        provider: "Balance Check",
        amount: 0,
        startTime: new Date(),
      },
    });

    return NextResponse.json(balance);
  } catch (error) {
    console.error(error);

    // Log the error in OnRampTransaction
    await prisma.onRampTransaction.create({
      data: {
        userId: -1,
        status: "Failure",
        token: uuidv4(),
        provider: "Balance Check",
        amount: 0,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ error: "Error fetching balance." }, { status: 500 });
  }
}







// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();

// export default {
//   async fetch(request: Request): Promise<Response> {
//     const url = new URL(request.url);
//     const email = url.searchParams.get("email");

//     if (!email) {
//       return new Response(JSON.stringify({ error: "Email parameter is required." }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     try {
//       const user = await prisma.user.findUnique({ where: { email } });

//       if (!user) {
//         await prisma.onRampTransaction.create({
//           data: {
//             userId: -1,
//             status: "Failure",
//             token: uuidv4(),
//             provider: "Balance Check",
//             amount: 0,
//             startTime: new Date(),
//           },
//         });

//         return new Response(JSON.stringify({ error: "User not found." }), {
//           status: 404,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       const balance = await prisma.balance.findUnique({ where: { userId: user.id } });

//       if (!balance) {
//         await prisma.onRampTransaction.create({
//           data: {
//             userId: user.id,
//             status: "Failure",
//             token: uuidv4(),
//             provider: "Balance Check",
//             amount: 0,
//             startTime: new Date(),
//           },
//         });

//         return new Response(JSON.stringify({ error: "Balance not found." }), {
//           status: 404,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       await prisma.onRampTransaction.create({
//         data: {
//           userId: user.id,
//           status: "Success",
//           token: uuidv4(),
//           provider: "Balance Check",
//           amount: 0,
//           startTime: new Date(),
//         },
//       });

//       return new Response(JSON.stringify(balance), {
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (error) {
//       console.error(error);

//       await prisma.onRampTransaction.create({
//         data: {
//           userId: -1,
//           status: "Failure",
//           token: uuidv4(),
//           provider: "Balance Check",
//           amount: 0,
//           startTime: new Date(),
//         },
//       });

//       return new Response(JSON.stringify({ error: "Error fetching balance." }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   },
// };
