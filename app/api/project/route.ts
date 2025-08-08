import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { redirect } from "next/navigation";

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
    const { githubUrl, name, githubToken, branchName } = body;

    if (!githubUrl || !name) {
      return NextResponse.json(
        { message: "Missing required fields: githubUrl or name" },
        { status: 400 }
      );
    }

    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          githubUrl,
          githubToken,
          branchName,
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
    pollCommits(project.id).catch((error) => {
      console.error("Failed to poll commits:", error);
    });
    indexGithubRepo(
      project.id,
      project.githubUrl,
      project.branchName,
      project.githubToken
    );
    return NextResponse.json(
      {
        message: "Project created successfully",
        status: 201,
        projectId: project.id,
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
    if (projects.length === 0) {
      // For API routes, we should return a response that the client can use to redirect
      return NextResponse.json(
        {
          redirect: true,
          redirectUrl: "/create",
          message: "No projects found",
        },
        { status: 200 }
      );
    }
    return NextResponse.json({
      message: "Found project for user",
      status: 200,
      data: projects,
    });

    redirect("/create");
  } catch (error) {
    console.error("Error fetching users with projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch users with projects" },
      { status: 500 }
    );
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const projects = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Project Archived",
      status: 200,
    });
  } catch (error) {
    console.error("Error archiving project:", error);
    return NextResponse.json(
      { message: "Failed to archive project" },
      { status: 500 }
    );
  }
};
