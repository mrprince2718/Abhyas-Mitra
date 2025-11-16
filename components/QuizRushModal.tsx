import React, { useState, useEffect } from 'react';
import { QuizState, QuizDifficulty } from '../types';
import { XCircleIcon, BoltIcon, SparkleIcon } from './icons';

interface QuizRushModalProps {
    quizState: QuizState;
    isLoading: boolean;
    onGenerateQuiz: (topic: string, difficulty: QuizDifficulty, numQuestions: number) => void;
    onAnswer: (answer: string) => void;
    onClose: () => void;
}

const QuizConfiguration: React.FC<{
    onGenerateQuiz: (topic: string, difficulty: QuizDifficulty, numQuestions: number) => void;
    isLoading: boolean;
}> = ({ onGenerateQuiz, isLoading }) => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
    const [numQuestions, setNumQuestions] = useState(5);

    const handleStart = () => {
        if (topic.trim()) {
            onGenerateQuiz(topic, difficulty, numQuestions);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium text-content-secondary block mb-2">Topic</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Solar System"
                    className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-content-secondary block mb-2">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
                        className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-content-secondary block mb-2">Questions</label>
                    <select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-base-300 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                    </select>
                </div>
            </div>
            <button 
                onClick={handleStart} 
                disabled={!topic.trim() || isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? 'Generating...' : 'Start Quiz'}
            </button>
        </div>
    );
};

const ActiveQuiz: React.FC<{
    quizState: QuizState;
    onAnswer: (answer: string) => void;
}> = ({ quizState, onAnswer }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(Math.floor((Date.now() - quizState.startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [quizState.startTime]);

    if (quizState.questions.length === 0) {
        return (
            <div className="text-center py-10">
                <SparkleIcon className="w-12 h-12 text-primary mx-auto animate-pulse" />
                <p className="mt-4 text-lg font-medium">Generating your quiz...</p>
                <p className="text-content-secondary">This might take a moment.</p>
            </div>
        );
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-content-secondary">
                    Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                </div>
                <div className="text-sm font-bold text-content">{formattedTime}</div>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2 mb-6">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
            <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswer(option)}
                        className="w-full text-left p-4 bg-base-300 rounded-lg hover:bg-primary/50 transition-colors"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

const QuizResults: React.FC<{ quizState: QuizState, onRestart: () => void }> = ({ quizState, onRestart }) => {
    const timeTaken = Math.floor((quizState.endTime - quizState.startTime) / 1000);
    const formattedTime = `${Math.floor(timeTaken / 60).toString().padStart(2, '0')}:${(timeTaken % 60).toString().padStart(2, '0')}`;

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">Quiz Complete!</h2>
                <p className="text-lg text-content-secondary mt-2">Here's how you did:</p>
                <div className="flex justify-center gap-8 mt-4">
                    <div>
                        <p className="text-4xl font-bold text-primary">{quizState.score}/{quizState.questions.length}</p>
                        <p className="text-sm text-content-secondary">Score</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-primary">{formattedTime}</p>
                        <p className="text-sm text-content-secondary">Time</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {quizState.questions.map((q, index) => {
                    const userAnswer = quizState.userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                        <div key={index} className="p-3 bg-base-300/50 rounded-lg">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <p className={`text-sm mt-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                Your answer: {userAnswer} {isCorrect ? '✓' : '✗'}
                            </p>
                            {!isCorrect && <p className="text-sm text-content-secondary">Correct answer: {q.correctAnswer}</p>}
                            <p className="text-xs mt-2 pt-2 border-t border-white/10 text-content-secondary">{q.explanation}</p>
                        </div>
                    );
                })}
            </div>
            <button onClick={onRestart} className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold">
                Take Another Quiz
            </button>
        </div>
    );
};

export const QuizRushModal: React.FC<QuizRushModalProps> = ({ quizState, isLoading, onGenerateQuiz, onAnswer, onClose }) => {
    
    const modalTitle = quizState.status === 'configuring' ? 'Quiz Rush Setup' 
                     : quizState.status === 'active' ? `Quiz: ${quizState.topic}`
                     : 'Quiz Results';

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-base-200 rounded-2xl w-full max-w-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <BoltIcon className="w-6 h-6 text-primary" />
                        <h2 className="text-lg font-bold">{modalTitle}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-content-secondary hover:text-content">
                        <XCircleIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {quizState.status === 'configuring' && <QuizConfiguration onGenerateQuiz={onGenerateQuiz} isLoading={isLoading} />}
                    {quizState.status === 'active' && <ActiveQuiz quizState={quizState} onAnswer={onAnswer} />}
                    {quizState.status === 'finished' && <QuizResults quizState={quizState} onRestart={onClose} />}
                </div>
            </div>
        </div>
    );
};