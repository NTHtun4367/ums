import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/types/type";
import {
  useDeleteSubjectMutation,
  useGetSubjectsQuery,
} from "@/store/slices/subjectApi";
import Search from "@/components/common/custom-search";
import { SubjectTable } from "@/components/subjects/subject-table";
import { SubjectForm } from "@/components/subjects/subject-form";
import CustomAlert from "@/components/common/custom-alert";

function SubjectsPage() {
  const [search, setSearch] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } =
    useGetSubjectsQuery(queryParams);
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubject(deleteId).unwrap();
      toast.success("Subject deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          </div>
          <p className="text-muted-foreground">
            Manage the academic curriculum and subject codes per department.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Search
            search={search}
            setSearch={setSearch}
            title="Search subjects..."
          />
          <Button
            onClick={() => {
              setEditingSubject(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Subject
          </Button>
        </div>
      </div>

      <SubjectTable
        data={data?.subjects || []}
        loading={isLoading}
        isFetching={isFetching}
        onEdit={(item) => {
          setEditingSubject(item);
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

      <SubjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingSubject}
        onSuccess={refetch}
      />

      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        loading={isDeleting}
        title="Delete Subject"
        description="This will permanently delete the subject. Ensure no classes are currently assigned to this subject."
      />
    </div>
  );
}

export default SubjectsPage;
