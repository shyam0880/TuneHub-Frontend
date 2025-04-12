import React, { useContext, useEffect } from "react";
import "../CSS/AlertMessage.css";
import AuthContext from "../Context/AuthContext";

const AlertMessage = () => {
  const { alertData, setAlertData } = useContext(AuthContext);

  useEffect(() => {
    if (alertData.show) {
      const timer = setTimeout(() => {
        setAlertData((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertData]);

  if (!alertData.show) return null;

  const isSuccess = alertData.status;

  return (
    <div className="alert-container">
      <div className={`alert-box ${isSuccess ? "success" : "error"}`}>
        <div className="alert-left">
          <div className="alert-icon">
            {isSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth="1.5" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth="1.5" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
              </svg>
            )}
          </div>
          <span className="alert-message">{alertData.message}</span>
        </div>
        <button onClick={() => setAlertData((prev) => ({ ...prev, show: false }))} className="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;
