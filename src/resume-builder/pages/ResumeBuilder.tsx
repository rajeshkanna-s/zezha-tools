import React from "react";
import PersonalDetails from "../components/formSections/PersonalDetails";
import ResumePreview from "../components/templates/BasicTemplate";
import { ResumeProvider } from "../context/ResumeContext";

const ResumeBuilder: React.FC = () => {
  return (
    <ResumeProvider>
      <div className="container-fluid">
        <div className="row">
          {/* Form Section */}
          <div className="col-md-6 p-3">
            <h4>Build Your Resume</h4>
            <PersonalDetails />
            {/* Add other form sections here */}
          </div>

          {/* Live Preview Section */}
          <div className="col-md-6 bg-light p-3">
            <h4>Live Preview</h4>
            <ResumePreview />
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default ResumeBuilder;
