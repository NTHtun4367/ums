import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
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
    defaultValues: { name: "", code: "", description: "", isAcademic: true },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          code: initialData.code,
          description: initialData.description || "",
          isAcademic:
            typeof initialData.isAcademic === "boolean"
              ? initialData.isAcademic
              : true,
          headId: initialData.headId?._id || initialData.headId || undefined,
        });
      } else {
        form.reset({
          name: "",
          code: "",
          description: "",
          isAcademic: true,
          headId: undefined,
        });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full max-h-[85vh] antialiased"
      >
        {/* Scrollable Form Body Container */}
        <div className="flex-1 overflow-y-auto px-1 py-4 max-h-[calc(85vh-85px)] space-y-5 scrollbar-thin">
          <FieldGroup className="space-y-5">

            {/* Input fields are clean - grouped smoothly */}
            <div className="space-y-4">
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
                placeholder="Provide a brief summary of this department's scope..."
              />
            </div>

            {/* Redesigned Premium Selection Card */}
            <Controller
              control={form.control}
              name="isAcademic"
              render={({ field }) => (
                <label
                  htmlFor="isAcademic"
                  className={`flex flex-row items-start gap-4 rounded-xl border p-4 shadow-sm cursor-pointer transition-all duration-200 select-none
                    ${field.value
                      ? "border-primary/40 bg-primary/[0.02] shadow-primary/[0.02]"
                      : "border-muted bg-card hover:bg-muted/30"
                    }`}
                >
                  <div className="pt-0.5">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isAcademic"
                      className="h-4 w-4 rounded transition-transform duration-150 data-[state=checked]:scale-105"
                    />
                  </div>
                  <div className="space-y-1 leading-none">
                    <FieldLabel
                      htmlFor="isAcademic"
                      className="cursor-pointer font-semibold text-sm tracking-tight text-foreground"
                    >
                      Academic Department
                    </FieldLabel>
                    <p className="text-[12.5px] text-muted-foreground/90 leading-relaxed font-normal">
                      This department handles academic modules, curriculums, and direct classroom grading structures.
                    </p>
                  </div>
                </label>
              )}
            />
          </FieldGroup>
        </div>

        {/* Action Button Footer Area */}
        <div className="pt-4 border-t border-border/60 mt-4 bg-background sticky bottom-0 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="px-4 font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-6 font-medium shadow-sm transition-all duration-150 active:scale-[0.98] bg-primary hover:bg-primary/90"
          >
            {isCreating || isUpdating ? "Saving changes..." : "Save Department"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default DepartmentForm;