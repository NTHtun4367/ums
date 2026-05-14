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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  UserIcon,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User, Class, Subject } from "@/types/type";
import CustomPagination from "../common/custom-pagination";

interface Props {
  role: string;
  loading: boolean;
  setDeleteId: (id: string) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setEditingUser: (user: User | null) => void;
  setIsFormOpen: (open: boolean) => void;
  users: User[];
  pageNum: number;
  setPageNum: (page: number) => void;
  totalPages: number;
}

function UserTable({
  role,
  loading,
  setDeleteId,
  setIsDeleteOpen,
  setEditingUser,
  setIsFormOpen,
  pageNum,
  setPageNum,
  users,
  totalPages,
}: Props) {
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  return (
    <div className="border rounded-md bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Details</TableHead>
            <TableHead>Contact</TableHead>
            {role === "teacher" && <TableHead>Assigned Subjects</TableHead>}
            {role === "student" && <TableHead>Class & Roll</TableHead>}
            {/* ADDED: Department column for HOD role */}
            {role === "hod" && <TableHead>Department</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={
                  role === "teacher" || role === "student" || role === "hod"
                    ? 6
                    : 5
                }
                className="h-24 text-center"
              >
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No {role}s found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800 border">
                      <UserIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm">
                  <div className="flex flex-col">
                    <span>{user.phone}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {user.gender}
                    </span>
                  </div>
                </TableCell>

                {role === "teacher" && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-62.5">
                      {user.teacherSubjects &&
                      user.teacherSubjects.length > 0 ? (
                        (user.teacherSubjects as Subject[]).map((subject) => (
                          <Badge
                            variant="secondary"
                            key={subject._id}
                            className="text-[10px]"
                          >
                            {subject.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}

                {role === "student" && (
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.classId ? (
                        <Badge variant="outline" className="w-fit">
                          {(user.classId as Class).name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          No Class
                        </span>
                      )}
                      <span className="text-xs font-mono">
                        Roll: {user.rollNo || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                )}

                {/* ADDED: HOD Department Logic */}
                {role === "hod" && (
                  <TableCell>
                    {user.departmentId ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">
                          {(user.departmentId as any).name || "Linked Dept"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">
                        No Department Assigned
                      </span>
                    )}
                  </TableCell>
                )}

                <TableCell>
                  {user.isActive ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" /> Inactive
                    </Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => {
                          setDeleteId(user._id);
                          setIsDeleteOpen(true);
                        }}
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

      <CustomPagination
        loading={loading}
        page={pageNum}
        setPage={setPageNum}
        totalPages={totalPages}
      />
    </div>
  );
}

export default UserTable;
