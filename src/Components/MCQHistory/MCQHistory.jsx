import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../ReuseableCompo/Navbar";
import "./MCQHistory.css";

const MCQHistory = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // Get the ID from the URL
  const [mcqData, setMcqData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state
  const location = useLocation();
  const from = location.state?.from;

  const fetchMcqHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://mcq-curriculum-ai.navgurukul.org/mcq/detailedHistory?question_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setData(response.data.data);
      } else {
        setError("Failed to fetch MCQ history.");
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://mcq-curriculum-ai.navgurukul.org/project/detailedHistory?question_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setData(response.data.data);
      } else {
        setError("Failed to fetch project history.");
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchMcqHistory();
  // }, [id]);

  useEffect(() => {
    if (from === "project") {
      fetchProjectHistory();
    } else if (from === "mcq") {
      fetchMcqHistory();
    }
  }, [from, id]);

  return (
    <div>
      <Navbar />
      <div className="mcq-history-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          data && (
            <div className="mcqHistory-wrapper">
              {from === "project" ? (
                <div className="project-output" 
                >
                  <h2>Project Details</h2>
                  {data.project_pdf.map((project, index) => (
                    <div key={index} className="project-item">
                      <h4>{project.title.replace("## ", "")}</h4>
                      <p>{project.description}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color:"orange", textDecoration:"underline"}}
                      >
                        View Project Details
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mcq-output">
                  <h2  >Previous MCQs Generated</h2>
                  {data.mcq_output.map((mcq, index) => (
                    <div key={index} className="mcq-item">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: mcq.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MCQHistory;
