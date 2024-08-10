import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate("/");  
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        textAlign: "center",
      }}
    >
      <img
        src={assets.ErrorPage}
        alt="ErrorPage"
        style={{ height: "98.98vh" }}
      />
      <button 
      style={{position:"absolute", top:"500px", left:"700px"}}
      onClick={handleHomePage}>Home Page</button>
    </div>
  );
};

export default ErrorPage;
