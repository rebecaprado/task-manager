import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      })
      
      return Response.json(session)
    } catch {
      return Response.json({ user: null }, { status: 401 })
    }
}