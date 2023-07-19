"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",

    //react-table 기능이고 행의 original 데이터인 SizeColumn를 가져옴
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
