import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../ReuseableCompo/Navbar";
import "./Project.css";
import Modal from "../ReuseableCompo/Modal/Modal";
import ProjectGeneration from "./ProjectGeneration";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

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
  { logo: assets.JavascriptLogoOri, name: "Javascript" },
];

const getLogoForTopic = (topic) => {
  const tech = techLogos.find(
    (tech) => tech.name.toLowerCase() === topic.toLowerCase()
  );
  return tech ? tech.logo : null;
};

const Project = () => {
  const [projectHistory, setProjectHistory] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [error, setError] = useState(null);
  const [numProjects, setNumProjects] = useState();
  const [topic, setTopic] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const apistopRefProject = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nextRequest, setNextRequest] = useState(true);
  const navigate = useNavigate();

  const handleGenerateProjects = () => {
    if (!topic) {
      toast.error(
        "Please select the topic name for which you would like to generate a project."
      );
      return;
    }
    if (typeof topic === "number" || !isNaN(topic)) {
      toast.error("Topic name should not be a number.");
      return;
    }
    if (topic.length < 1) {
      toast.error("Please enter topic name or select from suggestion box.");
      return;
    }
    if (!topic || !numProjects) {
      toast.error("Please enter a topic and the number of projects.");
      return;
    }
    if (numProjects > 7) {
      toast.error("We can currently generate up to 7 projects for you.");
      setNumProjects(7);
      return;
    }
    if (numProjects < 1) {
      toast.error("Number of projects cannot be negative or zero.");
      return;
    }
    if (numProjects > 3 && numProjects <= 7) {
      setIsModalOpen(true);
    }
    setProjectData((prevData) => [
      ...prevData,
      { topic, numProjects, response: null },
    ]);
    setTopic("");
    setNumProjects("");
  };

  const updateResponse = (index, newResponse) => {
    setProjectData((prevData) =>
      prevData.map((project, i) =>
        i === index ? { ...project, response: newResponse } : project
      )
    );
  };

  useEffect(() => {
    //below code for fetching email from LS
    const auth = JSON.parse(localStorage.getItem("AUTH"));
    if (auth && auth.email) {
      setEmail(auth.email);
    }

    const fetchPreviousProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://mcq-curriculum-ai.navgurukul.org/project/getHistory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjectHistory(response.data.data.userHistoryData.history);
      } catch (error) {
        console.error("Failed to fetch previous projects", error);
        setError("Failed to fetch previous projects");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousProjects();
  }, []);

  const handleProjectClick = async (project) => {
    navigate(`/projectHistory/${project._id}`, { state: { from: "project" } });
    return;
    // setModalOpen(true);
    // setLoadingModalInfo(true);
    // try {
    //   const token = localStorage.getItem("token");
    //   const response = await axios.get(
    //     `https://mcq-curriculum-ai.navgurukul.org/project/detailedHistory?question_id=${project._id}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (response.data.status === "success") {
    //     setSelectedProject(response.data.data);
    //   }
    // } catch (error) {
    //   console.error("Error fetching project details:", error);
    // }
    // setLoadingModalInfo(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <div className="project-main-wrapper">
        <Navbar />
        <div className="project-content">
          <div className="display-result">
            <div className="result-project">
              {projectData.length > 0 ? (
                projectData.map((project, index) => (
                  <ProjectGeneration
                    key={index}
                    topic={project.topic}
                    numProjects={project.numProjects}
                    response={project.response}
                    updateResponse={(newResponse) =>
                      updateResponse(index, newResponse)
                    }
                    apistopRefProject={apistopRefProject}
                    setNextRequest={setNextRequest}
                  />
                ))
              ) : (
                <div>
                  <div>
                    <h2 style={{ textAlign: "center", margin: "10px" }}>
                      Please select topic name for generating projects
                    </h2>
                    <p
                      style={{
                        color: "white",
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    >
                      For more than three projects, you can receive the project
                      details through email with downloadable PDFs.
                    </p>
                  </div>

                  <div className="history-section">
                    <h3>Previous Projects</h3>
                    <div className="projects-list">
                      {projectHistory.length > 0 ? (
                        projectHistory.map((project, index) => (
                          <div
                            className="project-entry"
                            key={index}
                            onClick={() => handleProjectClick(project)}
                          >
                            <div className="image-container">
                              <img
                                src={getLogoForTopic(project.topic)}
                                alt={project.topic}
                              />
                            </div>
                            <div className="topic-text">
                              <p className="project-topic">
                                {project.topic.charAt(0).toUpperCase() +
                                  project.topic.slice(1)}
                              </p>
                              {/* <p className="project-date">
                                {new Date(project.created_at).toLocaleString()}
                              </p> */}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            width: "750px",
                            textAlign: "center",
                          }}
                        >
                          <p>No previous projects found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-detail">
              <div className="input-topic-wrapper">
                {/* <label htmlFor="topic">Topic:</label>
              <input
                type="text"
                id="topic"
                value={topic}
                placeholder="Ex. React"
                onChange={(e) => setTopic(e.target.value)}
              /> */}
                {/* <label htmlFor="topic">Topic:</label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Select a topic</option>
                  <option value="React">React</option>
                  <option value="Html">HTML & CSS</option>
                  <option value="JavaScript">JavaScript</option>
                </select> */}
                <div className="radio-btn-wrapper">
                  <span>Topic - </span>
                  <label>
                    <input
                      type="radio"
                      name="topic"
                      value="React"
                      checked={topic === "React"}
                      onChange={(e) => setTopic(e.target.value)}
                      className="custom-radio"
                    />
                    React
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="topic"
                      value="Html"
                      checked={topic === "Html"}
                      onChange={(e) => setTopic(e.target.value)}
                      className="custom-radio"
                    />
                    HTML & CSS
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="topic"
                      value="JavaScript"
                      checked={topic === "JavaScript"}
                      onChange={(e) => setTopic(e.target.value)}
                      className="custom-radio"
                    />
                    JavaScript
                  </label>
                </div>

                <div
                  className="project-num-wrapper"
                  style={{ margin: "10px 0px" }}
                >
                  {/* <label htmlFor="numProjects">Number of Projects:</label> */}
                  <input
                    type="number"
                    id="numProjects"
                    placeholder="Number of Projects"
                    value={numProjects}
                    onChange={(e) => setNumProjects(e.target.value)}
                    // onBlur={() => {
                    //   if (numProjects > 7) {
                    //     toast.error(
                    //       "We can currently generate up to 7 projects for you."
                    //     );
                    //     setNumProjects(7);

                    //   }
                    // }}
                    min="1"
                  />
                  {/* <input
                    type="text"
                    id="numProjects"
                    placeholder="Number of Projects"
                    value={numProjects}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9\b]+$/.test(value)) {
                        setNumProjects(value);
                      }
                    }}
                    min="1"
                  /> */}
                </div>

                <div className="generate-proj-btn">
                  <button
                    onClick={handleGenerateProjects}
                    style={{ cursor: "pointer" }}
                    disabled={!nextRequest}
                  >
                    {nextRequest ? "Generate Projects" : "Please wait..."}
                  </button>
                </div>
              </div>

              {/* <hr className="hr-line" /> */}
            </div>
          </div>
        </div>

        {modalOpen && (
          <Modal onClose={closeModal}>
            <div className="modal-content">
              {loadingModalInfo ? (
                <p>Fetching data...</p>
              ) : (
                selectedProject && (
                  <>
                    <h2>Project Details</h2>
                    <br />
                    {selectedProject.project_pdf.map((pdf, index) => (
                      <div key={index} className="project-pdf-details">
                        <h5>{pdf.title}</h5>
                        <p>{pdf.description}</p>
                        <a
                          className="proj-pdf"
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project Details
                        </a>
                        <hr />
                      </div>
                    ))}
                  </>
                )
              )}
            </div>
          </Modal>
        )}
      </div>
      <ToastContainer />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="bg-grey" >Request Projects through Email</h2>
          <br />
          <br />
          <p className="bg-grey" >You will receive the Projects in your email - {email} shortly.</p>
          <br />
          <br />
        </Modal>
      )}
    </>
  );
};

export default Project;
