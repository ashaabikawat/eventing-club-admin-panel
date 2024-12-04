import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({children }) => {
  const adminUser = useSelector((store) => store.auth);
  // console.log(adminUser)

  if (adminUser?.adminSignupData?.AdminRole !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
