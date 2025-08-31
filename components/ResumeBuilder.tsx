import React, { useState } from 'react';
import { useResumeBuilder } from '../hooks/useResumeBuilder';
import { generateContent } from '../services/geminiService';
import Card from './common/Card';
import InputField from './common/InputField';
import TextAreaField from './common/TextAreaField';
import Button from './common/Button';
import Icon from './common/Icon';

const ResumeBuilder: React.FC = () => {
    const {
        resumeData,
        handleTextChange,
        handleExperienceChange,
        addExperience,
        removeExperience,
        handleEducationChange,
        addEducation,
        removeEducation,
        generateResumeText,
        setResumeData
    } = useResumeBuilder();

    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        try {
            const prompt = `Based on the following resume details, write a professional summary of 2-3 sentences. Job Titles: ${resumeData.experience.map(e => e.jobTitle).join(', ')}. Skills: ${resumeData.skills}.`;
            const summary = await generateContent(prompt);
            setResumeData(prev => ({...prev, summary}));
        } catch (error) {
            console.error("Failed to generate summary:", error);
            alert("Failed to generate AI summary. Please try again.");
        }
        setIsGenerating(false);
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generateResumeText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
                <Card title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="fullName" value={resumeData.fullName} onChange={handleTextChange} placeholder="John Doe" />
                        <InputField label="Email" name="email" type="email" value={resumeData.email} onChange={handleTextChange} placeholder="john.doe@example.com" />
                        <InputField label="Phone Number" name="phoneNumber" value={resumeData.phoneNumber} onChange={handleTextChange} placeholder="(123) 456-7890" />
                        <InputField label="LinkedIn Profile" name="linkedin" value={resumeData.linkedin} onChange={handleTextChange} placeholder="linkedin.com/in/johndoe" />
                    </div>
                </Card>

                <Card title="Professional Summary">
                    <TextAreaField label="Summary" name="summary" value={resumeData.summary} onChange={handleTextChange} rows={4} placeholder="A brief summary of your career and skills..." />
                    <div className="mt-2 text-right">
                        <Button onClick={handleGenerateSummary} isLoading={isGenerating} variant="secondary">
                            {isGenerating ? "Generating..." : "✨ Generate with AI"}
                        </Button>
                    </div>
                </Card>

                <Card title="Work Experience">
                    <div className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border dark:border-gray-700 rounded-md space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={e => handleExperienceChange(index, e)} />
                                    <InputField label="Company" name="company" value={exp.company} onChange={e => handleExperienceChange(index, e)} />
                                    <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(index, e)} type="month" />
                                    <InputField label="End Date" name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(index, e)} type="month" />
                                </div>
                                <TextAreaField label="Responsibilities" name="responsibilities" value={exp.responsibilities} onChange={e => handleExperienceChange(index, e)} rows={4} placeholder="- Achieved X...\n- Led Y..."/>
                                <div className="text-right">
                                    <Button onClick={() => removeExperience(index)} variant="danger" className="p-2"><Icon name="trash" className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Button onClick={addExperience} variant="secondary" className="w-full">
                            <Icon name="plus" className="w-4 h-4 mr-2" /> Add Experience
                        </Button>
                    </div>
                </Card>

                <Card title="Education">
                    <div className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                             <div key={edu.id} className="p-4 border dark:border-gray-700 rounded-md space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Degree / Certificate" name="degree" value={edu.degree} onChange={e => handleEducationChange(index, e)} />
                                    <InputField label="Institution" name="institution" value={edu.institution} onChange={e => handleEducationChange(index, e)} />
                                    <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleEducationChange(index, e)} type="month"/>
                                    <InputField label="End Date" name="endDate" value={edu.endDate} onChange={e => handleEducationChange(index, e)} type="month"/>
                                </div>
                                <div className="text-right">
                                    <Button onClick={() => removeEducation(index)} variant="danger" className="p-2"><Icon name="trash" className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="mt-4">
                        <Button onClick={addEducation} variant="secondary" className="w-full">
                            <Icon name="plus" className="w-4 h-4 mr-2" /> Add Education
                        </Button>
                    </div>
                </Card>
                
                <Card title="Skills">
                    <TextAreaField label="Skills" name="skills" value={resumeData.skills} onChange={handleTextChange} rows={3} placeholder="JavaScript, React, Node.js, Project Management..." />
                </Card>
            </div>

            {/* Preview Section */}
            <div>
                 <Card title="ATS-Friendly Resume Preview" actions={
                    <Button onClick={handleCopy} variant="secondary" className="py-1 px-3">
                         <Icon name="copy" className="w-4 h-4 mr-2" />
                         {copied ? "Copied!" : "Copy"}
                    </Button>
                 }>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-md h-[80vh] overflow-auto">
                        {generateResumeText()}
                    </pre>
                 </Card>
            </div>
        </div>
    );
};

export default ResumeBuilder;
