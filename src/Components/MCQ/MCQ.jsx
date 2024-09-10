import { useState, useEffect, useRef } from "react";
import Navbar from "../ReuseableCompo/Navbar";
import { assets } from "../../assets/assets";
import DisplayResult from "./DisplayResult";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../ReuseableCompo/Modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import "./MCQ.css";
import { useValue } from "../../context/ContextProvider";

const techLogos = [
  { logo: assets.ReactLogo, name: "React" },
  { logo: assets.AngSmallLogoFigma, name: "Angular" },
  { logo: assets.VueLogo, name: "Vue" },
  { logo: assets.HTMLLogo, name: "HTML" },
  { logo: assets.ExpressLogo, name: "Express" },
  { logo: assets.NodeSmallLogoFigma, name: "Node" },
  { logo: assets.MongoSmallLogoFigma, name: "MongoDB" },
  { logo: assets.PostgreSmallLogoFigma, name: "Postgre" },
  { logo: assets.pythonSmallLogoFigma, name: "Python" },
  { logo: assets.javaSmallLogoFigma, name: "Java" },
  { logo: assets.djangoSmallLogoFigma, name: "Django" },
  { logo: assets.CppSmallLogoFigma, name: "C++" },
];

const MCQ = () => {
  const [topic, setTopic] = useState("");
  const [mcqNumber, setMcqNumber] = useState("");
  const [responses, setResponses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextRequest, setNextRequest] = useState(true);
  const [email, setEmail] = useState("");
  // const [selectedFileType, setSelectedFileType] = useState(fileTypes[0]);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const apistopRef = useRef(false);
  const { state, dispatch } = useValue();
  // console.log(state, "STATE");

  useEffect(() => {
    if (state.quickSuggestionData) {
      setTopic(state.quickSuggestionData);
      setMcqNumber(10);
      dispatch({ type: "CLEAR_SUGGESTION_DATA" });
    }
    if (localStorage.getItem("loginSuccess") === "true") {
      toast.success("Login Successful. Welcome to Curriculum-AI.", {});
      localStorage.removeItem("loginSuccess");
    }
    const auth = JSON.parse(localStorage.getItem("AUTH"));
    if (auth && auth.email) {
      setEmail(auth.email);
    }
  }, [nextRequest, state.quickSuggestionData]);

  const handleCardClick = (techName) => {
    setTopic(techName);
    setMcqNumber(10);
  };

  const handleGenerateMCQ = () => {
    // setNextRequest(false);
    if (topic.length <= 1) {
      toast.error(
        "Please enter a valid topic name or select one from the suggestion box."
      );
      return;
    }
    if (mcqNumber < 5) {
      toast.error("You need to generate at least 5 MCQs.");
      return;
    }
    if (mcqNumber < 0) {
      toast.error("Number of MCQs cannot be negative.");
      return;
    }
    if (typeof topic === "number" || !isNaN(topic)) {
      toast.error("Topic name should not be a number.");
      return;
    }
    if (!topic || !mcqNumber) {
      toast.error("Please enter both a topic and the number of questions");
      return;
    }
    if (mcqNumber > 500) {
      toast.error("The maximum limit for MCQs is 500.");
      return;
    }
    if (mcqNumber > 30 && selectedFileTypes.length === 0) {
      toast.error("Please select at least one file type.");
      return;
    }
    if (mcqNumber > 30) {
      setIsModalOpen(true);
    }
    setResponses((prevResponses) => [
      ...prevResponses,
      {
        topic,
        mcqNumber,
        // fileTypes: [selectedFileType],
        fileTypes: mcqNumber > 30 ? selectedFileTypes : [],
        response: null,
      },
    ]);
    setTopic("");
    setMcqNumber("");
    setSelectedFileTypes([]);
  };

  const updateResponse = (index, newResponse) => {
    setResponses((prevResponses) =>
      prevResponses.map((resp, i) =>
        i === index ? { ...resp, response: newResponse } : resp
      )
    );
  };

  const handleFileTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFileTypes((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((type) => type !== value)
    );
  };

  return (
    <>
      <div className="outer-wrapper">
        <Navbar />
        <div className="main-container-experi">
          <div className="display-result">
            <div className="result">
              {responses.length > 0 ? (
                responses.map((response, index) => (
                  <DisplayResult
                    key={index}
                    topic={response.topic}
                    mcqNumber={response.mcqNumber}
                    response={response.response}
                    selectedFileType={response.fileTypes}
                    updateResponse={(newResponse) =>
                      updateResponse(index, newResponse)
                    }
                    apistopRef={apistopRef}
                    setNextRequest={setNextRequest}
                  />
                ))
              ) : (
                <div>
                  <h2 style={{ textAlign: "center", margin: "10px" }}>
                    Generate MCQs For Your Desired Topic
                  </h2>
                  <p
                    style={{
                      color: "white",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    For more than 30 MCQs, you can receive the details through
                    email with downloadable PDFs
                  </p>
                  <div className="suggestion-box">
                    <h3>Quick Suggestion </h3>

                    <div className="min-box-wrapper">
                      {techLogos.map((tech, index) => (
                        <div
                          key={index}
                          className="single-box"
                          onClick={() => handleCardClick(tech.name)}
                        >
                          <img
                            src={tech.logo}
                            alt={tech.name}
                            className="smallCard-logo"
                          />
                          <p>{tech.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="input-feed">
              
              <div className="main-input-wrapper" >
                <div className="input-field-wrapper">
                  <div className="topic-name">
                    {/* <label htmlFor="text">Topic</label> */}
                    <input
                      type="text"
                      placeholder="Topic Name"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <div className="mcq-feed">
                    {/* <label htmlFor="number">MCQs</label> */}
                    <input
                      type="number"
                      value={mcqNumber}
                      placeholder="Enter number of MCQ"
                      onChange={(e) => setMcqNumber(e.target.value)}
                    />
                  </div>
                </div>
                {mcqNumber > 30 && (
                  <div className="file-type-wrapper">
                    <div className="file-type">
                      <label>File Type </label>
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          name="filetype"
                          value="pdf"
                          onChange={handleFileTypeChange}
                        />
                        <span>PDF</span>
                        <input
                          type="checkbox"
                          name="filetype"
                          value="csv"
                          onChange={handleFileTypeChange}
                        />
                        <span>CSV</span>
                        <input
                          type="checkbox"
                          name="filetype"
                          value="json"
                          onChange={handleFileTypeChange}
                        />
                        <span style={{ margin: "0px" }}>JSON</span>
                      </div>
                    </div>
                    <div className="file-info-para">
                      <p
                        style={{ fontSize: "12px", color: "white" }}
                        className="file-info"
                      >
                        You can select multiple file types and receive the MCQs
                        through email.
                      </p>
                    </div>
                  </div>
                )}
                <div className="btn-wrapper">
                  <button
                    className="generate-mcq-btn"
                    onClick={handleGenerateMCQ}
                    disabled={!nextRequest}
                  >
                    {nextRequest ? "Generate MCQs" : "Please wait..."}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-bg-grey">Request MCQs through Email</h2>
          <br />
          <br />
          <p className="text-bg-grey">
            You will receive the MCQs in your email - {email} shortly.
          </p>
          <br />
          <br />
        </Modal>
      )}
    </>
  );
};

export default MCQ;
