import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkAuth from "../features/checkAuth";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate("../login");
      }
    };
    verify();
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;