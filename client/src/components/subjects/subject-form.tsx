import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { Subject } from "@/types/type";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "@/store/slices/subjectApi";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useGetClassesQuery } from "@/store/slices/classApi"; // FIXED: Imported class query hook
import { subjectFormSchema, type SubjectFormValues } from "@/schemas/subject";
import CustomModal from "../common/custom-modal";
import CustomInput from "../common/custom-input";
import { CustomSelect } from "../common/custom-select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {
  const { data: deptData, isLoading: isLoadingDepts } = useGetDepartmentsQuery(
    { page: 1, limit: 100 },
    { skip: !open },
  );

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      departmentId: "",
      classId: "", // FIXED: Handled default empty string initialization
      semester: 1,
    },
  });

  // FIXED: Watch the selected departmentId for contextual chaining
  const selectedDepartmentId = form.watch("departmentId");

  // FIXED: Dynamic class fetching hook based on department selection
  const { data: classData, isLoading: isLoadingClasses } = useGetClassesQuery(
    { page: 1, limit: 100, departmentId: selectedDepartmentId },
    { skip: !open || !selectedDepartmentId },
  );

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

  const deptOptions = useMemo(() => {
    return (
      deptData?.departments?.map((d: any) => ({
        label: `${d.name} (${d.code})`,
        value: d._id,
      })) || []
    );
  }, [deptData]);

  // FIXED: Generated matching class select options
  const classOptions = useMemo(() => {
    return (
      classData?.classes?.map((c: any) => ({
        label: c.name,
        value: c._id,
      })) || []
    );
  }, [classData]);

  // FIXED: Clear class selection automatically if department changes
  useEffect(() => {
    if (selectedDepartmentId && initialData) {
      const parentId =
        typeof initialData.departmentId === "object"
          ? (initialData.departmentId as any)._id
          : initialData.departmentId;

      if (selectedDepartmentId !== parentId) {
        form.setValue("classId", "");
      }
    } else if (!selectedDepartmentId) {
      form.setValue("classId", "");
    }
  }, [selectedDepartmentId, form, initialData]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          code: initialData.code,
          departmentId:
            typeof initialData.departmentId === "object"
              ? (initialData.departmentId as any)._id
              : initialData.departmentId,
          // FIXED: Reset classId correctly
          classId:
            typeof initialData.classId === "object"
              ? (initialData.classId as any)._id
              : initialData.classId || "",
          semester: initialData.semester || 1,
        });
      } else {
        form.reset({
          name: "",
          code: "",
          departmentId: "",
          classId: "",
          semester: 1,
        });
      }
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      if (initialData) {
        await updateSubject({ id: initialData._id, data: values }).unwrap();
        toast.success("Subject updated successfully");
      } else {
        await createSubject(values).unwrap();
        toast.success("Subject created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Operation failed");
    }
  };

  const pending = isCreating || isUpdating;

  return (
    <CustomModal
      title={initialData ? "Edit Subject" : "Create Subject"}
      description={
        initialData
          ? "Update the details for this subject."
          : "Add a new subject to the curriculum."
      }
      open={open}
      setOpen={onOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            control={form.control}
            name="name"
            label="Subject Name"
            placeholder="Computer Networks"
            disabled={pending}
          />
          <CustomInput
            control={form.control}
            name="code"
            label="Subject Code"
            placeholder="CS-301"
            disabled={pending}
          />
        </div>

        <CustomSelect
          control={form.control}
          name="departmentId"
          label="Department"
          options={deptOptions}
          disabled={pending || isLoadingDepts}
        />

        {/* FIXED: Cascading dependent Class selection input box rendering dynamically */}
        <CustomSelect
          control={form.control}
          name="classId"
          label="Class"
          options={classOptions}
          placeholder={
            !selectedDepartmentId
              ? "Please select a department first"
              : isLoadingClasses
                ? "Loading classes..."
                : "Select Class"
          }
          disabled={pending || !selectedDepartmentId || isLoadingClasses}
        />

        <Field>
          <FieldLabel>Semester (1-8)</FieldLabel>
          <Input
            type="number"
            {...form.register("semester", { valueAsNumber: true })}
            disabled={pending}
          />
          {form.formState.errors.semester && (
            <FieldError className="text-destructive text-xs">
              {form.formState.errors.semester.message}
            </FieldError>
          )}
        </Field>

        <Button type="submit" className="w-full mt-2" disabled={pending}>
          {pending
            ? "Saving..."
            : initialData
              ? "Update Subject"
              : "Save Subject"}
        </Button>
      </form>
    </CustomModal>
  );
}
