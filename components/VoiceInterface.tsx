import React, { useRef, useEffect } from 'react';
import { SparkleIcon } from './icons';

interface Transcript {
    user: string;
    assistant: string;
}

interface VoiceInterfaceProps {
    transcriptHistory: Transcript[];
    currentUserTranscript: string;
    currentAssistantTranscript: string;
    status: 'idle' | 'connecting' | 'connected' | 'error';
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
    transcriptHistory,
    currentUserTranscript,
    currentAssistantTranscript,
    status,
}) => {
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcriptHistory, currentUserTranscript, currentAssistantTranscript]);

    const hasContent = transcriptHistory.length > 0 || currentUserTranscript || currentAssistantTranscript;

    return (
        <div className="flex-1 overflow-y-auto px-6 pt-16 md:pt-6">
            <div className="max-w-3xl mx-auto">
                {!hasContent ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <SparkleIcon className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Voice Conversation</h1>
                        <p className="text-content-secondary mt-2 mb-8 max-w-sm">Press the microphone button in the input bar below to start speaking with ABHYAS MITRA.</p>
                        {status === 'connecting' && <p className="text-yellow-400">Connecting to voice service...</p>}
                        {status === 'error' && <p className="text-red-500">Connection failed. Please check permissions and try again.</p>}
                    </div>
                ) : (
                    <div className="py-4 text-content">
                        {transcriptHistory.map((turn, index) => (
                            <div key={index} className="mb-6 space-y-2">
                                <p><strong className="text-content-secondary font-semibold">You:</strong> {turn.user}</p>
                                <p><strong className="text-primary font-semibold">Guru:</strong> {turn.assistant}</p>
                            </div>
                        ))}
                        {currentUserTranscript && <p><strong className="text-content-secondary font-semibold">You:</strong> <span className="text-gray-300">{currentUserTranscript}</span></p>}
                        {currentAssistantTranscript && <p className="mt-2"><strong className="text-primary font-semibold">Guru:</strong> <span className="text-gray-300">{currentAssistantTranscript}</span></p>}
                    </div>
                )}
                <div ref={transcriptEndRef} />
            </div>
        </div>
    );
};