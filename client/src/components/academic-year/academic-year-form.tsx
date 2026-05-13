// @/components/academic-year/academic-year-form.tsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
} from "@/store/slices/academicYearApi";
import type { AcademicYear } from "@/types/type";
import {
  academicYearFormSchema,
  type AcademicYearFormValues,
} from "@/schemas/academic-year";
import CustomInput from "../common/custom-input";
import CustomModal from "../common/custom-modal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AcademicYear | null;
}

function AcademicYearForm({ open, onOpenChange, initialData }: Props) {
  const [createYear, { isLoading: isCreating }] =
    useCreateAcademicYearMutation();
  const [updateYear, { isLoading: isUpdating }] =
    useUpdateAcademicYearMutation();

  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      name: "",
      isCurrent: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          isCurrent: initialData.isCurrent,
        });
      } else {
        form.reset({
          name: "",
          startDate: undefined,
          endDate: undefined,
          isCurrent: false,
        });
      }
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: AcademicYearFormValues) => {
    try {
      if (initialData) {
        await updateYear({ id: initialData._id, data: values }).unwrap();
        toast.success("Academic year updated successfully");
      } else {
        await createYear(values).unwrap();
        toast.success("Academic year created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title={initialData ? "Edit Year" : "New Academic Year"}
      description="Define the period for this academic session."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup className="space-y-4">
          <CustomInput
            control={form.control}
            name="name"
            label="Year Name"
            placeholder="e.g. 2025-2026"
            disabled={isPending}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Start Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={isPending}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError className="text-xs">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>End Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={isPending}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          !!form.getValues("startDate") &&
                          date < form.getValues("startDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError className="text-xs">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="isCurrent"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center space-x-3 rounded-md border p-4 bg-muted/20">
                <Checkbox
                  id="isCurrent"
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={isPending}
                />
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="isCurrent"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Set as Current Session
                  </label>
                  <p className="text-xs text-muted-foreground">
                    This will become the primary year for data entry.
                  </p>
                </div>
              </div>
            )}
          />
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? "Processing..."
            : initialData
              ? "Update Academic Year"
              : "Create Academic Year"}
        </Button>
      </form>
    </CustomModal>
  );
}

export default AcademicYearForm;
