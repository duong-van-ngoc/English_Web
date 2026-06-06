import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ImportRow } from "../../types/vocabulary-import.type";

interface ImportPreviewTableProps {
  rows: ImportRow[];
}

export function ImportPreviewTable({ rows }: ImportPreviewTableProps) {
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden bg-white/30">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Dòng</TableHead>
              <TableHead>Từ vựng</TableHead>
              <TableHead>Phiên âm</TableHead>
              <TableHead>Nghĩa</TableHead>
              <TableHead>Từ loại</TableHead>
              <TableHead>Kết quả kiểm tra</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.index}
                className={!row.isValid ? "bg-red-50/40 hover:bg-red-50/60" : ""}
              >
                <TableCell className="font-semibold text-xs text-text-secondary">
                  #{row.index}
                </TableCell>
                <TableCell className="font-bold">{row.word || <span className="text-error italic">Trống</span>}</TableCell>
                <TableCell className="font-mono text-xs">{row.phonetic || "-"}</TableCell>
                <TableCell>{row.meaning || <span className="text-error italic">Trống</span>}</TableCell>
                <TableCell className="capitalize text-xs font-semibold">{row.partOfSpeech || "-"}</TableCell>
                <TableCell>
                  {row.isValid ? (
                    <Badge variant="success">Hợp lệ</Badge>
                  ) : (
                    <div className="flex flex-col gap-1 text-[11px] text-error font-medium">
                      {row.errors.map((err, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">error</span>
                          {err}
                        </span>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default ImportPreviewTable;
