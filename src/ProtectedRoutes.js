import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  return user !== null;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoutes;
