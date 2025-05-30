import React, { createContext, useContext, useState } from "react";
import { ResumeData } from "../types/resumeTypes";

interface ResumeContextProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalDetails: {},
    workExperience: [],
    education: [],
    projects: [],
    skills: [],
    extras: {},
  });

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
