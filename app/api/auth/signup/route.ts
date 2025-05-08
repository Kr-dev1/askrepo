import { PrismaClient } from "@/app/generated/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  const body = await req.json();
  const { name, email, password } = body;
  try {
    const exisitingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: { contains: email } }, { name: { contains: name } }],
      },
    });

    if (exisitingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with name or email",
          status: 409,
        },
        { status: 409 }
      );
    }
    const hashedPassowrd = await bcrypt.hash(password, 8);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassowrd,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "User Created Succesfully",
        status: 201,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong, Please try again in sometime",
        status: 500,
      },
      { status: 500 }
    );
  }
};
