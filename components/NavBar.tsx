import { UserButton } from "@clerk/nextjs";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import prismadb from "@/lib/prismadb";
import useUserCheck from "@/hooks/useUserCheck";
import { ThemeToggle } from "@/components/ThemeToggle";

// 재사용할 컴포넌트가 아니라서 ui 폴더 밖에 따로 만듦.
const NavBar = async () => {
  const userId = useUserCheck();

  const stores = await prismadb.store.findMany({ where: { userId } });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle/>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
