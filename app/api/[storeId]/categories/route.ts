import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { categoryValidator } from "./requestValidators";

/**
 * category 생성 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 생성된 단일 category 객체 포함 응답
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const res = await categoryValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, billboardId },
      } = res;

      const category = await prismadb.category.create({
        data: { name, billboardId, storeId: params.storeId },
      });

      return NextResponse.json(category);
    }
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * category 읽기 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 스토어 하위 전체 categories 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
