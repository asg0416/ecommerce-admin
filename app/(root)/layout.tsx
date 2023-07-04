import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import useUserCheck from "@/hooks/useUserCheck";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const userId = useUserCheck();

  const store = await prismadb.store.findFirst({ where: { userId } });
  if (store) return redirect(`/${store.id}`);
  return <>{children}</>;
};

export default SetupLayout;
