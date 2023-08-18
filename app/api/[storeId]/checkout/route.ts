import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// CORS 설정
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// front에서 결제 요청할때 api
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json(); //front에서 받아온 productIds

  if (!productIds || productIds.length === 0)
    return new NextResponse("Product ids are required", { status: 400 });

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((product) => {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  // 결제 요청이 들어오면 일단 주문 데이터 생성
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        // product id로 상품 db 정보랑 연결해서 주문 제품 정보 생성하는 과정
        create: productIds.map((productId: string) => ({
          product: {
            connect: { id: productId },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`, // 결제 성공 시 redirect 주소
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`, // 결제 실패 시 redirect 주소
    metadata: { orderId: order.id }, // metadata를 통해 결제 후 isPaid 바꿔줄수있음.
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
