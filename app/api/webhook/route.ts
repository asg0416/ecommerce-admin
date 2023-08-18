import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// stripe 로컬 결제 웹 훅 설정
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 결제 시 사용자가 입력한 정보 가저와서 가공
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  // 결제 완료되면 주문 데이터 업데이트
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: { id: session?.metadata?.orderId }, // api/storeId/checkout post 요청의 session에서 넣어준 metadata
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true, // 주문한 제품 정보 중 product id 가져와서 상품 정보 업데이트하기 위해서 필요
      },
    });

    const productIds = order.orderItems.map((item) => item.productId);

    // 주문한 제품 목록 전체에 대해서 isArchived 변경해줌.
    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: { isArchived: true },
    });
  }

  return new NextResponse(null, {status: 200 })
}
