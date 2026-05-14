import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, FilterX } from "lucide-react";
import type { User, UserRole } from "@/types/type";
import Search from "@/components/common/custom-search";
import CustomAlert from "@/components/common/custom-alert";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/store/slices/userApi";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useGetClassesQuery } from "@/store/slices/classApi";
import UserTable from "@/components/users/user-table";
import UserDialog from "@/components/users/user-dialog";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { CustomSelect } from "@/components/common/custom-select";

interface Props {
  role: UserRole;
  title: string;
  description: string;
}

export default function UserManagementPage({
  role,
  title,
  description,
}: Props) {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: depts, isLoading: deptsLoading } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
  });

  // Only fetch classes if a department is selected (or if user is HOD)
  const effectiveDeptId = userInfo?.departmentId || selectedDept;

  const { data: classes, isLoading: classesLoading } = useGetClassesQuery(
    {
      page: 1,
      limit: 100,
      departmentId: (effectiveDeptId as string) || undefined,
    },
    { skip: !effectiveDeptId && role === "student" },
  );

  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit: 10,
    role,
    search,
    departmentId: (effectiveDeptId as string) || undefined,
    teacherStatus: selectedStatus || undefined,
    classId: selectedClass || undefined, // Fixed: Now passing classId to backend
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    handleResetFilters();
  }, [role]);

  const handleResetFilters = () => {
    setPage(1);
    setSelectedDept("");
    setSelectedClass("");
    setSelectedStatus("");
    setSearch("");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      toast.success("User deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add {role}
          </Button>
        </div>
        {/* Filter Section - Optimized Grid for Search, Selects, and Reset */}
        <div className="flex flex-wrap items-end gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
          {/* Search - Flexible Width */}
          <div className="flex-1 min-w-50">
            <Search
              search={search}
              setSearch={setSearch}
              title={`Search ${role}s...`}
            />
          </div>

          {/* Dept Filter - Flexible Width */}
          {!userInfo?.departmentId && (
            <div className="flex-1 min-w-50">
              <CustomSelect
                label="Department"
                options={
                  depts?.departments?.map((d: any) => ({
                    label: d.name,
                    value: d._id,
                  })) || []
                }
                value={selectedDept}
                onChange={setSelectedDept}
                placeholder="All Departments"
                loading={deptsLoading}
              />
            </div>
          )}

          {/* Class Filter - Flexible Width */}
          {role === "student" && (
            <div className="flex-1 min-w-50">
              <CustomSelect
                label="Class"
                options={
                  classes?.classes?.map((c: any) => ({
                    label: c.name,
                    value: c._id,
                  })) || []
                }
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder="All Classes"
                loading={classesLoading}
                disabled={!effectiveDeptId}
              />
            </div>
          )}

          {/* Teacher Title Filter - Flexible Width */}
          {role === "teacher" && (
            <div className="flex-1 min-w-50">
              <CustomSelect
                label="Title"
                options={[
                  { label: "Professor", value: "professor" },
                  {
                    label: "Assistant Professor",
                    value: "assistant_professor",
                  },
                  { label: "Lecturer", value: "lecturer" },
                  { label: "Tutor", value: "tutor" },
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Statuses"
              />
            </div>
          )}

          {/* Reset Button - Half Width / Auto Width */}
          <div className="w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="px-8" // Increased padding for a better "half-size" look
            >
              <FilterX className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>{" "}
      </div>

      <UserTable
        role={role}
        loading={isLoading || isFetching}
        setDeleteId={setDeleteId}
        setIsDeleteOpen={setIsDeleteOpen}
        setEditingUser={setEditingUser}
        setIsFormOpen={setIsFormOpen}
        users={data?.users || []}
        setPageNum={setPage}
        pageNum={page}
        totalPages={data?.pagination?.pages || 1}
      />

      <UserDialog
        editingUser={editingUser}
        role={role}
        open={isFormOpen}
        setOpen={setIsFormOpen}
      />

      <CustomAlert
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        handleDelete={handleDelete}
        loading={isDeleting}
        title="Permanently Delete User?"
        description="This action cannot be undone."
      />
    </div>
  );
}
