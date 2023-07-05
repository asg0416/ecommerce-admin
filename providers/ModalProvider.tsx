"use client";

import StoreModal from "@/components/modals/StoreModal";
import MountWrapper from "@/components/wrapper/MountWrapper";
import { useEffect, useState } from "react";

/*
MountWrapper
client side 에서 렌더링 되어야할 컴포넌트가 위치할 페이지가 
SSR인 경우 프로바이더가 마운트 되었는지 여부를 확인하여 에러를 막음.
*/
const ModalProvider = () => {

  return (
    <MountWrapper>
      <StoreModal />
    </MountWrapper>
  );
};

export default ModalProvider;
