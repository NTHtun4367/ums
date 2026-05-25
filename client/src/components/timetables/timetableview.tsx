import {
  BookOpen,
  MapPin,
  User,
  FileSpreadsheet,
  CalendarCheck,
  Clock,
} from "lucide-react";

interface ViewProps {
  timetable: any[];
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TimetableView = ({ timetable }: ViewProps) => {
  const hasData =
    Array.isArray(timetable) && timetable.some((d) => d.periods?.length > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-16 bg-white dark:bg-zinc-900 text-center shadow-sm">
        <FileSpreadsheet className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />

        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          No Timetable Available
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md">
          No schedule configuration has been created for this class yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-500" />

          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            Weekly Timetable Matrix
          </span>
        </div>

        <span className="text-xs font-semibold text-zinc-500">
          Institutional Academic Layout
        </span>
      </div>

      {/* BODY */}
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {WEEKDAYS.map((day) => {
          const dayData = timetable.find((t) => t.day === day);

          return (
            <div key={day} className="p-6">
              {/* DAY HEADER */}
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold">
                  {day}
                </div>

                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
              </div>

              {/* EMPTY */}
              {!dayData?.periods?.length ? (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center text-sm text-zinc-400">
                  No periods assigned
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dayData.periods.map((period: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-4"
                    >
                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                            <BookOpen className="w-4 h-4 text-indigo-500" />

                            {period.subjectId?.name}
                          </div>

                          <div className="mt-1 text-xs font-mono text-zinc-500">
                            {period.subjectId?.code}
                          </div>
                        </div>

                        <div className="text-xs px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold">
                          #{index + 1}
                        </div>
                      </div>

                      {/* TIME */}
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Clock className="w-4 h-4" />

                        <span>
                          {Math.floor(period.startMinutes / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {(period.startMinutes % 60)
                            .toString()
                            .padStart(2, "0")}
                        </span>

                        <span>-</span>

                        <span>
                          {Math.floor(period.endMinutes / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {(period.endMinutes % 60).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {/* TEACHER */}
                      <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <User className="w-4 h-4 text-zinc-400" />

                        {period.teacherId?.name}
                      </div>

                      {/* ROOM */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                        <MapPin className="w-4 h-4" />

                        {period.room}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimetableView;
