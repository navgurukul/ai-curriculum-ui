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
  Python: assets.pythonSmallLogoFigma,
  python: assets.pythonSmallLogoFigma,
  Java: assets.javaSmallLogoFigma,
  java: assets.javaSmallLogoFigma,
  Django: assets.djangoSmallLogoFigma,
  django: assets.djangoSmallLogoFigma,
  JavaScript: assets?.JavascriptLogoOri,
  javascript: assets?.JavascriptLogoOri,
  javaScript: assets?.JavascriptLogoOri,
  "c++": assets?.CppSmallLogoFigma,
  "C++": assets?.CppSmallLogoFigma,
  DefaultIcon: assets.DefaultIcon,
};

const techLogos = [
  { logo: assets.ReactLogo, name: "React" },
  { logo: assets.AngSmallLogoFigma, name: "Angular" },
  { logo: assets.VueLogo, name: "Vue" },
  { logo: assets.ExpressLogo, name: "Express" },
  { logo: assets.NodeSmallLogoFigma, name: "Node" },
  { logo: assets.MongoSmallLogoFigma, name: "MongoDB" },
  { logo: assets.PostgreSmallLogoFigma, name: "Postgre" },
  { logo: assets.pythonSmallLogoFigma, name: "Python" },
  { logo: assets.javaSmallLogoFigma, name: "Java" },
  { logo: assets.djangoSmallLogoFigma, name: "Django" },
  { logo: assets.CppSmallLogoFigma, name: "C++" },
  { logo: assets.JavascriptLogoOri, name: "JavaScript" },
];

const Sidebar = () => {
  const { dispatch } = useValue();
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showQuickSuggestion, setShowQuickSuggestion] = useState(true);
  const [history, setHistory] = useState([]);
  const [isProjectContext, setIsProjectContext] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(false);
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
      if (
        location.pathname.includes("/project") ||
        location.pathname.includes("/projectHistory")
      ) {
        apiUrl = "https://mcq-curriculum-ai.navgurukul.org/project/getHistory";
        setIsProjectContext(true);
      } else if (
        location.pathname.includes("/mcq") ||
        location.pathname.includes("/mcqHistory")
      ) {
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 60) {
      return "1 month ago";
    } else if (diffDays < 90) {
      return "2 months ago";
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} months ago`;
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
    } else if (location.pathname.includes("/mcqHistory/")) {
      setShowQuickSuggestion(true);
      fetchHistory();
    } else if (location.pathname.includes("/projectHistory/")) {
      setShowQuickSuggestion(false);
      fetchHistory();
    }
  }, [location.pathname, showSuggestion]);

  const handleShowSuggestions = () => {
    setShowSuggestion(!showSuggestion);
  };

  const showOptions = () => {
    setShowQuickOptions(!showQuickOptions);
  };

  return (
    <div id="nav-bar" style={{ border: "0.1px solid lightgrey" }}>
      <input
        type="checkbox"
        id="nav-toggle"
        onChange={handleShowSuggestions}
        checked={!showSuggestion}
      />

      <div id="nav-header">
        {showQuickSuggestion ? (
          <span>MCQs History</span>
        ) : (
          <span>Project History</span>
        )}
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>
      {showSuggestion && (
        <div id="nav-content">
          <div>
            {history.map((item, index) => (
              <div
                className="bg-grey nav-button"
                key={index}
                onClick={() => handleTopicClick(item._id)}
                style={{
                  cursor: "pointer",
                  border:
                    selectedTopicId === item._id ? "1px solid orange" : "",
                }}
              >
                {/* <div className="image-wrapper">
                <img
                  src={techLogosd[item?.topic] || techLogosd.DefaultIcon}
                  alt={item.topic}
                  className="history-icon"
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50px",
                  }}
                />
              </div> */}
                <div className="bg-grey sidebar-box-text">
                  <p
                    style={{
                      color: selectedTopicId === item._id ? "orange" : "",
                    }}
                  >
                    {item.topic}
                  </p>
                  <span className="projectDate">
                    {getTimeAgo(item.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            {showQuickSuggestion && (
              <div
                // className="suggestion-box-sb  "
                className={`suggestion-box-sb ${
                  showQuickOptions ? "active" : ""
                }`}
              >
                <button className="quick-suggestion" onClick={showOptions}>
                  {showQuickOptions ? "Suggested Topic" : "Suggested Topic"}
                </button>
                {/* <h5>Quick Suggestion </h5> */}
                {showQuickOptions && (
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
                        <p>{tech.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
        </div>
      )}
    </div>
  );
};

export default Sidebar;
