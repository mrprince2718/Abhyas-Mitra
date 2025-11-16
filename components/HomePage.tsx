import React, { useMemo } from 'react';
import { UserProfile, Conversation } from '../types';
import { 
    BookOpenIcon, 
    RectangleStackIcon, 
    BeakerIcon, 
    ShareIcon, 
    ClipboardCheckIcon, 
    TrophyIcon, 
    QuestionMarkCircleIcon,
    SparkleIcon,
    AcademicCapIcon,
    LightBulbIcon
} from './icons';

interface HomePageProps {
    currentUser: UserProfile;
    conversations: Conversation[];
    currentSubject: string;
    onLanguageToggle: () => void;
    onSubjectChange: (subject: string) => void;
    onFeatureSelect: (promptPrefix: string) => void;
    onStartQuiz: () => void;
    onStartGoals: () => void;
}

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="bg-base-300/60 p-4 rounded-xl text-left hover:bg-base-300 transition-all duration-200 flex flex-col items-start shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
    >
        <div className="p-2 bg-base-100 rounded-lg mb-3">
            {icon}
        </div>
        <h3 className="font-bold text-content text-md">{title}</h3>
        <p className="text-content-secondary text-sm mt-1">{description}</p>
    </button>
);

const SUBJECTS = ['General', 'Science', 'Mathematics', 'History', 'Geography', 'Literature'];

export const HomePage: React.FC<HomePageProps> = ({ currentUser, conversations, currentSubject, onLanguageToggle, onSubjectChange, onFeatureSelect, onStartQuiz, onStartGoals }) => {
    
    const smartSuggestions = useMemo(() => {
        const suggestions = [];
        const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
        
        for (const convo of conversations) {
            // Use createdAt as the last studied date for simplicity
            if (convo.createdAt < threeDaysAgo) {
                suggestions.push({
                    topic: convo.title,
                    action: () => onFeatureSelect(`Give me a quick quiz on: ${convo.title}`)
                });
            }
            if (suggestions.length >= 2) break; // Limit to 2 suggestions
        }
        return suggestions;
    }, [conversations, onFeatureSelect]);

    const features = [
        { 
            icon: <BookOpenIcon className="w-6 h-6 text-primary"/>, 
            title: "Notes", 
            description: "Generate bullet-point notes",
            action: () => onFeatureSelect("Generate notes on the topic: ")
        },
        { 
            icon: <RectangleStackIcon className="w-6 h-6 text-green-400"/>, 
            title: "Flashcards", 
            description: "Create term-definition cards",
            action: () => onFeatureSelect("Create flashcards for the topic: ") 
        },
        { 
            icon: <BeakerIcon className="w-6 h-6 text-yellow-400"/>, 
            title: "Quiz", 
            description: "Test your knowledge",
            action: onStartQuiz
        },
        { 
            icon: <ShareIcon className="w-6 h-6 text-purple-400"/>, 
            title: "Mind Map", 
            description: "Visualize concepts",
            action: () => onFeatureSelect("Create a mind map for: ")
        },
        { 
            icon: <ClipboardCheckIcon className="w-6 h-6 text-blue-400"/>, 
            title: "Goals", 
            description: "Plan your study session",
            action: onStartGoals
        },
        { 
            icon: <TrophyIcon className="w-6 h-6 text-orange-400"/>, 
            title: "Progress", 
            description: "Track your learning",
            action: () => onFeatureSelect("Summarize my recent study topics and suggest what to revise next.")
        },
        { 
            icon: <QuestionMarkCircleIcon className="w-6 h-6 text-teal-400"/>, 
            title: "Ask Doubt", 
            description: "Get quick answers",
            action: () => onFeatureSelect("")
        },
    ];

    return (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-16 md:pt-6">
            <div className="max-w-4xl mx-auto animate-fade-in-fast">
                <header className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Welcome, {currentUser.username}!
                            </h1>
                             <div className="flex items-center gap-4 text-content-secondary text-sm mt-2">
                                <span>{currentUser.className ? `Class ${currentUser.className}` : ''}</span>
                                <div className="relative flex items-center gap-2">
                                     <AcademicCapIcon className="w-5 h-5" />
                                     <select
                                        value={currentSubject}
                                        onChange={(e) => onSubjectChange(e.target.value)}
                                        className="bg-transparent font-semibold appearance-none focus:outline-none cursor-pointer"
                                     >
                                         {SUBJECTS.map(s => <option key={s} value={s} className="bg-base-200 text-content">{s}</option>)}
                                     </select>
                                </div>
                            </div>
                        </div>
                        <button onClick={onLanguageToggle} className="text-sm font-semibold text-primary hover:underline flex-shrink-0 self-start md:self-auto">
                           {currentUser.language === 'English' ? 'ગુજરાતીમાં બદલો' : 'Switch to English'}
                        </button>
                    </div>
                </header>

                <main>
                    {smartSuggestions.length > 0 && (
                        <div className="mb-8">
                             <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <LightBulbIcon className="w-6 h-6 text-yellow-400" />
                                Smart Suggestions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {smartSuggestions.map(suggestion => (
                                    <button
                                        key={suggestion.topic}
                                        onClick={suggestion.action}
                                        className="bg-yellow-400/10 p-4 rounded-xl text-left hover:bg-yellow-400/20 transition-all duration-200 flex items-center gap-3 shadow-lg"
                                    >
                                        <div className="p-2 bg-yellow-400/20 rounded-lg">
                                            <BeakerIcon className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-yellow-200">Revise "{suggestion.topic}"</p>
                                            <p className="text-sm text-yellow-300/80">You haven't studied this in a few days. Want a quick quiz?</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}


                    <h2 className="text-xl font-bold mb-4">What will you master today?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {features.map((feature) => (
                           <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                onClick={feature.action}
                            />
                        ))}
                         <div className="bg-primary/10 p-4 rounded-xl text-left transition-all duration-200 flex flex-col items-start shadow-lg col-span-2 md:col-span-1 lg:col-span-1">
                            <div className="p-2 bg-primary/20 rounded-lg mb-3">
                                <SparkleIcon className="w-6 h-6 text-primary"/>
                            </div>
                            <h3 className="font-bold text-content text-md">Summarize</h3>
                            <p className="text-content-secondary text-sm mt-1">Summarize long content into short, clear points. Just attach a file and ask!</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};