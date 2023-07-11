import { NextResponse } from "next/server";

const checkResponse = <T>(
  target: T,
  msg: string,
  status: number
): NextResponse | void => {
  if (!target) return new NextResponse(msg, { status: status });
};

export const cUtil = {
  checkResponse,
};
