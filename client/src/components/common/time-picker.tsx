import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export function TimePicker({ value, onChange, className, label }: TimePickerProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> {label}
        </label>
      )}
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg h-10 border-input focus:ring-primary"
      />
    </div>
  );
}
