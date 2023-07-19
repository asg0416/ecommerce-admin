import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { sizeValidator } from "./requestValidators";

/**
 * size 생성 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 생성된 단일 size 객체 포함 응답
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const res = await sizeValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, value },
      } = res;

      const size = await prismadb.size.create({
        data: { name, value, storeId: params.storeId },
      });

      return NextResponse.json(size);
    }
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * size 읽기 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 스토어 하위 전체 sizes 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
