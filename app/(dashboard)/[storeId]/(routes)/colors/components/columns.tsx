"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className=" flex items-center gap-x-2">
        {row.original.value}
        <div
          // tailwind css는 동적 스타일 지원 안해서 따로 style 지정해줘야함.
          className=" h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",

    //react-table 기능이고 행의 original 데이터인 ColorColumn를 가져옴
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
