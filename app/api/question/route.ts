import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

interface QuestionRequest {
  answer: string;
  fileReferences: any;
  projectId: string;
  question: string;
  userId: string;
}

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { answer, fileReferences, projectId, question, userId } =
      body as QuestionRequest;

    if (!projectId || !question) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.$transaction(async (tx) => {
      return tx.question.create({
        data: {
          answer,
          fileReferences,
          projectId,
          question,
          userId: session.user.id,
        },
      });
    });
    return NextResponse.json(
      {
        message: "Question saved successfully",
        status: 201,
        questionId: newQuestion.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project creation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Failed to save question",
        error: errorMessage,
        status: 500,
      },
      { status: 500 }
    );
  }
};
