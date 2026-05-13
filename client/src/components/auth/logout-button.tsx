import { useLogoutMutation } from "@/store/slices/userApi";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { apiSlice } from "@/store/slices/api";
import { LogOut } from "lucide-react";
import { clearUserInfo } from "@/store/slices/auth";

function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUserInfo());
      dispatch(apiSlice.util.resetApiState());

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut size={18} />
      {isLoading ? "Logging out..." : "Log out"}
    </button>
  );
}

export default LogoutButton;
