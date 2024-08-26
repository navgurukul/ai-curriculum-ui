import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../ReuseableCompo/Navbar";
import "./MCQHistory.css";

const MCQHistory = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [mcqData, setMcqData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

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
        setMcqData(response.data.data);
      } else {
        setError("Failed to fetch MCQ history.");
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMcqHistory();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="mcq-history-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          mcqData && (
            <div className="mcqHistory-wrapper">
              
              <div className="mcq-output">
              <h3>Previous MCQs Generated</h3>
                {mcqData.mcq_output.map((mcq, index) => (
                  <div key={index} className="mcq-item">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: mcq.replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MCQHistory;
