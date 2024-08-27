import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; 
import Sidebar from "./Components/Sidebar/Sidebar";
import LoginPage from "./Pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoutes/PrivateRoutes"
import Project from "./Components/Project/Project";
import MCQ from "./Components/MCQ/MCQ"
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import MCQHistory from "./Components/MCQHistory/MCQHistory";
import ContextProvider from "./context/ContextProvider";

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="app" style={{ width: "100%" }}>
      {showSidebar && <Sidebar />}
      <div className={`main-content ${showSidebar ? "with-sidebar" : ""}`}>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/mcq" element={<PrivateRoute element={MCQ} />} />
          <Route path="/project" element={<PrivateRoute element={Project} />} />
          <Route
            path="/mcqHistory/:id"
            element={<PrivateRoute element={MCQHistory} />}
          />
          <Route
            path="/projectHistory/:id"
            element={<PrivateRoute element={MCQHistory} />}
          />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <ContextProvider>
      <App />
    </ContextProvider>
  </Router>
);

export default AppWrapper;
