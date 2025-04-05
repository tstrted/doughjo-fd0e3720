
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to Budget page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Force a complete reload of the application state
    // This ensures all hooks are reinitialized with default values from localStorage
    const redirectToBudget = () => {
      navigate("/budget", { replace: true });
    };
    
    // Small delay to ensure all context providers have initialized
    setTimeout(redirectToBudget, 100);
  }, [navigate]);
  
  return null;
};

export default Index;
