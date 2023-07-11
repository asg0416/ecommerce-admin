import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ReturnType, billboardValidator } from "../requestValidators";

interface Params {
  storeId: string;
  billboardId: string;
}
/**
 * billboard 단일 읽기 api
 * @param req
 * @param params
 * @returns billboard 단일 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * billboard 단일 수정 api
 *
 * @param req data body 포함된 request 요청 데이터
 * @param params 주소 파람값
 * @returns 수정된 단일 billboard 객체 포함 응답
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const res = await billboardValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const {
        body: { label, imageUrl },
      } = res;

      const billboard = await prismadb.billboard.updateMany({
        where: {
          id: params.billboardId,
        },
        data: { label: label, imageUrl: imageUrl },
      });

      return NextResponse.json(billboard);
    }
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/*
api 만들때 메서드 뒤에 파라미터 중 req 안쓴다고해서 삭제하면 안됨
params 값 순서가 파라미터 중 2번째라서 request랑 params 순서 지켜서 작성해야함
*/

/**
 * billboard 단일 삭제 api
 * @param req
 * @param params
 * @returns
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const res = await billboardValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const billboard = await prismadb.billboard.deleteMany({
        where: {
          id: params.billboardId,
        },
      });

      console.log("[BILLBOARD_DELETE] - 요청 후 billboard", billboard);

      return NextResponse.json(billboard);
    }
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
