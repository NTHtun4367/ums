import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CustomSearch from "@/components/common/custom-search";
import CustomAlert from "@/components/common/custom-alert";
import DepartmentTable from "@/components/department/department-table";
import DepartmentForm from "@/components/department/department-form";
import {
  useGetDepartmentsQuery,
  useDeleteDepartmentMutation,
} from "@/store/slices/departmentApi";

import { PageHeader } from "@/components/common/page-header";
import { Building2 } from "lucide-react";

const DepartmentPage = () => {
  const [search, setSearch] = useState("");
  const [queryParams, setQueryParams] = useState({ page: 1, search: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetDepartmentsQuery(queryParams);
  const [deleteDept, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDept(deletingId).unwrap();
      toast.success("Department deleted");
      setIsAlertOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Departments"
        description="Manage academic departments and their heads."
        icon={<Building2 className="h-6 w-6" />}
      >
        <CustomSearch
          search={search}
          setSearch={setSearch}
          title="Department"
        />
        <Button
          onClick={() => {
            setEditingDept(null);
            setIsFormOpen(true);
          }}
          className="rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </PageHeader>

      <DepartmentTable
        data={data?.departments || []}
        loading={isLoading || isFetching}
        onEdit={(dept: any) => {
          setEditingDept(dept);
          setIsFormOpen(true);
        }}
        onDelete={(id: string) => {
          setDeletingId(id);
          setIsAlertOpen(true);
        }}
        pageNum={queryParams.page}
        setPageNum={(page: number) => setQueryParams((p) => ({ ...p, page }))}
        totalPages={data?.pagination?.pages || 1}
      />

      <DepartmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingDept}
      />

      <CustomAlert
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        handleDelete={confirmDelete}
        loading={isDeleting}
        title="Delete Department"
        description="This will permanently delete the department."
      />
    </div>
  );
};

export default DepartmentPage;
