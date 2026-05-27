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

import { PageHeader } from "@/components/common/page-header";
import { Calendar as CalendarIcon } from "lucide-react";

const AcademicYearPage = () => {
  const [search, setSearch] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    search: "",
    limit: 10,
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
      setQueryParams((prev) => ({ ...prev, search, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handlePageChange = useCallback((newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleCreate = () => {
    setEditingYear(null);
    setIsFormOpen(true);
  };

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAcademicYear(deletingId).unwrap();
      toast.success("Session deleted successfully");
      setIsAlertOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const years = useMemo(() => data?.years || [], [data?.years]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Academic Sessions"
        description="Configure your school's active periods and history."
        icon={<CalendarIcon className="h-6 w-6" />}
      >
        <CustomSearch
          search={search}
          setSearch={setSearch}
          title="Search sessions..."
        />
        <Button onClick={handleCreate} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Year
        </Button>
      </PageHeader>

      <AcademicYearTable
        data={years}
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
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        loading={isDeleting}
        handleDelete={confirmDelete}
        title="Delete Session"
        description="Are you sure? This will remove all associations with this academic year."
      />
    </div>
  );
};

export default AcademicYearPage;
