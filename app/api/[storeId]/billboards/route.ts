import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ReturnType, billboardValidator } from "./requestValidators";

/**
 * billboard 생성 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 생성된 단일 billboard 객체 포함 응답
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const res = await billboardValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const {
        body: { label, imageUrl },
      } = (await billboardValidator(req, params)) as ReturnType;

      const billboard = await prismadb.billboard.create({
        data: { label, imageUrl, storeId: params.storeId },
      });

      return NextResponse.json(billboard);
    }
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * billboard 읽기 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 스토어 하위 전체 billboards 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
