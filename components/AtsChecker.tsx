import React, { useState } from 'react';
import Card from './common/Card';
import TextAreaField from './common/TextAreaField';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { analyzeResume } from '../services/geminiService';
import { ATSAnalysis } from '../types';

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;
    let strokeColor = 'stroke-green-500';
    if (score < 75) strokeColor = 'stroke-yellow-500';
    if (score < 50) strokeColor = 'stroke-red-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${strokeColor}`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-800 dark:text-gray-100">
                {score}
            </span>
        </div>
    );
};


const AtsChecker: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!resumeText || !jobDescription) {
            setError('Please paste both your resume and the job description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeResume(resumeText, jobDescription);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Paste Your Resume">
                    <TextAreaField label="" name="resume" value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={15} placeholder="Paste the full text of your resume here..." />
                </Card>
                <Card title="Paste Job Description">
                    <TextAreaField label="" name="jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={15} placeholder="Paste the full job description here..." />
                </Card>
            </div>
            <div className="text-center">
                <Button onClick={handleCheck} isLoading={isLoading} disabled={!resumeText || !jobDescription}>
                    {isLoading ? 'Analyzing...' : 'Check ATS Compatibility'}
                </Button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {isLoading && (
                 <div className="flex justify-center items-center flex-col text-center p-8">
                    <Spinner size="h-12 w-12" />
                    <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">AI is analyzing your documents...</p>
                    <p className="text-sm text-gray-500">This may take a moment.</p>
                </div>
            )}
            
            {analysis && (
                <Card title="Analysis Result">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="flex flex-col items-center justify-center text-center col-span-1">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Compatibility Score</h4>
                            <ScoreCircle score={analysis.score} />
                             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{analysis.summary}</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Matching Keywords</h4>
                                {analysis.matchingKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.matchingKeywords.map((kw, i) => <span key={i} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{kw}</span>)}
                                    </div>
                                ) : <p className="text-sm text-gray-500">No strong keyword matches found.</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Missing Keywords</h4>
                                {analysis.missingKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.missingKeywords.map((kw, i) => <span key={i} className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{kw}</span>)}
                                    </div>
                                ) : <p className="text-sm text-gray-500">Great job! No major keywords seem to be missing.</p>}
                            </div>
                            <div>
                                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">💡 Suggestions for Improvement</h4>
                                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line prose dark:prose-invert prose-sm max-w-none">
                                    {analysis.suggestions}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AtsChecker;
