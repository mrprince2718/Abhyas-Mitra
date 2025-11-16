import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Part, Type } from '@google/genai';
import { AppMode, Message, Role, Conversation, UserProfile, Language, QuizState, QuizDifficulty, TodoListState, StudyStreak } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VoiceInterface } from './components/VoiceInterface';
import { ChatHistorySidebar } from './components/ChatHistorySidebar';
import { MenuIcon, HomeIcon } from './components/icons';
import { AuthPage } from './components/AuthPage';
import { ChatInputBar } from './components/ChatInputBar';
import { QuizRushModal } from './components/QuizRushModal';
import { TodoListModal } from './components/TodoListModal';
import { HomePage } from './components/HomePage';
import { encode, decode, decodeAudioData, fileToBase64, extractTextFromPdf } from './utils';

const BASE_SYSTEM_PROMPT = `You are a bilingual AI study assistant for teenage students (ages 12–20), fluent in Gujarati and English. You support all major NotebookLM-style features and respond based on the selected feature icon and the student’s class level.

🎯 Your core features include:

📚 Notes → Generate bullet-point notes on any topic  
🧠 Flashcards → Create term-definition flashcards  
🧪 Quiz → Generate multiple-choice questions with answers and explanations  
🧩 Mind Map → Create a simple text-based mind map in tree format  
📝 Summarize → Summarize long content into short, clear points  
🖼️ Image Explain → Describe and explain diagrams or images  
📊 Study Tracker → Track what the student has studied and suggest next topics  
🎯 Daily Goals → Help students set and manage today’s study goals  
🎓 Class-Aware → Adjust explanations based on selected class (e.g., 9th vs 11th science)  
🌐 Language Switch → Detect and reply in Gujarati or English based on input

🧭 UI Behavior:
- Each feature is triggered by a specific icon or button.
- When a student selects a feature (e.g., 🧠 Flashcards), respond only with that module.
- Always greet the student by name and show their class and today’s goal if available.
- Keep tone friendly, motivating, and student-appropriate.

📌 Rules:
- If the user types in Gujarati, respond in Gujarati. If in English, respond in English.
- Use bullet points for notes, flashcards, and summaries.
- For quizzes, give 4 options and mark the correct one.
- For mind maps, use indentation or arrows to show structure.
- For image explanation, describe key parts and explain the concept.
- For study tracking, store recent topics and suggest what to revise next.
- For daily goals, allow students to set, update, and check off tasks.

Start by asking the student to choose a feature by clicking an icon or typing its name. Then respond accordingly.`;

export default function App() {
    // --- Auth State ---
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    // --- Core State ---
    const [mode, setMode] = useState<AppMode>(AppMode.TEXT);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [useThinkingMode, setUseThinkingMode] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showHomepage, setShowHomepage] = useState(true);
    const [prefilledInput, setPrefilledInput] = useState('');
    const [currentSubject, setCurrentSubject] = useState('General');


    // --- Voice State ---
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [transcripts, setTranscripts] = useState<{ user: string; assistant: string; history: { user: string; assistant: string }[] }>({ user: '', assistant: '', history: [] });
    
    // --- Feature States ---
    const [quizState, setQuizState] = useState<QuizState | null>(null);
    const [todoListState, setTodoListState] = useState<TodoListState | null>(null);
    const [studyStreak, setStudyStreak] = useState(0);

    // --- Refs ---
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const ttsAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId), [conversations, activeConversationId]);
    const messages = useMemo(() => activeConversation?.messages ?? [], [activeConversation]);

    // --- Responsive Sidebar Logic ---
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Auth Logic ---
    useEffect(() => {
        const userProfileJSON = localStorage.getItem('study_guru_currentUserProfile');
        if (userProfileJSON) {
            try {
                const userProfile: UserProfile = JSON.parse(userProfileJSON);
                setCurrentUser(userProfile);
                setCurrentSubject(userProfile.subject || 'General');
            } catch (e) {
                console.error("Failed to parse user profile", e);
                localStorage.removeItem('study_guru_currentUserProfile');
            }
        }
    }, []);

    const handleSignUp = (username: string, pass: string, className: string, language: Language, subject: string): boolean => {
        const users = JSON.parse(localStorage.getItem('study_guru_users') || '{}');
        if (users[username]) {
            return false; // User already exists
        }
        users[username] = { password: pass, className, language, subject };
        localStorage.setItem('study_guru_users', JSON.stringify(users));

        const userProfile: UserProfile = { username, className, language, subject };
        localStorage.setItem('study_guru_currentUserProfile', JSON.stringify(userProfile));
        setCurrentUser(userProfile);
        setCurrentSubject(subject);
        return true;
    };
    
    const handleLogin = (username: string, pass: string): boolean => {
        const users = JSON.parse(localStorage.getItem('study_guru_users') || '{}');
        const userData = users[username];
        if (userData && userData.password === pass) {
            const userProfile: UserProfile = { username, className: userData.className, language: userData.language, subject: userData.subject || 'General' };
            localStorage.setItem('study_guru_currentUserProfile', JSON.stringify(userProfile));
            setCurrentUser(userProfile);
            setCurrentSubject(userProfile.subject);
            return true;
        }
        return false;
    };

    const handleGuestLogin = () => {
        const guestProfile: UserProfile = { username: 'Guest', className: '', language: 'English', subject: 'General' };
        setCurrentUser(guestProfile);
        setCurrentSubject('General');
    };

    const handleLogout = () => {
        stopVoiceConversation();
        localStorage.removeItem('study_guru_currentUserProfile');
        setCurrentUser(null);
        setStudyStreak(0);
        setShowHomepage(true);
    };

     // --- New User Welcome Logic ---
     const initializeSession = (user: UserProfile) => {
        try {
            // Load Chat History
            const savedConvosJSON = user.username === 'Guest' ? '[]' : localStorage.getItem(`chatHistory_${user.username}`) || '[]';
            const savedConvos = JSON.parse(savedConvosJSON);
            setConversations(Array.isArray(savedConvos) ? savedConvos : []);

            if (savedConvos.length > 0) {
                 setActiveConversationId(savedConvos[0]?.id ?? null);
                 setShowHomepage(true); // Always show homepage first
            } else {
                setShowHomepage(true);
            }
            
            // Load and Validate Study Streak
            if (user.username !== 'Guest') {
                const streakDataJSON = localStorage.getItem(`streakData_${user.username}`);
                if (streakDataJSON) {
                    const streakData: StudyStreak = JSON.parse(streakDataJSON);
                    const today = new Date();
                    const lastCompleted = new Date(streakData.lastCompletedDate);
                    const diffTime = today.getTime() - lastCompleted.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays > 1) { // Streak broken
                        setStudyStreak(0);
                        localStorage.removeItem(`streakData_${user.username}`);
                    } else {
                        setStudyStreak(streakData.streak);
                    }
                }
            }

        } catch (error) { 
            console.error("Failed to load or initialize session:", error); 
            setConversations([]);
            setActiveConversationId(null);
            setShowHomepage(true);
        }
    };

    // --- Data Persistence ---
    useEffect(() => {
        if (!currentUser) return;
        initializeSession(currentUser);
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || currentUser.username === 'Guest') return;
        try {
            if (conversations.length > 0) {
                localStorage.setItem(`chatHistory_${currentUser.username}`, JSON.stringify(conversations));
            } else {
                localStorage.removeItem(`chatHistory_${currentUser.username}`);
            }
        } catch (error) { console.error("Failed to save chat history:", error); }
    }, [conversations, currentUser]);


    // --- Chat Logic ---
    const updateConversationMessages = (convoId: string, updater: (prevMessages: Message[]) => Message[]) => {
        setConversations(prev => prev.map(c => c.id === convoId ? { ...c, messages: updater(c.messages) } : c));
    };

    const generateTitleForConversation = async (conversationId: string, prompt: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Summarize this prompt into a short, 2-4 word title for a chat history list. Be concise. The language of the title should match the language of the prompt. Prompt: "${prompt}"`,
            });
            const title = response.text.trim().replace(/"/g, '');
            setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, title } : c));
        } catch (error) { console.error("Failed to generate title:", error); }
    };
    
    const handleSend = async (prompt: string, file: File | null = attachedFile) => {
        let currentConvoId = activeConversationId;
        let isNewChat = false;

        let effectivePrompt = prompt;
        if (!prompt && file) {
            if (file.type === 'application/pdf') {
                effectivePrompt = `Summarize this document: ${file.name}`;
            } else if (file.type.startsWith('image/')) {
                effectivePrompt = `Describe this image: ${file.name}`;
            } else if (file.type.startsWith('video/')) {
                effectivePrompt = `Summarize this video: ${file.name}`;
            } else {
                effectivePrompt = `Describe this file: ${file.name}`;
            }
        }
        
        if (showHomepage) setShowHomepage(false);

        if (!currentConvoId) {
            isNewChat = true;
            const newConversation: Conversation = { id: Date.now().toString(), title: "New Chat", messages: [], createdAt: Date.now() };
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(newConversation.id);
            currentConvoId = newConversation.id;
        }

        const userMessage: Message = {
            role: Role.USER,
            content: effectivePrompt,
            ...(file && { attachment: { data: URL.createObjectURL(file), type: file.type, name: file.name } })
        };
        setIsLoading(true);
        updateConversationMessages(currentConvoId, prev => [...prev, userMessage]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let modelName = useThinkingMode || file?.type.startsWith('video/') ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

            const history = (conversations.find(c => c.id === currentConvoId)?.messages ?? [])
                .filter(m => m.role !== Role.SYSTEM && m !== userMessage)
                .map(m => ({ role: m.role === Role.ASSISTANT ? 'model' : m.role, parts: [{ text: m.content }] }));
            
            const userParts: Part[] = [{ text: effectivePrompt }];

            if (file) {
                if (file.type === 'application/pdf') {
                    const pdfText = await extractTextFromPdf(file);
                    userParts[0].text = `Please analyze the content of the following document and respond to the request.\n\nDOCUMENT CONTENT:\n"""${pdfText}"""\n\nREQUEST:\n"${effectivePrompt}"`;
                } else {
                    const base64Data = await fileToBase64(file);
                    userParts.unshift({ inlineData: { data: base64Data, mimeType: file.type } });
                }
            }

            let systemInstruction = BASE_SYSTEM_PROMPT;
            if (currentUser) {
                if (currentUser.username === 'Guest') {
                    systemInstruction += `\n\nThe student is a guest. You should first ask for their class level to provide tailored assistance. Their preferred language is ${currentUser.language}. They are currently studying the subject of ${currentSubject}.`;
                } else {
                    systemInstruction += `\n\nThe student's name is ${currentUser.username}. They are in class ${currentUser.className}. Their preferred language is ${currentUser.language}. They are currently studying the subject of ${currentSubject}. You must tailor your responses to their class level and subject, and communicate in their preferred language unless they type in a different one.`;
                }
            }
            
            const stream = await ai.models.generateContentStream({
                model: modelName,
                contents: [...history, { role: 'user', parts: userParts }],
                config: {
                    systemInstruction,
                    tools: useSearch ? [{ googleSearch: {} }] : [],
                    ...(useThinkingMode && { thinkingConfig: { thinkingBudget: 32768 } }),
                },
            });

            let fullResponse = '';
            let sources: any[] = [];
            updateConversationMessages(currentConvoId, prev => [...prev, { role: Role.ASSISTANT, content: '' }]);

            for await (const chunk of stream) {
                fullResponse += chunk.text;
                if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                    sources = chunk.candidates[0].groundingMetadata.groundingChunks.map(c => c.web);
                }
                updateConversationMessages(currentConvoId, prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: Role.ASSISTANT,
                        content: fullResponse || "▍",
                        sources: sources.length > 0 ? sources : undefined,
                    };
                    return newMessages;
                });
            }

            if (isNewChat) generateTitleForConversation(currentConvoId, effectivePrompt || file?.name || "New Chat");

        } catch (error) {
            console.error("Gemini API error:", error);
            updateConversationMessages(currentConvoId, prev => [...prev, { role: Role.ASSISTANT, content: "Sorry, an error occurred." }]);
        } finally {
            setIsLoading(false);
            setAttachedFile(null);
        }
    };
    
    // --- Voice & TTS Logic ---
    const handlePlayAudio = async (text: string) => {
        if (!ttsAudioContextRef.current) {
            ttsAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioCtx = ttsAudioContextRef.current;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start();
            }
        } catch (error) {
            console.error("TTS generation failed:", error);
            throw error;
        }
    };

    const stopVoiceConversation = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
        sessionPromiseRef.current = null;
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        inputAudioContextRef.current?.state !== 'closed' && inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.state !== 'closed' && outputAudioContextRef.current?.close().catch(console.error);
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setVoiceStatus('idle');
    }, []);

    const startVoiceConversation = async () => {
        setVoiceStatus('connecting');
        setTranscripts({ user: '', assistant: '', history: [] });
        
        let currentUserTranscript = '';
        let currentAssistantTranscript = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: "You are a friendly and helpful bilingual study assistant named 'ABHYAS MITRA'. Converse with the student in either English or Gujarati, based on the language they speak to you in. Keep your responses conversational, clear, and encouraging. Help them with their study questions.",
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setVoiceStatus('connected');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.map(v => v * 32768));
                            sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentUserTranscript += message.serverContent.inputTranscription.text;
                            setTranscripts(prev => ({ ...prev, user: currentUserTranscript }));
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentAssistantTranscript += message.serverContent.outputTranscription.text;
                            setTranscripts(prev => ({ ...prev, assistant: currentAssistantTranscript }));
                        }
                        if (message.serverContent?.turnComplete) {
                            const finalUser = currentUserTranscript.trim();
                            if (finalUser) handleSend(finalUser);
                            setTranscripts(prev => ({ user: '', assistant: '', history: [...prev.history, { user: finalUser, assistant: currentAssistantTranscript }] }));
                            currentUserTranscript = '';
                            currentAssistantTranscript = '';
                        }
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            const outputCtx = outputAudioContextRef.current;
                            if (!outputCtx) return;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onclose: () => stopVoiceConversation(),
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setVoiceStatus('error');
                        stopVoiceConversation();
                    },
                },
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setVoiceStatus('error');
        }
    };
    
    // --- Feature Logic ---
    const handleStartQuizRush = () => {
        setQuizState({
            status: 'configuring', topic: '', difficulty: 'Medium', questions: [],
            currentQuestionIndex: 0, userAnswers: [], score: 0, startTime: 0, endTime: 0,
        });
    };

    const handleGenerateQuiz = async (topic: string, difficulty: QuizDifficulty, numQuestions: number) => {
        setIsLoading(true);
        setQuizState(prev => prev ? { ...prev, status: 'active', topic, difficulty, startTime: Date.now() } : null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a quiz with ${numQuestions} questions on the topic "${topic}" with ${difficulty} difficulty for a student in class ${currentUser?.className || '10'} studying ${currentSubject}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            quiz: {
                                type: Type.ARRAY,
                                description: 'A list of quiz questions.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING, description: 'The question text.' },
                                        options: { type: Type.ARRAY, description: 'An array of 4 possible answers.', items: { type: Type.STRING } },
                                        correctAnswer: { type: Type.STRING, description: 'The correct answer from the options.' },
                                        explanation: { type: Type.STRING, description: 'A brief explanation for the correct answer.' }
                                    },
                                    required: ["question", "options", "correctAnswer", "explanation"]
                                }
                            }
                        },
                        required: ["quiz"]
                    }
                }
            });
    
            const quizData = JSON.parse(response.text);
            if (quizData.quiz && Array.isArray(quizData.quiz)) {
                setQuizState(prev => prev ? { ...prev, questions: quizData.quiz } : null);
            } else {
                throw new Error("Invalid quiz data format from API");
            }
    
        } catch (error) {
            console.error("Failed to generate quiz:", error);
            setQuizState(null); // Close modal on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuizAnswer = (answer: string) => {
        setQuizState(prev => {
            if (!prev || prev.status !== 'active') return prev;
    
            const currentQuestion = prev.questions[prev.currentQuestionIndex];
            const isCorrect = currentQuestion.correctAnswer === answer;
            const newScore = isCorrect ? prev.score + 1 : prev.score;
            const newAnswers = [...prev.userAnswers, answer];
    
            if (prev.currentQuestionIndex < prev.questions.length - 1) {
                return {
                    ...prev, score: newScore, userAnswers: newAnswers,
                    currentQuestionIndex: prev.currentQuestionIndex + 1,
                };
            } else {
                return {
                    ...prev, score: newScore, userAnswers: newAnswers,
                    status: 'finished', endTime: Date.now(),
                };
            }
        });
    };
    
    const handleCloseQuiz = () => setQuizState(null);

    const handleStartTodoList = () => {
        setTodoListState({
            status: 'input', rawInput: '', items: [], suggestion: '',
        });
    };

    const updateStudyStreak = () => {
        if (!currentUser || currentUser.username === 'Guest') return;
        
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const streakDataJSON = localStorage.getItem(`streakData_${currentUser.username}`);
        let currentStreak: StudyStreak = { streak: 0, lastCompletedDate: '' };
        if (streakDataJSON) currentStreak = JSON.parse(streakDataJSON);

        if (currentStreak.lastCompletedDate === todayStr) return; // Already completed today

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreakCount = currentStreak.lastCompletedDate === yesterdayStr ? currentStreak.streak + 1 : 1;
        
        const newStreakData: StudyStreak = { streak: newStreakCount, lastCompletedDate: todayStr };
        localStorage.setItem(`streakData_${currentUser.username}`, JSON.stringify(newStreakData));
        setStudyStreak(newStreakCount);
    };

    const handleGenerateTodoList = async (rawInput: string) => {
        setIsLoading(true);
        setTodoListState(prev => prev ? { ...prev, status: 'loading', rawInput } : null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `A student needs to plan their day. Their raw input is: "${rawInput}". Convert this into a concise JSON object with two keys: "tasks" (an array of short task strings) and "suggestion" (a single, motivating sentence to help them start). Respond in ${currentUser?.language || 'English'}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                            suggestion: { type: Type.STRING }
                        },
                        required: ["tasks", "suggestion"]
                    }
                }
            });
            const data = JSON.parse(response.text);
            if (data.tasks && data.suggestion) {
                setTodoListState(prev => prev ? {
                    ...prev,
                    status: 'active',
                    items: data.tasks.map((task: string) => ({ task, isDone: false })),
                    suggestion: data.suggestion,
                } : null);
            } else { throw new Error("Invalid to-do data from API"); }
        } catch (error) {
            console.error("Failed to generate to-do list:", error);
            setTodoListState(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleTodoItem = (itemIndex: number) => {
        setTodoListState(prev => {
            if (!prev) return null;
            const newItems = [...prev.items];
            newItems[itemIndex].isDone = !newItems[itemIndex].isDone;

            const allDone = newItems.every(item => item.isDone);
            if (allDone) {
                updateStudyStreak();
            }

            return { ...prev, items: newItems };
        });
    };

    const handleCloseTodoList = () => setTodoListState(null);

    // --- UI Handlers ---
    const handleNewConversation = () => {
        setActiveConversationId(null);
        setTranscripts({ user: '', assistant: '', history: [] });
        if (mode === AppMode.VOICE) stopVoiceConversation();
        setMode(AppMode.TEXT);
        setShowHomepage(false);
    };

    const handleDeleteConversation = (id: string) => {
        const newConvos = conversations.filter(c => c.id !== id);
        setConversations(newConvos);
        if (activeConversationId === id) {
            const newActiveId = newConvos[0]?.id ?? null;
            setActiveConversationId(newActiveId);
            if (!newActiveId) {
                setShowHomepage(true);
            }
        }
    };

    const handleSelectConversation = (id: string) => {
        if (mode === AppMode.VOICE) stopVoiceConversation();
        if (window.innerWidth < 768) setSidebarOpen(false);
        setMode(AppMode.TEXT);
        setActiveConversationId(id);
        setShowHomepage(false);
    }
    
    const handleLanguageToggle = () => {
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        const newLang = prevUser.language === 'English' ? 'Gujarati' : 'English';
        const updatedProfile = { ...prevUser, language: newLang };
        
        if (prevUser.username !== 'Guest') {
          const users = JSON.parse(localStorage.getItem('study_guru_users') || '{}');
          if(users[prevUser.username]) {
              users[prevUser.username].language = newLang;
              localStorage.setItem('study_guru_users', JSON.stringify(users));
          }
          localStorage.setItem('study_guru_currentUserProfile', JSON.stringify(updatedProfile));
        }
        return updatedProfile;
      });
    };
    
    const handleSubjectChange = (newSubject: string) => {
        setCurrentSubject(newSubject);
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updatedProfile = { ...prevUser, subject: newSubject };
            if (prevUser.username !== 'Guest') {
                const users = JSON.parse(localStorage.getItem('study_guru_users') || '{}');
                if (users[prevUser.username]) {
                    users[prevUser.username].subject = newSubject;
                    localStorage.setItem('study_guru_users', JSON.stringify(users));
                }
                localStorage.setItem('study_guru_currentUserProfile', JSON.stringify(updatedProfile));
            }
            return updatedProfile;
        });
    };
    
    const handleGoHome = () => {
        setActiveConversationId(null);
        setShowHomepage(true);
    };

    const handleFeatureSelect = (promptPrefix: string) => {
        let convoId = activeConversationId;
        // Create a new chat if there isn't one, or if the current one has messages already
        if (!convoId || (activeConversation?.messages && activeConversation.messages.length > 0)) {
            const newConversation: Conversation = { id: Date.now().toString(), title: "New Chat", messages: [], createdAt: Date.now() };
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(newConversation.id);
        }
        setPrefilledInput(promptPrefix);
        setShowHomepage(false);
    };

    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} onGuestLogin={handleGuestLogin} />;
    }

    return (
        <div className="h-screen w-screen flex font-sans overflow-hidden bg-base-200">
            <ChatHistorySidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                currentUser={currentUser.username}
                onLogout={handleLogout}
                studyStreak={studyStreak}
                onGoHome={handleGoHome}
            />
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden" />}

            <main className="flex-1 flex flex-col relative">
                <div className="absolute top-0 left-0 p-2 z-10 md:hidden flex items-center gap-2">
                     <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-content-secondary hover:text-content">
                        <MenuIcon/>
                    </button>
                    {!showHomepage && (
                         <button onClick={handleGoHome} className="p-2 text-content-secondary hover:text-content">
                            <HomeIcon/>
                        </button>
                    )}
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    {showHomepage ? (
                        <HomePage
                            currentUser={currentUser}
                            conversations={conversations}
                            currentSubject={currentSubject}
                            onLanguageToggle={handleLanguageToggle}
                            onSubjectChange={handleSubjectChange}
                            onFeatureSelect={handleFeatureSelect}
                            onStartQuiz={handleStartQuizRush}
                            onStartGoals={handleStartTodoList}
                        />
                    ) : mode === AppMode.TEXT ? (
                        <ChatInterface
                            messages={messages}
                            isLoading={isLoading}
                            onPlayAudio={handlePlayAudio}
                        />
                    ) : (
                        <VoiceInterface
                           transcriptHistory={transcripts.history}
                           currentUserTranscript={transcripts.user}
                           currentAssistantTranscript={transcripts.assistant}
                           status={voiceStatus}
                        />
                    )}
                    {!showHomepage && (
                      <ChatInputBar
                          mode={mode}
                          setMode={setMode}
                          useSearch={useSearch}
                          setUseSearch={setUseSearch}
                          useThinkingMode={useThinkingMode}
                          setUseThinkingMode={setUseThinkingMode}
                          attachedFile={attachedFile}
                          setAttachedFile={setAttachedFile}
                          onSend={handleSend}
                          isLoading={isLoading}
                          voiceStatus={voiceStatus}
                          startVoice={startVoiceConversation}
                          stopVoice={stopVoiceConversation}
                          liveUserTranscript={transcripts.user}
                          prefilledInput={prefilledInput}
                          setPrefilledInput={setPrefilledInput}
                      />
                    )}
                </div>
            </main>
            {quizState && (
                <QuizRushModal
                    quizState={quizState}
                    isLoading={isLoading}
                    onGenerateQuiz={handleGenerateQuiz}
                    onAnswer={handleQuizAnswer}
                    onClose={handleCloseQuiz}
                />
            )}
            {todoListState && (
                <TodoListModal
                    todoListState={todoListState}
                    isLoading={isLoading}
                    onGenerate={handleGenerateTodoList}
                    onToggleItem={handleToggleTodoItem}
                    onClose={handleCloseTodoList}
                />
            )}
        </div>
    );
}