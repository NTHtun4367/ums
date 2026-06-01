import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, MapPin, Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "../common/custom-select";
import CustomAlert from "../common/custom-alert";
import { TimePicker } from "../common/time-picker";

import { useGetSubjectsQuery } from "@/store/slices/subjectApi";
import { useGetUsersQuery } from "@/store/slices/userApi";
import {
  useSaveTimetableDayMutation,
  useDeleteTimetableDayMutation,
} from "@/store/slices/timetableApi";

import type { Timetable, TimetablePeriod } from "@/types/type";

interface ManagerProps {
  classId: string;
  departmentId: string;
  initialTimetable: Timetable[];
  onSaved: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type DayType = (typeof DAYS)[number];

const DEFAULT_PERIODS = [
  {
    startMinutes: 540, // 09:00
    endMinutes: 600, // 10:00
  },
  {
    startMinutes: 600, // 10:00
    endMinutes: 660, // 11:00
  },
  {
    startMinutes: 675, // 11:15
    endMinutes: 735, // 12:15
  },
];

function minutesToTime(minutes: number) {
  if (isNaN(minutes)) return "09:00";
  const hrs = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60).toString().padStart(2, "0");

  return `${hrs}:${mins}`;
}

function timeToMinutes(time: string) {
  if (!time) return 0;
  const [hours, mins] = time.split(":").map(Number);

  return hours * 60 + mins;
}

export default function TimetableManager({
  classId,
  departmentId,
  initialTimetable,
  onSaved,
}: ManagerProps) {
  const [selectedDay, setSelectedDay] = useState<DayType>("Monday");
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [room, setRoom] = useState<string>("");
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);

  const { data: subjectsData, isLoading: loadingSubjects } = useGetSubjectsQuery(
    {
      page: 1,
      limit: 100,
      departmentId,
      classId,
    },
    {
      skip: !departmentId || !classId,
    },
  );

  const { data: teachersData, isLoading: loadingTeachers } = useGetUsersQuery(
    {
      page: 1,
      limit: 100,
      role: "teacher",
      departmentId,
    },
    {
      skip: !departmentId,
    },
  );

  const [saveTimetableDay, { isLoading: isSaving }] =
    useSaveTimetableDayMutation();
  const [deleteTimetableDay, { isLoading: isDeleting }] =
    useDeleteTimetableDayMutation();

  const currentDayData = useMemo(
    () => initialTimetable.find((t) => t.day === selectedDay),
    [initialTimetable, selectedDay],
  );

  useEffect(() => {
    if (currentDayData) {
      setPeriods(currentDayData.periods);
      setRoom(currentDayData.room || "");
    } else {
      setPeriods(
        DEFAULT_PERIODS.map((p) => ({
          ...p,
          subjectId: "",
          teacherId: "",
        })),
      );
      setRoom("");
    }
  }, [selectedDay, currentDayData]);

  const subjectOptions = useMemo(
    () =>
      subjectsData?.subjects?.map((s) => ({ label: s.name, value: s._id })) ||
      [],
    [subjectsData],
  );

  const teacherOptions = useMemo(
    () =>
      teachersData?.users?.map((u) => ({ label: u.name, value: u._id })) || [],
    [teachersData],
  );

  const updatePeriod = (
    index: number,
    field: keyof TimetablePeriod,
    value: any,
  ) => {
    const updated = [...periods];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setPeriods(updated);
  };

  const addPeriod = () => {
    const lastPeriod = periods[periods.length - 1];
    const start = lastPeriod ? lastPeriod.endMinutes + 15 : 540;
    setPeriods([
      ...periods,
      {
        startMinutes: start,
        endMinutes: start + 60,
        subjectId: "",
        teacherId: "",
        room: "",
      },
    ]);
  };

  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const validateOverlaps = () => {
    const sorted = [...periods].sort((a, b) => a.startMinutes - b.startMinutes);

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].startMinutes < sorted[i - 1].endMinutes) {
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    const filtered = periods.filter(
      (p) =>
        (typeof p.subjectId === "string" ? p.subjectId : p.subjectId?._id) &&
        (typeof p.teacherId === "string" ? p.teacherId : p.teacherId?._id),
    );

    if (!filtered.length) {
      toast.error("Add at least one complete period");
      return;
    }

    if (!room.trim()) {
      toast.error("Please enter a room number");
      return;
    }

    if (!validateOverlaps()) {
      toast.error("Schedule periods overlap");
      return;
    }

    try {
      await saveTimetableDay({
        classId,
        day: selectedDay,
        periods: filtered.map((p) => ({
          subjectId:
            typeof p.subjectId === "string" ? p.subjectId : p.subjectId._id,
          teacherId:
            typeof p.teacherId === "string" ? p.teacherId : p.teacherId._id,
          startMinutes: p.startMinutes,
          endMinutes: p.endMinutes,
        })),
        room: room.trim(),
      }).unwrap();

      toast.success(`${selectedDay} schedule saved`);

      onSaved();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save timetable");
    }
  };

  const handleClearDay = async () => {
    if (!currentDayData?._id) return;
    try {
      await deleteTimetableDay(currentDayData._id).unwrap();
      toast.success(`${selectedDay} schedule cleared`);
      onSaved();
      setIsClearAlertOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to clear schedule");
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        {DAYS.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => setSelectedDay(day)}
            className="rounded-xl px-6"
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Single Room Input for the entire day */}
      <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" /> Room
        </label>
        <Input
          type="text"
          placeholder="R-101"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="rounded-lg h-10"
        />
      </div>

      <div className="space-y-4">
        {periods.map((period, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="md:col-span-2">
              <TimePicker
                label="Start"
                value={minutesToTime(period.startMinutes)}
                onChange={(val) => updatePeriod(index, "startMinutes", timeToMinutes(val))}
              />
            </div>

            <div className="md:col-span-2">
              <TimePicker
                label="End"
                value={minutesToTime(period.endMinutes)}
                onChange={(val) => updatePeriod(index, "endMinutes", timeToMinutes(val))}
              />
            </div>

            <div className="md:col-span-3">
              <CustomSelect
                label="Subject"
                value={
                  typeof period.subjectId === "string"
                    ? period.subjectId
                    : period.subjectId?._id
                }
                onChange={(val) => updatePeriod(index, "subjectId", val)}
                options={subjectOptions}
                placeholder="Subject"
                loading={loadingSubjects}
              />
            </div>

            <div className="md:col-span-3">
              <CustomSelect
                label="Teacher"
                value={
                  typeof period.teacherId === "string"
                    ? period.teacherId
                    : period.teacherId?._id
                }
                onChange={(val) => updatePeriod(index, "teacherId", val)}
                options={teacherOptions}
                placeholder="Teacher"
                loading={loadingTeachers}
              />
            </div>

            <div className="md:col-span-1 flex justify-center pb-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePeriod(index)}
                className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-10 w-10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-3">
          <Button variant="outline" onClick={addPeriod} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Period
          </Button>

          {currentDayData && (
            <Button
              variant="outline"
              onClick={() => setIsClearAlertOpen(true)}
              className="rounded-xl text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear {selectedDay}
            </Button>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>

      <CustomAlert
        isOpen={isClearAlertOpen}
        setIsOpen={setIsClearAlertOpen}
        handleDelete={handleClearDay}
        loading={isDeleting}
        title={`Clear ${selectedDay} Schedule?`}
        description="This will remove all periods assigned to this day. This action cannot be undone."
      />
    </div>
  );
}
