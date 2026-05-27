import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/custom-input";
import { CustomSelect } from "@/components/common/custom-select";
import { AnnouncementTarget } from "@/store/slices/announcementApi";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  target: z.nativeEnum(AnnouncementTarget),
  departmentId: z.string().optional(),
  expiresAt: z.date().optional().nullable(),
  isActive: z.boolean(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function AnnouncementForm({ initialData, onSubmit, isLoading }: AnnouncementFormProps) {
  const { data: deptData } = useGetDepartmentsQuery({ page: 1, limit: 100 });
  const departments = deptData?.departments || [];

  const { control, handleSubmit, watch } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      target: initialData?.target || AnnouncementTarget.ALL,
      departmentId: initialData?.departmentId?._id || "",
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt) : null,
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedTarget = watch("target");

  const handleFormSubmit = (data: AnnouncementFormValues) => {
    // Convert Date object back to ISO string if it exists
    const formattedData = {
      ...data,
      expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        control={control}
        name="title"
        label="Title"
        placeholder="Enter announcement title"
      />

      <Controller
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Content</FieldLabel>
            <Textarea
              {...field}
              placeholder="Enter announcement content"
              className="min-h-[120px]"
            />
            {fieldState.invalid && (
              <FieldError className="text-destructive text-xs mt-1">
                {fieldState.error?.message}
              </FieldError>
            )}
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <CustomSelect
          control={control}
          name="target"
          label="Target Audience"
          options={[
            { label: "Everyone", value: AnnouncementTarget.ALL },
            { label: "Teachers", value: AnnouncementTarget.TEACHER },
            { label: "Students", value: AnnouncementTarget.STUDENT },
            { label: "HODs", value: AnnouncementTarget.HOD },
            { label: "Specific Department", value: AnnouncementTarget.DEPARTMENT },
          ]}
        />

        {selectedTarget === AnnouncementTarget.DEPARTMENT && (
          <CustomSelect
            control={control}
            name="departmentId"
            label="Department"
            options={departments.map((d: any) => ({ label: d.name, value: d._id }))}
          />
        )}
      </div>

      <Controller
        name="expiresAt"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Expires At (Optional)</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal h-10 rounded-lg border-input",
                    !field.value && "text-muted-foreground"
                  )}
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
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && (
              <FieldError className="text-destructive text-xs mt-1">
                {fieldState.error?.message}
              </FieldError>
            )}
          </Field>
        )}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={isLoading} className="rounded-xl">
          {isLoading ? "Saving..." : initialData ? "Update Announcement" : "Post Announcement"}
        </Button>
      </div>
    </form>
  );
}
