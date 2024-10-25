import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const {user , pageAccess} = useAuth();
  const location = useLocation();
  
  
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if(!pageAccess.map(page => {return page.url}).includes(location.pathname) && location.pathname != '/login'){
    return <div className="h-[90vh]w-100 flex items-center justify-center py-10">You have no acess to this page.</div>
  } 
    
  return children;

}