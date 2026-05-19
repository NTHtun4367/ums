import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Eye, Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { useGetClassTimetableQuery } from "@/store/slices/timetableApi";
import { useGetSubjectsQuery } from "@/store/slices/subjectApi";
import { TimetableManager } from "@/components/timetables/timetable-manager";
import { TimetableView } from "@/components/timetables/timetableview";

export default function TimetablePage() {
  const { classId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { data: timetable, isLoading } = useGetClassTimetableQuery(classId!);
  const { data: subjectsData } = useGetSubjectsQuery({ page: 1, limit: 100 });
  // Assume a useGetTeachersQuery exists similar to subjects
  const teachers: any = [];

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">
            Manage and view weekly periods
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? (
            <>
              <Eye className="mr-2 h-4 w-4" /> View Mode
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Mode
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Modify Timetable" : "Weekly Overview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <TimetableManager
              classId={classId}
              scheduleData={timetable?.data}
              subjects={subjectsData?.subjects || []}
              teachers={teachers}
            />
          ) : (
            <TimetableView scheduleData={timetable?.data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
