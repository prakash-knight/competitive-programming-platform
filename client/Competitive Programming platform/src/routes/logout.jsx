import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    sessionStorage.clear();
    navigate("/", { replace: true });
  }, [navigate]);

  return <h2>Logging out...</h2>;
}