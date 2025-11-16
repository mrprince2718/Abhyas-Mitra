import React, { useState, useEffect } from 'react';
import { Message, Role } from '../types';
import { SparkleIcon, CopyIcon, SpeakerWaveIcon, DocumentTextIcon } from './icons';

declare global {
    interface Window {
        marked: any;
    }
}

const AttachmentPreview: React.FC<{ attachment: Message['attachment'] }> = ({ attachment }) => {
    if (!attachment) return null;

    if (attachment.type.startsWith('image/')) {
        return <img src={attachment.data} alt={attachment.name} className="mt-2 rounded-lg max-w-sm" />;
    }
    if (attachment.type.startsWith('video/')) {
        return <video src={attachment.data} controls className="mt-2 rounded-lg max-w-sm" />;
    }
    if (attachment.type === 'application/pdf') {
        return (
            <div className="mt-2 p-3 bg-base-100/50 rounded-lg flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 flex-shrink-0 text-content-secondary" />
                <span className="text-sm font-medium truncate">{attachment.name}</span>
            </div>
        );
    }
    return null;
}

interface ChatMessageProps {
  message: Message;
  onPlayAudio: (text: string) => Promise<void>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPlayAudio }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAssistant = message.role === Role.ASSISTANT;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
  };

  const handlePlayAudio = async () => {
    setIsSpeaking(true);
    try {
        await onPlayAudio(message.content);
    } catch (e) {
        console.error("Failed to play audio", e);
    } finally {
        setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const sanitizedHtml = window.marked ? window.marked.parse(message.content) : message.content;

  return (
    <div className={`flex items-start gap-3 my-4 group animate-fade-in-fast ${isAssistant ? '' : 'justify-end'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAssistant ? 'bg-primary' : 'bg-secondary'} ${isAssistant ? 'order-1' : 'order-2'}`}>
        {isAssistant ? (
          <SparkleIcon className="w-5 h-5 text-white" />
        ) : (
          <span className="text-sm font-semibold text-white">You</span>
        )}
      </div>
      <div className={`flex flex-col ${isAssistant ? 'order-2 items-start' : 'order-1 items-end'}`}>
        <div className={`relative p-4 rounded-xl max-w-lg ${isAssistant ? 'bg-base-300' : 'bg-secondary'}`}>
          <div className="prose prose-invert max-w-none text-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          {message.attachment && <AttachmentPreview attachment={message.attachment} />}
          
          {isAssistant && message.content && (
            <div className="absolute -top-2 -right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handlePlayAudio}
                    className="p-1.5 bg-base-100/70 backdrop-blur text-content-secondary rounded-full hover:text-content"
                    aria-label="Read aloud"
                    disabled={isSpeaking}
                >
                    <SpeakerWaveIcon className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                </button>
                <button 
                    onClick={handleCopy}
                    className="p-1.5 bg-base-100/70 backdrop-blur text-content-secondary rounded-full hover:text-content"
                    aria-label="Copy message"
                >
                    {copied ? <span className="text-xs px-1">Copied!</span> : <CopyIcon className="w-4 h-4" />}
                </button>
            </div>
          )}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold mb-2 text-content-secondary">Sources:</h4>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-base-100 text-content-secondary text-xs px-2 py-1 rounded-md hover:bg-base-200 transition-colors"
                  >
                    {index + 1}. {source.title || new URL(source.uri).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};