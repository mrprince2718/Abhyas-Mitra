import React, { useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { ChatMessage } from './ChatMessage';
import { SparkleIcon } from './icons';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onPlayAudio: (text: string) => Promise<void>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    isLoading,
    onPlayAudio,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-16 md:pt-6 min-h-0">
        <div className="max-w-3xl mx-auto">
            {messages.map((msg, index) => (
                (msg.role !== Role.SYSTEM) && <ChatMessage key={index} message={msg} onPlayAudio={onPlayAudio} />
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === Role.USER && (
                <div className="flex items-start gap-4 my-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                        <SparkleIcon className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="p-4 rounded-lg max-w-lg bg-base-300">
                        <p className="italic text-content-secondary">ABHYAS MITRA is thinking...</p>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    </div>
  );
};