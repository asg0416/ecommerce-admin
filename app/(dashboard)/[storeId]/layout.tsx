import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";

interface LayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashboardLayout = async ({ children, params }: LayoutProps) => {
  const { userId } = auth();

  // 로그인 안된경우 로그인 리다이렉트
  if (!userId) return redirect("/sign-in");

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // 주소창에 이상한 스토어 아이디 치고 접근 한 경우나 없는 스토어의 경우 스토어생성 루트 페이지로 보냄
  if (!store) return redirect("/");

  return (
    <div>
      <NavBar/>
      {children}
    </div>
  );
};

export default DashboardLayout;
