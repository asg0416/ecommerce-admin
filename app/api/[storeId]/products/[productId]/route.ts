import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { productValidator } from "../requestValidators";

interface Params {
  storeId: string;
  productId: string;
}
/**
 * product 단일 읽기 api
 * @param req
 * @param params
 * @returns product 단일 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * product 단일 수정 api
 *
 * @param req data body 포함된 request 요청 데이터
 * @param params 주소 파람값
 * @returns 수정된 단일 product 객체 포함 응답
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const res = await productValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else if (res !== undefined) {
      const {
        body: {
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          images,
          isFeatured,
          isArchived,
        },
      } = res;

      await prismadb.product.update({
        where: {
          id: params.productId,
        },
        data: {
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          isFeatured,
          isArchived,
          images: {
            deleteMany: {},
          },
        },
      });

      const product = await prismadb.product.update({
        where: {
          id: params.productId,
        },
        data: {
          images: {
            createMany: {
              data: [...images.map((image: { url: string }) => image)],
            },
          },
        },
      });

      return NextResponse.json(product);
    }
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/*
api 만들때 메서드 뒤에 파라미터 중 req 안쓴다고해서 삭제하면 안됨
params 값 순서가 파라미터 중 2번째라서 request랑 params 순서 지켜서 작성해야함
*/

/**
 * product 단일 삭제 api
 * @param req
 * @param params
 * @returns
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const res = await productValidator(req, params);

    if (res instanceof NextResponse) {
      return res;
    } else {
      const product = await prismadb.product.deleteMany({
        where: {
          id: params.productId,
        },
      });

      console.log("[PRODUCT_DELETE] - 요청 후 product", product);

      return NextResponse.json(product);
    }
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
