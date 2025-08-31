import React, { useState, useCallback } from 'react';
import { ResumeData } from '../types';
import { INITIAL_RESUME_DATA } from '../constants';

export const useResumeBuilder = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleExperienceChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => {
            const newExperience = [...prev.experience];
            newExperience[index] = { ...newExperience[index], [name]: value };
            return { ...prev, experience: newExperience };
        });
    }, []);

    const addExperience = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: `exp-${Date.now()}`, jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }
            ]
        }));
    }, []);

    const removeExperience = useCallback((index: number) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    }, []);

    const handleEducationChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => {
            const newEducation = [...prev.education];
            newEducation[index] = { ...newEducation[index], [name]: value };
            return { ...prev, education: newEducation };
        });
    }, []);

    const addEducation = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { id: `edu-${Date.now()}`, degree: '', institution: '', startDate: '', endDate: '' }
            ]
        }));
    }, []);
    
    const removeEducation = useCallback((index: number) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    }, []);

    const generateResumeText = useCallback((): string => {
        let text = "";
        text += `${resumeData.fullName}\n`;
        text += `${resumeData.email} | ${resumeData.phoneNumber}${resumeData.linkedin ? ` | ${resumeData.linkedin}` : ''}\n\n`;

        text += "SUMMARY\n";
        text += "------------------------------------\n";
        text += `${resumeData.summary}\n\n`;

        text += "WORK EXPERIENCE\n";
        text += "------------------------------------\n";
        resumeData.experience.forEach(exp => {
            text += `${exp.jobTitle}\n`;
            text += `${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
            text += `${exp.responsibilities.split('\n').map(line => `- ${line}`).join('\n')}\n\n`;
        });

        text += "EDUCATION\n";
        text += "------------------------------------\n";
        resumeData.education.forEach(edu => {
            text += `${edu.degree}\n`;
            text += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n\n`;
        });

        text += "SKILLS\n";
        text += "------------------------------------\n";
        text += `${resumeData.skills}\n`;
        
        return text;
    }, [resumeData]);

    return {
        resumeData,
        setResumeData,
        handleTextChange,
        handleExperienceChange,
        addExperience,
        removeExperience,
        handleEducationChange,
        addEducation,
        removeEducation,
        generateResumeText
    };
};
