import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/options";
import { pollCommits } from "@/lib/github";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user?.name || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "projectId is required", status: 400 },
        { status: 400 }
      );
    }

    const hasAccess = await prisma.userToProject.findFirst({
      where: {
        projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have access to this project",
          status: 403,
        },
        { status: 403 }
      );
    }

    const commits = await prisma.commit.findMany({
      where: {
        projectId,
      },
      orderBy: {
        commitDate: "desc",
      },
    });
    pollCommits(projectId).catch((error) => {
      console.error("Failed to poll commits:", error);
    });
    return NextResponse.json(
      {
        success: true,
        data: commits,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching commits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching commit details",
        status: 500,
      },
      { status: 500 }
    );
  }
};
