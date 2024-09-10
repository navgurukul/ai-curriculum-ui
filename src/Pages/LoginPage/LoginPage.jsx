import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "cookies-next";
import { apiMeraki } from "../../axiosConfig";
import { assets } from "../../assets/assets";
import "./LoginPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function reverseJwtBody(jwt) {
  const [header, body, signature] = jwt.split(".");
  const reversedBody = body.split("").reverse().join("");
  return [header, reversedBody, signature].join(".");
}

const LoginPage = () => {
  const loginUrl = import.meta.env.VITE_PUBLIC_NG_AI_LOGIN_URL;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenVal = urlParams.get("token");
    const loggedOutToken = urlParams.get("loggedOutToken");

    const sendGoogleUserData = async (token) => {
      try {
        const resp = await apiMeraki.get(`/users/me`, {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        });

        setLoading(true);
        if (resp.data.user) {
          toast.success("Login Successful. Welcome to Curriculum-AI.");
          localStorage.setItem("loginSuccess", "true");
        }

        localStorage.setItem("AUTH", JSON.stringify(resp.data.user));
        if (!resp.data.user.rolesList[0]) {
          setCookie("secure_typeuser", btoa("student"));
          // return navigate("/student");
          return navigate(`/mcq`);
        } else {
          setCookie("secure_typeuser", btoa(resp.data.user.rolesList[0]));
          // return navigate(`/${resp.data.user.rolesList[0]}`);
          return navigate(`/mcq`);
        }
      } catch (err) {
        toast.error(
          `Login Failed: ${err.response?.data?.message || "An error occurred."}`
        );
      }
    };

    if (tokenVal) {
      setLoading(true);
      localStorage.setItem("loggedOutToken", JSON.stringify(loggedOutToken));
      localStorage.setItem("token", reverseJwtBody(tokenVal));
      sendGoogleUserData(reverseJwtBody(tokenVal));
    } else {
      setLoading(false);
    }

    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "");
    }
    if (!localStorage.getItem("loggedOut")) {
      localStorage.setItem("loggedOut", String(false));
    }
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <div className="loading">Please wait...</div>
        </div>
      ) : (
        <div className="login-page-container">
          <header className="header">
            <div>
              <div className="text-wrapper">
                <h3 className="curriculum-text">
                  Curriculum <span>AI</span>{" "}
                </h3>
              </div>
            </div>
            <div className="navigation">
              <button
                className="get-started-btn"
                onClick={() => (window.location.href = loginUrl)}
              >
                Get Started
              </button>
            </div>
          </header>
          <div className="content">
            <div className="text-section">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h3 className="animate-charcter  ">Curriculum-AI</h3>
                  </div>
                </div>
              </div>
              <p className="para-landing-text">
                A multi-purpose MCQs and project generating platform for
                educational institutions, NGOs, and anyone aiming to improve
                their tech training programs.
              </p>
              <ul>
                <li>
                  <img src={assets.choice} alt="" />
                  <p>
                    Choose from a range of web and programming technologies like
                    React, Javascript and more.
                  </p>
                </li>
                <li>
                  <img src={assets.email} alt="" />
                  <p>
                    Receive larger sets of MCQs and projects via email in
                    preferred file formats in your inbox.
                  </p>
                </li>
                <li>
                  <img src={assets.time} alt="" />
                  <p>Access previously created curriculums anytime.</p>
                </li>
              </ul>
              <div className="buttons">
                <button
                  className="btn"
                  onClick={() => (window.location.href = loginUrl)}
                >
                  <a
                    // href={loginUrl}
                    className="login-button"
                  >
                    Login
                  </a>
                </button> 
              </div>
            </div>
            <div className="image-section">
              <img
                src={assets.NGAI}
                alt="People working together"
                className="sliced-image"
              />
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LoginPage;
