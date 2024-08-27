import "./Sidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";

const techLogosd = {
  React: assets.ReactLogo,
  react: assets.ReactLogo,
  Angular: assets.AngSmallLogoFigma,
  angular: assets.AngSmallLogoFigma,
  Vue: assets.VueLogo,
  vue: assets.VueLogo,
  HTML: assets.HTMLLogo,
  Html: assets.HTMLLogo,   
  html: assets.HTMLLogo,
  Express: assets.ExpressLogo,
  express: assets.ExpressLogo,
  Node: assets.NodeSmallLogoFigma,
  node: assets.NodeSmallLogoFigma,
  MongoDB: assets.MongoSmallLogoFigma,
  mongodb: assets.MongoSmallLogoFigma,
  Postgre: assets.PostgreSmallLogoFigma,
  postgre: assets.PostgreSmallLogoFigma,
  Python: assets.ReactLogo,   
  python: assets.ReactLogo,
  Java: assets.HTMLLogo,
  java: assets.HTMLLogo,
  Django: assets.VueLogo,
  django: assets.VueLogo,
  JavaScript: assets?.JavascriptLogoOri,
  javascript: assets?.JavascriptLogoOri,
  javaScript: assets?.JavascriptLogoOri,   
  DefaultIcon: assets.DefaultIcon,
};



const techLogos = [
  { logo: assets.ReactLogo, name: "React" },
  { logo: assets.AngularLogo, name: "Angular" },
  { logo: assets.VueLogo, name: "Vue" },
  { logo: assets.HTMLLogo, name: "HTML" },
  { logo: assets.ExpressLogo, name: "Express" },
  { logo: assets.NodeLogo, name: "Node" },
  { logo: assets.MongoLogo, name: "MongoDB" },
  { logo: assets.CustomLogo, name: "Postgre" },
  { logo: assets.ReactLogo, name: "Python" },
  { logo: assets.HTMLLogo, name: "Java" },
  { logo: assets.VueLogo, name: "Django" },
  { logo: assets.VueLogo, name: "C++" },
  { logo: assets.JavascriptLogoOri, name: "JavaScript" },
];

const Sidebar = () => {
  const { dispatch } = useValue(); 
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [showQuickSuggestion, setShowQuickSuggestion] = useState(true);
  const [history, setHistory] = useState([]);
  const [isProjectContext, setIsProjectContext] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profile_picture: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleTopicClick = (id) => {
    setSelectedTopicId(id);
    if (isProjectContext) {
      navigate(`/projectHistory/${id}`, { state: { from: "project" } });
    } else {
      navigate(`/mcqHistory/${id}`, { state: { from: "mcq" } });
    }
  };

  const handleCardClick = (techName) => {
    dispatch({
      type: "QUICK_SUGGESTION_DATA",
      payload: techName,
    });
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      let apiUrl = "";
      if (location.pathname.includes("/project") || location.pathname.includes("/projectHistory"))  {
        apiUrl = "https://mcq-curriculum-ai.navgurukul.org/project/getHistory";
        setIsProjectContext(true);
      } else if (location.pathname.includes("/mcq") || location.pathname.includes("/mcqHistory")) {
        apiUrl = "https://mcq-curriculum-ai.navgurukul.org/mcq/getHistory";
        setIsProjectContext(false);
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        const historyData = response.data.data.userHistoryData.history;
        setHistory(historyData); // Store the fetched history data in the state
        const uniqueTopics = [
          ...new Set(historyData.map((item) => item.topic)),
        ];
        setTopics(uniqueTopics);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const authData = JSON.parse(localStorage.getItem("AUTH"));

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("AUTH"));

    if (authData) {
      const { name, email, profile_picture } = authData;
      setUserInfo({ name, email, profile_picture });
    }

    if (location.pathname.includes("/project")) {
      setShowQuickSuggestion(false);
      fetchHistory();
    } else if (location.pathname.includes("/mcq")) {
      setShowQuickSuggestion(true);
      fetchHistory();
    } 
  }, [location.pathname,showSuggestion]);

  const handleShowSuggestions = () => {
    setShowSuggestion(!showSuggestion);
  };

  return (
    <div id="nav-bar" style={{ border: "0.1px solid lightgrey" }}>
      <input type="checkbox" id="nav-toggle" />

      <div id="nav-header">
        {showQuickSuggestion ? (
          <span>MCQs History</span>
        ) : (
          <span>Project History</span>
        )}
        <label htmlFor="nav-toggle" onClick={handleShowSuggestions}>
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>
      {showSuggestion && (
        <div id="nav-content">
          {history.map((item, index) => (
            <div className="nav-button" key={index}>
              <div className="image-wrapper" >
                <img
                  // src={techLogosd[item?.topic] || assets.DefaultIcon}
                  src={techLogosd[item?.topic] || techLogosd.DefaultIcon}
                  alt={item.topic}
                  className="history-icon"
                  style={{ width: "30px", height: "30px", borderRadius:"50px" }}
                />
              </div>
              <div className="bg-grey sidebar-box-text" >
                <p
                  onClick={() => handleTopicClick(item._id)}
                  style={{
                    cursor: "pointer",
                    color: selectedTopicId === item._id ? "orange" : "",
                    width: "max-content",
                  }}
                >
                  {item.topic}
                </p>
                <span className="projectDate">
                  Created on - {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {showQuickSuggestion && (
            <div className="suggestion-box-sb  ">
              <h5>Quick Suggestion </h5>
              <div className="min-box-wrapper-sb">
                {techLogos.map((tech, index) => (
                  <div
                    key={index}
                    className="single-box-sb"
                    onClick={() => handleCardClick(tech.name)}
                  >
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="smallCard-logo-sb"
                    />
                    <p >{tech.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showSuggestion && (
        <div id="nav-footer">
          <div id="nav-footer-heading">
            <div id="nav-footer-avatar">
              <img src={authData?.profile_picture} alt="profile_picture" />
            </div>
            <div id="nav-footer-titlebox">
              <p id="nav-footer-title">{userInfo.name}</p>
            </div>
            <label htmlFor="nav-footer-toggle">
              <i className="fas fa-caret-up"></i>
            </label>
          </div>

          {/* <div id="nav-footer-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div> */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
