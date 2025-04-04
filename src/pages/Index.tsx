
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to Budget page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Use replace to avoid adding to history stack
    navigate("/budget", { replace: true });
  }, [navigate]);
  
  return null;
};

export default Index;
