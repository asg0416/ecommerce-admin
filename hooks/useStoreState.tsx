import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import useUserCheck from "./useUserCheck";

// 현재 접속한 스토어 데이터 훅
const useStoreState = async (storeId: string) => {
  const userId = useUserCheck();

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  // 주소창에 이상한 스토어 아이디 치고 접근 한 경우나 없는 스토어의 경우 스토어생성 루트 페이지로 보냄
  if (!store) return redirect("/");

  return { userId, store };
};

export default useStoreState;
