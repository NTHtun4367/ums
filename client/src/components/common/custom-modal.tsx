import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomModalProps {
  title: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function CustomModal({
  description,
  open,
  setOpen,
  title,
  children,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Increased width to 2xl for the two-column design and set max-h */}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Container for the form with padding */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomModal;
