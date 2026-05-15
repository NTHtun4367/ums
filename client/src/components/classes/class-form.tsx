import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/store/slices/classApi";
import { useGetUsersQuery } from "@/store/slices/userApi";
import { useGetAcademicYearsQuery } from "@/store/slices/academicYearApi";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { Class } from "@/types/type";
import CustomModal from "../common/custom-modal";
import { CustomSelect } from "../common/custom-select";
import { classFormSchema, type ClassFormValues } from "@/schemas/class";
import CustomInput from "../common/custom-input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Class | null;
}

const ClassForm = ({ open, onOpenChange, initialData }: Props) => {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      capacity: 50,
      semester: 1,
      academicYearId: "",
      departmentId: "",
      classTeacherId: "",
    },
  });

  // 1. Watch departmentId to trigger teacher list refresh
  const selectedDept = form.watch("departmentId");

  // 2. Fetch data based on selected department
  const { data: userData, isFetching: loadingTeachers } = useGetUsersQuery(
    {
      page: 1,
      limit: 100,
      role: "teacher",
      departmentId: selectedDept, // Backend Filtering
    },
    { skip: !open || !selectedDept }, // Skip if no department is selected
  );

  const { data: ayData } = useGetAcademicYearsQuery(
    { page: 1 },
    { skip: !open },
  );
  const { data: deptData } = useGetDepartmentsQuery(
    { page: 1 },
    { skip: !open },
  );

  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();

  // Reset teacher selection if department changes
  useEffect(() => {
    if (selectedDept && !initialData) {
      form.setValue("classTeacherId", "");
    }
  }, [selectedDept, form, initialData]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          capacity: initialData.capacity,
          semester: initialData.semester || 1,
          academicYearId:
            (initialData.academicYearId as any)?._id ||
            initialData.academicYearId,
          departmentId:
            (initialData.departmentId as any)?._id || initialData.departmentId,
          classTeacherId:
            (initialData.classTeacherId as any)?._id ||
            initialData.classTeacherId ||
            "",
        });
      } else {
        form.reset({
          name: "",
          capacity: 50,
          semester: 1,
          academicYearId: "",
          departmentId: "",
          classTeacherId: "",
        });
      }
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: ClassFormValues) => {
    try {
      const payload = {
        ...values,
        classTeacherId:
          values.classTeacherId === "" ? undefined : values.classTeacherId,
      };

      if (initialData) {
        await updateClass({ id: initialData._id, data: payload }).unwrap();
        toast.success("Class updated successfully");
      } else {
        await createClass(payload).unwrap();
        toast.success("Class created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save class");
    }
  };

  // Memos for options
  const teacherOptions = useMemo(
    () =>
      userData?.users?.map((t: any) => ({ label: t.name, value: t._id })) || [],
    [userData],
  );

  const ayOptions = useMemo(
    () =>
      ayData?.years?.map((y: any) => ({ label: y.name, value: y._id })) || [],
    [ayData],
  );

  const deptOptions = useMemo(
    () =>
      deptData?.departments?.map((d: any) => ({
        label: d.name,
        value: d._id,
      })) || [],
    [deptData],
  );

  const isPending = isCreating || isUpdating;

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title={initialData ? "Edit Class" : "Create New Class"}
      description=""
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          control={form.control}
          name="name"
          label="Class Name"
          placeholder="e.g. Section A"
          disabled={isPending}
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            control={form.control}
            name="academicYearId"
            label="Academic Year"
            options={ayOptions}
            disabled={isPending}
          />
          <CustomSelect
            control={form.control}
            name="departmentId"
            label="Department"
            options={deptOptions}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="semester"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Semester</FieldLabel>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={isPending}
                />
                {fieldState.error && (
                  <FieldError className="text-destructive text-xs">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="capacity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Max Capacity</FieldLabel>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={isPending}
                />
                {fieldState.error && (
                  <FieldError className="text-destructive text-xs">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <CustomSelect
          control={form.control}
          name="classTeacherId"
          label={
            selectedDept
              ? "Class Teacher (Optional)"
              : "Select Department First"
          }
          loading={loadingTeachers}
          options={teacherOptions}
          disabled={isPending || !selectedDept} // Disable until department is picked
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : initialData
              ? "Update Class"
              : "Save Class"}
        </Button>
      </form>
    </CustomModal>
  );
};

export default ClassForm;
