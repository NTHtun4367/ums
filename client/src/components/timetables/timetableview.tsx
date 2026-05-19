import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMESLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "13:00-14:00",
  "14:00-15:00",
];

export function TimetableView({ scheduleData }: { scheduleData: any }) {
  // Transform array of day documents into a lookup map
  const lookup = scheduleData?.reduce((acc: any, curr: any) => {
    acc[curr.day] = curr.periods;
    return acc;
  }, {});

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-32">Day</TableHead>
            {TIMESLOTS.map((slot) => (
              <TableHead key={slot} className="text-center">
                {slot}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {DAYS.map((day) => (
            <TableRow key={day}>
              <TableCell className="font-semibold">{day}</TableCell>
              {TIMESLOTS.map((_, idx) => {
                const period = lookup?.[day]?.[idx];
                return (
                  <TableCell key={idx} className="text-center p-4">
                    {period ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold">
                          {period.subjectId?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {period.teacherId?.name}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          {period.room}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
