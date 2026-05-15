// @/components/classes/class-table.tsx
import { MoreHorizontal, Loader2, Pencil, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Class } from "@/types/type";
import CustomPagination from "../common/custom-pagination";

interface Props {
  data: Class[];
  loading: boolean;
  isFetching?: boolean;
  onEdit: (cls: Class) => void;
  onDelete: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const ClassTable = ({
  data,
  loading,
  isFetching,
  onEdit,
  onDelete,
  page,
  setPage,
  totalPages,
}: Props) => {
  return (
    <div className="border rounded-md bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Class / Section</TableHead>
            <TableHead>Year & Semester</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Enrollment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          className={cn(isFetching && "opacity-50 transition-opacity")}
        >
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No classes found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            data.map((cls) => (
              <TableRow
                key={cls._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{cls.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {(cls.departmentId as any)?.code || "Dept"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {(cls.academicYearId as any)?.name || "N/A"}
                    </span>
                    <Badge
                      variant="outline"
                      className="w-fit text-[10px] h-4 px-1"
                    >
                      Sem {cls.semester}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {cls.classTeacherId ? (
                    <span className="text-sm">
                      {(cls.classTeacherId as any).name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="h-3.5 w-3.5 text-primary/70" />
                    <span
                      className={cn(
                        (cls as any).students?.length >= cls.capacity
                          ? "text-destructive font-bold"
                          : "",
                      )}
                    >
                      {(cls as any).students?.length || 0}
                    </span>
                    <span className="text-muted-foreground">
                      / {cls.capacity}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Management</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(cls)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(cls._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="p-4 border-t">
          <CustomPagination
            loading={loading || isFetching}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default ClassTable;
