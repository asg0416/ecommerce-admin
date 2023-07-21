import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";

// Single Product Page
const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  // ctg, size, color 의 경우 스토어에 생성된 전체 목록을 불러오는 것이라 product의 include가 아님
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default ProductPage;
