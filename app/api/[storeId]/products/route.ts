import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { productValidator } from "./requestValidators";

/**
 * product 생성 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 생성된 단일 product 객체 포함 응답
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
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

      const product = await prismadb.product.create({
        data: {
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          isFeatured,
          isArchived,
          storeId: params.storeId,
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
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * product 읽기 api
 *
 * @param req
 * @param params 주소 파람값
 * @returns 스토어 하위 전체 products 객체 포함 응답
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    // front 에서 filter 적용하는 조건들 where에 넣으면 됨.
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
