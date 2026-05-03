import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AcademicYearTable from "@/components/academic-year/academic-year-table";
import {
  useGetAcademicYearsQuery,
  useDeleteAcademicYearMutation,
} from "@/store/slices/academicYearApi";
import type { AcademicYear } from "@/types/type";
import AcademicYearForm from "@/components/academic-year/academic-year-form";
import CustomAlert from "@/components/common/custom-alert";
import CustomSearch from "@/components/common/custom-search";

const AcademicYearPage = () => {
  const [search, setSearch] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    search: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAcademicYearsQuery(queryParams);
  const [deleteAcademicYear, { isLoading: isDeleting }] =
    useDeleteAcademicYearMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams((prev) => {
        if (prev.search === search) return prev;
        return { ...prev, search: search, page: 1 };
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const handlePageChange = useCallback((newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleCreate = useCallback(() => {
    setEditingYear(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((year: AcademicYear) => {
    setEditingYear(year);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAcademicYear(deletingId).unwrap();
      toast.success("Academic year deleted");
      setIsAlertOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const academicYears = useMemo(() => data?.years || [], [data?.years]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-muted-foreground">Manage school sessions.</p>
        </div>
        <div className="flex gap-3">
          <CustomSearch
            search={search}
            setSearch={setSearch}
            title="Academic Year"
          />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add New Year
          </Button>
        </div>
      </div>

      <AcademicYearTable
        data={academicYears}
        loading={isLoading || isFetching}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pageNum={queryParams.page}
        setPageNum={handlePageChange}
        totalPages={data?.pagination?.pages || 1}
      />

      <AcademicYearForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingYear}
      />

      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        loading={isDeleting}
        title="Delete Academic Year"
        description="Are you sure you want to delete this session? This cannot be undone."
      />
    </div>
  );
};

export default AcademicYearPage;
