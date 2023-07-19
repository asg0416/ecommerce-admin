import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { sizeValidator } from "../requestValidators";

interface Params {
  storeId: string;
  sizeId: string;
}
/**
 * size 단일 읽기 api
 * @param req
 * @param params
 * @returns size 단일 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * size 단일 수정 api
 *
 * @param req data body 포함된 request 요청 데이터
 * @param params 주소 파람값
 * @returns 수정된 단일 size 객체 포함 응답
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const res = await sizeValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, value },
      } = res;

      const size = await prismadb.size.updateMany({
        where: {
          id: params.sizeId,
        },
        data: { name, value },
      });

      return NextResponse.json(size);
    }
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/*
api 만들때 메서드 뒤에 파라미터 중 req 안쓴다고해서 삭제하면 안됨
params 값 순서가 파라미터 중 2번째라서 request랑 params 순서 지켜서 작성해야함
*/

/**
 * size 단일 삭제 api
 * @param req
 * @param params
 * @returns
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const res = await sizeValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const size = await prismadb.size.deleteMany({
        where: {
          id: params.sizeId,
        },
      });

      console.log("[SIZE_DELETE] - 요청 후 size", size);

      return NextResponse.json(size);
    }
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
