import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

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
    const { githubUrl, name, githubToken } = body;

    if (!githubUrl || !name) {
      return NextResponse.json(
        { message: "Missing required fields: githubUrl or name" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          githubUrl,
          githubToken,
        },
      });
      await tx.userToProject.create({
        data: {
          userId: session.user.id,
          projectId: newProject.id,
        },
      });

      return newProject;
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        status: 201,
        projectId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project creation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Failed to create project",
        error: errorMessage,
        status: 500,
      },
      { status: 500 }
    );
  }
};

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        UserToProject: {
          some: {
            userId: session.user.id,
          },
        },
        deletedAt: null,
      },
    });

    return NextResponse.json({
      message: "Found project for user",
      status: 200,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching users with projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch users with projects" },
      { status: 500 }
    );
  }
}
