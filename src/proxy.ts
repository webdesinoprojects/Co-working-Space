import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Disabled — matcher set to nothing. Auth is checked server-side in layouts.
  matcher: [],
};
