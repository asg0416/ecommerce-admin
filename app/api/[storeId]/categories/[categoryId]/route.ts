import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { categoryValidator } from "../requestValidators";

interface Params {
  storeId: string;
  categoryId: string;
}
/**
 * category 단일 읽기 api
 * @param req
 * @param params
 * @returns category 단일 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * category 단일 수정 api
 *
 * @param req data body 포함된 request 요청 데이터
 * @param params 주소 파람값
 * @returns 수정된 단일 category 객체 포함 응답
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const res = await categoryValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, billboardId },
      } = res;

      const category = await prismadb.category.updateMany({
        where: {
          id: params.categoryId,
        },
        data: { name, billboardId },
      });

      return NextResponse.json(category);
    }
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/*
api 만들때 메서드 뒤에 파라미터 중 req 안쓴다고해서 삭제하면 안됨
params 값 순서가 파라미터 중 2번째라서 request랑 params 순서 지켜서 작성해야함
*/

/**
 * category 단일 삭제 api
 * @param req
 * @param params
 * @returns
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const res = await categoryValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const category = await prismadb.category.deleteMany({
        where: {
          id: params.categoryId,
        },
      });

      console.log("[CATEGORY_DELETE] - 요청 후 category", category);

      return NextResponse.json(category);
    }
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
