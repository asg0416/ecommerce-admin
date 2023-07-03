// 실제 DB와 작용하는 CRUD 작업을 위한 prisma client 객체 생성 정의 파일

import { PrismaClient } from "@prisma/client";

// declare global 키워드를 사용하여 전역 스코프 변수 타입 선언
declare global {
  var prisma: PrismaClient | undefined;
}

// globalThis는 실행 환경(웹 브라우저, Node.js)상관없이 전역객체에 접근
const prismadb = globalThis.prisma || new PrismaClient();

// 프로덕션 환경아닐때 전역 프리즈마에 처음 생성한 prismaClient 할당해서 인스턴스 재사용.
// 그냥 const prismadb = new PrismaClient(); 라고하면 개발 중에는 성능이슈생김.
// 프로덕션 환경에서는 매번 신규 인스턴스를 생성하여 안정성과 견고성을 보장함.
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
