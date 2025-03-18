
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to Budget page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/budget");
  }, [navigate]);
  
  return null;
};

export default Index;
