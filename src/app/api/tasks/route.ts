import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
