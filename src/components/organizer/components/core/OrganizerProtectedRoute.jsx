import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OrganizerProtectedRoute = ({children }) => {
  const organizerUser = useSelector((store) => store.organizerauth);

  

  if (organizerUser?.organizerSignupData?.AdminRole !== 3) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerProtectedRoute;
