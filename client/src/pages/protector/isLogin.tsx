import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import type { RootState } from "../../store";
import { clearUserInfo } from "../../store/slices/auth";
import { useGetMeQuery } from "../../store/slices/userApi";

function Protect({ children }: { children: React.ReactNode }) {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // This validates the session with the backend
  const { isError, isLoading, isFetching } = useGetMeQuery(undefined, {
    // Only run if we think we are logged in via localStorage
    skip: !userInfo,
  });

  useEffect(() => {
    // 1. If no info in Redux/LocalStorage, redirect to login
    if (!userInfo) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    // 2. If the API confirms the token is invalid/expired
    if (isError && !isFetching) {
      dispatch(clearUserInfo());
      navigate("/login", { replace: true });
    }
  }, [userInfo, isError, isFetching, navigate, dispatch, location]);

  // Show a loading screen while verifying the session
  if (isLoading || (userInfo && isFetching)) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-white font-mono gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase text-xs">
          Verifying Session...
        </p>
      </div>
    );
  }

  // Final render: only if we have info and the backend didn't throw an error
  return userInfo && !isError ? <>{children}</> : null;
}

export default Protect;
