import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useSaveTimetableDayMutation } from "@/store/slices/timetableApi";

export function TimetableManager({
  classId,
  scheduleData,
  subjects,
  teachers,
}: any) {
  const [localSchedule, setLocalSchedule] = useState<any>({});
  const [saveDay, { isLoading }] = useSaveTimetableDayMutation();

  useEffect(() => {
    if (scheduleData) {
      const mapped = scheduleData.reduce((acc: any, curr: any) => {
        acc[curr.day] = curr.periods;
        return acc;
      }, {});
      setLocalSchedule(mapped);
    }
  }, [scheduleData]);

  const updateCell = (
    day: string,
    slotIdx: number,
    field: string,
    value: string,
  ) => {
    setLocalSchedule((prev: any) => {
      const dayPeriods = [...(prev[day] || [])];
      dayPeriods[slotIdx] = {
        ...dayPeriods[slotIdx],
        [field]: value,
        startTime: "09:00", // Would be mapped from a constant in real app
        endTime: "10:00",
        room: "Room 101",
      };
      return { ...prev, [day]: dayPeriods };
    });
  };

  const handleSave = async (day: string) => {
    try {
      await saveDay({ classId, day, periods: localSchedule[day] }).unwrap();
      toast.success(`${day} saved successfully`);
    } catch (err) {
      toast.error("Failed to save schedule");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead colSpan={5} className="text-center">
            Periods
          </TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <TableRow key={day}>
            <TableCell className="font-medium">{day}</TableCell>
            {[0, 1, 2, 3, 4].map((idx) => (
              <TableCell key={idx} className="min-w-[140px]">
                <div className="flex flex-col gap-1">
                  <Select
                    value={
                      localSchedule[day]?.[idx]?.subjectId?._id ||
                      localSchedule[day]?.[idx]?.subjectId ||
                      ""
                    }
                    onValueChange={(val) =>
                      updateCell(day, idx, "subjectId", val)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s: any) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={
                      localSchedule[day]?.[idx]?.teacherId?._id ||
                      localSchedule[day]?.[idx]?.teacherId ||
                      ""
                    }
                    onValueChange={(val) =>
                      updateCell(day, idx, "teacherId", val)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t: any) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            ))}
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSave(day)}
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
