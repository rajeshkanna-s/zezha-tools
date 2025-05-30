import React from "react";
import { useResume } from "../../context/ResumeContext";

const PersonalDetails: React.FC = () => {
  const { resumeData, setResumeData } = useResume();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [name]: value },
    }));
  };

  const details = resumeData.personalDetails;

  return (
    <div>
      <h5>Personal Details</h5>
      <input
        name="name"
        placeholder="Full Name"
        value={details.name || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <textarea
        name="summary"
        placeholder="Summary"
        value={details.summary || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <input
        name="email"
        placeholder="Email"
        value={details.email || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={details.phone || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <input
        name="website1"
        placeholder="LinkedIn"
        value={details.website1 || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <input
        name="website2"
        placeholder="GitHub"
        value={details.website2 || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <input
        name="location"
        placeholder="Location"
        value={details.location || ""}
        onChange={handleChange}
        className="form-control mb-2"
      />
    </div>
  );
};

export default PersonalDetails;
