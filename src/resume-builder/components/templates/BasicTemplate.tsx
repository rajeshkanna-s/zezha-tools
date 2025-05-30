import React from "react";
import { useResume } from "../../context/ResumeContext";

const BasicTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personalDetails } = resumeData;

  return (
    <div className="p-3 border rounded bg-white">
      <h2>{personalDetails.name}</h2>
      <p>{personalDetails.summary}</p>
      <p>
        📧 {personalDetails.email} | 📞 {personalDetails.phone}
      </p>
      <p>
        🌐 {personalDetails.website1} | 💼 {personalDetails.website2}
      </p>
      <p>📍 {personalDetails.location}</p>
    </div>
  );
};

export default BasicTemplate;
