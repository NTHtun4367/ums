// @/components/subjects/subject-table.tsx
import {
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash2,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import type { Subject } from "@/types/type";
import CustomPagination from "../common/custom-pagination";

interface Props {
  data: Subject[];
  loading: boolean;
  isFetching?: boolean;
  onEdit: (item: Subject) => void;
  onDelete: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export function SubjectTable({
  data,
  loading,
  isFetching,
  onEdit,
  onDelete,
  page,
  setPage,
  totalPages,
}: Props) {
  return (
    <div className="border rounded-md bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-25">Code</TableHead>
            <TableHead>Subject Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Semester</TableHead>
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
                No subjects found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item._id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {item.code}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  {typeof item.departmentId === "object" ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {(item.departmentId as any).code}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                    Sem {item.semester}
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(item._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <CustomPagination
          loading={loading || isFetching}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
