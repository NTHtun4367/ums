// @/components/department/department-form.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  departmentFormSchema,
  type DepartmentFormValues,
} from "@/schemas/department";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/store/slices/departmentApi";
import CustomInput from "../common/custom-input";
import CustomModal from "../common/custom-modal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: any | null;
}

function DepartmentForm({ open, onOpenChange, initialData }: Props) {
  const [createDept, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDept, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          code: initialData.code,
          description: initialData.description || "",
          headId: initialData.headId?._id || initialData.headId || undefined,
        });
      } else {
        form.reset({ name: "", code: "", description: "", headId: undefined });
      }
    }
  }, [initialData, form, open]);

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (initialData) {
        await updateDept({ id: initialData._id, data }).unwrap();
        toast.success("Department updated");
      } else {
        await createDept(data).unwrap();
        toast.success("Department created");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to save department");
    }
  };

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title={initialData ? "Edit Department" : "New Department"}
      description="Enter the details for the academic department."
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-4">
          <CustomInput
            control={form.control}
            name="name"
            label="Department Name"
            placeholder="e.g. Computer Science"
          />
          <CustomInput
            control={form.control}
            name="code"
            label="Code"
            placeholder="e.g. CSE"
          />
          <CustomInput
            control={form.control}
            name="description"
            label="Description (Optional)"
            placeholder="Short description..."
          />
        </FieldGroup>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full mt-6"
        >
          {isCreating || isUpdating ? "Saving..." : "Save Department"}
        </Button>
      </form>
    </CustomModal>
  );
}

export default DepartmentForm;
