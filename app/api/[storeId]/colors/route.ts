import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { colorValidator } from "./requestValidators";

/**
 * color 생성 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 생성된 단일 color 객체 포함 응답
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const res = await colorValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, value },
      } = res;

      const color = await prismadb.color.create({
        data: { name, value, storeId: params.storeId },
      });

      return NextResponse.json(color);
    }
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * color 읽기 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 스토어 하위 전체 colors 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
