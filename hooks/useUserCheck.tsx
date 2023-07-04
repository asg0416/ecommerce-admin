import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const useUserCheck = () => {
  const { userId } = auth();

  // 로그인 안된경우 로그인 리다이렉트
  if (!userId) return redirect("/sign-in");
  return userId;
};

export default useUserCheck;
