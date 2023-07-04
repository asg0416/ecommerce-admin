import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// 사용자 로그인 여부 체크 훅
const useUserCheck = () => {
  const { userId } = auth();

  // 로그인 안된경우 로그인 리다이렉트
  if (!userId) return redirect("/sign-in");
  return userId;
};

export default useUserCheck;
