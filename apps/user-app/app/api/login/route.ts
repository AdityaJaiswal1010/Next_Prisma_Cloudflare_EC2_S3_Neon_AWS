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










// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// export default {
//   async fetch(request: Request): Promise<Response> {
//     if (request.method === "POST") {
//       try {
//         const body = await request.json();
//         const { email, password } = body;

//         if (!email || !password) {
//           return new Response(JSON.stringify({ error: "Email and password are required" }), {
//             status: 400,
//             headers: { "Content-Type": "application/json" },
//           });
//         }

//         // Find user in the database
//         const user = await prisma.user.findUnique({
//           where: { email },
//           select: { id: true, email: true, name: true, password: true },
//         });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//           return new Response(JSON.stringify({ error: "Invalid email or password" }), {
//             status: 401,
//             headers: { "Content-Type": "application/json" },
//           });
//         }

//         // Generate JWT
//         const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
//           expiresIn: "1h",
//         });

//         console.log("Generated Token:", token);

//         // Return token in Authorization header
//         return new Response(
//           JSON.stringify({ message: "Login successful" }),
//           {
//             status: 200,
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//               "Access-Control-Expose-Headers": "Authorization",
//             },
//           }
//         );
//       } catch (error) {
//         console.error("Login Error:", error);
//         return new Response(
//           JSON.stringify({ error: "Internal server error" }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       }
//     }

//     return new Response("Method Not Allowed", { status: 405 });
//   },
// };
