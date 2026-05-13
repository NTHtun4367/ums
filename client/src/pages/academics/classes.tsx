import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Added for Redux state
import { toast } from "sonner";
import { Plus, GraduationCap } from "lucide-react";

import {
  useGetClassesQuery,
  useDeleteClassMutation,
} from "@/store/slices/classApi";
import { Button } from "@/components/ui/button";
import type { Class } from "@/types/type";
import type { RootState } from "@/store"; // Ensure you import your RootState type
import Search from "@/components/common/custom-search";
import ClassTable from "@/components/classes/class-table";
import ClassForm from "@/components/classes/class-form";
import CustomAlert from "@/components/common/custom-alert";

const Classes = () => {
  // 1. Get user info from Redux store
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [search, setSearch] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    // 2. Initialize with departmentId if user is restricted to a department
    departmentId: userInfo?.departmentId || "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 3. The hook now automatically includes departmentId in the request
  const { data, isLoading, isFetching } = useGetClassesQuery({
    ...queryParams,
    departmentId:
      (userInfo?.departmentId as string) ||
      (queryParams.departmentId as string) ||
      undefined,
  });

  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteClass(deleteId).unwrap();
      toast.success("Class deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete class");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          </div>
          <p className="text-muted-foreground">
            {userInfo?.departmentId
              ? `Managing classes for your department.`
              : "Configure class sessions, semester levels, and teacher-student ratios."}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Search
            search={search}
            setSearch={setSearch}
            title="Search Classes..."
          />
          <Button
            onClick={() => {
              setEditingClass(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Class
          </Button>
        </div>
      </div>

      <ClassTable
        data={data?.classes || []}
        loading={isLoading || isFetching}
        onEdit={(cls) => {
          setEditingClass(cls);
          setIsFormOpen(true);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setIsDeleteOpen(true);
        }}
        page={queryParams.page}
        setPage={(page) => setQueryParams((prev) => ({ ...prev, page }))}
        totalPages={data?.pagination?.pages || 1}
      />

      <ClassForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingClass}
      />

      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        loading={isDeleting}
        title="Delete Class"
        description="This action will remove the class record. Student enrollment data associated with this class might be affected."
      />
    </div>
  );
};

export default Classes;
