import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomModelProps {
  title: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function CustomModel({
  description,
  open,
  setOpen,
  title,
  children,
}: CustomModelProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomModel;
