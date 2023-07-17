import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export interface ReturnType {
  body: any;
  params: { storeId: string; categoryId?: string };
}

/**
 * categories api에 사용되는 유효성검사 공통 로직 모듈
 * @param req
 * @param params 앱폴더 라우팅 주소에서 받는 params 값
 * @returns 유효성 끝난 후 에러 response 또는 data body 및 params
 */
export async function categoryValidator(
  req: Request,
  params: { storeId: string; categoryId?: string }
): Promise<NextResponse | ReturnType | undefined> {
  const { userId } = auth();

  // 로그인 체크
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

  // 수정, 삭제 요청일때 category id 체크
  if (req.method !== "POST" && !params.categoryId) {
    return new NextResponse("Category id is required", { status: 400 });
  }

  // 스토어 id 체크
  if (!params.storeId)
    return new NextResponse("Store id is required", { status: 400 });

  // 정상적인 스토어에 접근 권한이 있는 사용자가 category에 요청한건지 체크
  const storeByUserId = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

  if (req.method !== "DELETE") {
    const body = await req.json();
    const { name, billboardId } = body;

    // 등록, 수정 요청일때, 데이터 body 속성체크
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    return { body, params };
  }
}