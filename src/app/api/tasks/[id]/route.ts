import { NextResponse } from "next/server";
import { deleteTask } from "taskmanager/actions/$task_actions";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  await deleteTask(id);
  return new NextResponse(null, { status: 204 });
}