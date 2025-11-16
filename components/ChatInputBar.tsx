import React, { useState, useRef, useEffect } from 'react';
import { AppMode } from '../types';
import {
    MicIcon,
    SearchIcon,
    SendIcon,
    StopIcon,
    PaperclipIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    XCircleIcon,
    CpuChipIcon,
    KeyboardIcon
} from './icons';

export interface ChatInputBarProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    useSearch: boolean;
    setUseSearch: (useSearch: boolean) => void;
    useThinkingMode: boolean;
    setUseThinkingMode: (use: boolean) => void;
    attachedFile: File | null;
    setAttachedFile: (file: File | null) => void;
    onSend: (prompt: string, file?: File | null) => void;
    isLoading: boolean;
    voiceStatus: 'idle' | 'connecting' | 'connected' | 'error';
    startVoice: () => void;
    stopVoice: () => void;
    liveUserTranscript: string;
    prefilledInput: string;
    setPrefilledInput: (input: string) => void;
}

const AttachedFilePreview: React.FC<{ file: File, onRemove: () => void }> = ({ file, onRemove }) => {
    const fileType = file.type.startsWith('image/') ? 'Image' 
                   : file.type.startsWith('video/') ? 'Video'
                   : 'PDF';
    const Icon = fileType === 'Image' ? PhotoIcon 
               : fileType === 'Video' ? VideoCameraIcon
               : DocumentTextIcon;

    return (
        <div className="p-2 bg-base-200 rounded-lg flex items-center gap-3 animate-fade-in-fast">
            <Icon className="w-5 h-5 flex-shrink-0 text-content-secondary" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-content-secondary">{fileType} - {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={onRemove} className="p-1 text-content-secondary hover:text-content">
                <XCircleIcon className="w-5 h-5"/>
            </button>
        </div>
    );
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ mode, setMode, useSearch, setUseSearch, useThinkingMode, setUseThinkingMode, attachedFile, setAttachedFile, onSend, isLoading, voiceStatus, startVoice, stopVoice, liveUserTranscript, prefilledInput, setPrefilledInput }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (prefilledInput) {
            setInput(prefilledInput);
            textareaRef.current?.focus();
            setPrefilledInput(''); // Consume the prefilled input
        }
    }, [prefilledInput, setPrefilledInput]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() || attachedFile) {
            onSend(input.trim(), attachedFile);
            setInput('');
            setAttachedFile(null);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setAttachedFile(file);
    };

    const placeholder = attachedFile ? `Ask a question about ${attachedFile.name}...` : 'Ask a question or attach a file...';
    
    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-4">
            <div className="bg-base-300/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transition-all duration-300">
                {attachedFile && <div className="p-2"><AttachedFilePreview file={attachedFile} onRemove={() => setAttachedFile(null)} /></div>}
                <div className="p-2">
                    {mode === AppMode.TEXT ? (
                        <div className="flex items-end gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-content-secondary hover:text-content self-end">
                                <PaperclipIcon className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf" />
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder={placeholder}
                                className="flex-1 w-full bg-transparent text-content placeholder-content-secondary focus:outline-none resize-none max-h-48"
                                disabled={isLoading}
                            />
                            <button onClick={() => setMode(AppMode.VOICE)} className="p-2.5 text-content-secondary hover:text-content self-end">
                                <MicIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !attachedFile)}
                                className="bg-primary text-white rounded-xl p-2.5 hover:bg-blue-500 disabled:bg-base-300 disabled:text-content-secondary disabled:cursor-not-allowed transition-all self-end"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                         <div className="min-h-[44px] flex items-center justify-between gap-4">
                             <p className="text-content-secondary flex-1 text-left pl-3">{liveUserTranscript || "Listening..."}</p>
                             <div className="flex items-center gap-2 pr-2">
                                <button onClick={() => setMode(AppMode.TEXT)} className="p-2.5 text-content-secondary hover:text-content self-center">
                                    <KeyboardIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={voiceStatus === 'connected' ? stopVoice : startVoice}
                                    disabled={voiceStatus === 'connecting'}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${voiceStatus === 'connected' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}
                                >
                                {voiceStatus === 'connected' ? <StopIcon className="w-5 h-5" /> : <div className="w-5 h-5 animate-pulse-slow"><MicIcon className="w-5 h-5" /></div>}
                                </button>
                            </div>
                         </div>
                    )}
                </div>
                 <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 py-1.5 border-t border-white/10">
                    <button onClick={() => setUseSearch(!useSearch)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-base-100/50 transition-colors">
                       <SearchIcon className={`w-4 h-4 transition-colors ${useSearch ? 'text-primary' : 'text-content-secondary'}`} />
                       <span className="text-xs font-medium text-content-secondary">Search</span>
                       <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${useSearch ? 'bg-primary' : 'bg-base-100'}`}>
                           <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${useSearch ? 'translate-x-5' : 'translate-x-1'}`} />
                       </div>
                    </button>
                    <button onClick={() => setUseThinkingMode(!useThinkingMode)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-base-100/50 transition-colors">
                       <CpuChipIcon className={`w-4 h-4 transition-colors ${useThinkingMode ? 'text-primary' : 'text-content-secondary'}`} />
                       <span className="text-xs font-medium text-content-secondary">Pro</span>
                       <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${useThinkingMode ? 'bg-primary' : 'bg-base-100'}`}>
                           <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${useThinkingMode ? 'translate-x-5' : 'translate-x-1'}`} />
                       </div>
                    </button>
                </div>
            </div>
        </div>
    );
};