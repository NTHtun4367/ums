import type { User, UserRole } from "@/types/type";
import CustomModal from "../common/custom-modal"; // Verified path
import UniversalUserForm from "../auth/universal-user-form";

interface UserDialogProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  editingUser: User | null;
  role: UserRole;
}

const UserDialog = ({ open, setOpen, editingUser, role }: UserDialogProps) => {
  const title = editingUser ? `Update ${role}` : `Add New ${role}`;
  const description = editingUser
    ? `Update profile information for ${editingUser.name}.`
    : `Please enter the required details to register a new ${role}.`;

  return (
    <CustomModal
      title={title}
      description={description}
      open={open}
      setOpen={setOpen}
    >
      <UniversalUserForm
        role={role}
        initialData={editingUser}
        onSuccess={() => setOpen(false)}
      />
    </CustomModal>
  );
};

export default UserDialog;
