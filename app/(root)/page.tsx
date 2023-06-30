"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

function SetupPage() {
  const { isOpen, onOpen } = useStoreModal();

  // 첫 페이지 진입하자마자 스토어 설정 모달 자동으로 열리게 하려고.
  useEffect(()=>{
    if(!isOpen) onOpen()
  },[isOpen, onOpen])

  return (
    <div className="p-4">
      Root page
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default SetupPage;
