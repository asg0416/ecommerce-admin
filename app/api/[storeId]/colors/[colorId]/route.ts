import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { colorValidator } from "../requestValidators";

interface Params {
  storeId: string;
  colorId: string;
}
/**
 * color 단일 읽기 api
 * @param req
 * @param params
 * @returns color 단일 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * color 단일 수정 api
 *
 * @param req data body 포함된 request 요청 데이터
 * @param params 주소 파람값
 * @returns 수정된 단일 color 객체 포함 응답
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const res = await colorValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: { name, value },
      } = res;

      const color = await prismadb.color.updateMany({
        where: {
          id: params.colorId,
        },
        data: { name, value },
      });

      return NextResponse.json(color);
    }
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/*
api 만들때 메서드 뒤에 파라미터 중 req 안쓴다고해서 삭제하면 안됨
params 값 순서가 파라미터 중 2번째라서 request랑 params 순서 지켜서 작성해야함
*/

/**
 * color 단일 삭제 api
 * @param req
 * @param params
 * @returns
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const res = await colorValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const color = await prismadb.color.deleteMany({
        where: {
          id: params.colorId,
        },
      });

      console.log("[COLOR_DELETE] - 요청 후 color", color);

      return NextResponse.json(color);
    }
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
