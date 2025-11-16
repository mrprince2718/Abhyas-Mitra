import React from 'react';
import { Conversation } from '../types';
import { PlusIcon, TrashIcon, SparkleIcon, FireIcon } from './icons';

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentUser: string | null;
  onLogout: () => void;
  studyStreak: number;
  onGoHome: () => void;
}

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
);


export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  currentUser,
  onLogout,
  studyStreak,
  onGoHome,
}) => {
  return (
    <aside className={`bg-base-100 flex flex-col transition-transform duration-300 ease-in-out z-40
        md:w-64 md:relative md:translate-x-0
        fixed h-full ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full' }`}>
       <div className="flex items-center justify-between p-4 mb-2">
            <button onClick={onGoHome} className="inline-flex items-center gap-2 group">
                <SparkleIcon className="w-6 h-6 text-primary group-hover:animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">ABHYAS MITRA</h1>
            </button>
       </div>
       <div className="px-2">
            <button
                onClick={onNewConversation}
                className="flex items-center justify-center gap-2 w-full p-2.5 mb-4 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap font-semibold"
            >
                <PlusIcon className="w-5 h-5" />
                <span>New Chat</span>
            </button>
       </div>
      <div className="flex-1 overflow-y-auto px-2">
        <nav className="flex flex-col gap-1">
          {conversations.map((convo) => (
            <a
              key={convo.id}
              onClick={() => onSelectConversation(convo.id)}
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors ${
                activeConversationId === convo.id
                  ? 'bg-base-300 text-content'
                  : 'text-content-secondary hover:bg-base-300/50 hover:text-content'
              }`}
            >
              <span className="truncate flex-1 whitespace-nowrap">{convo.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(convo.id);
                }}
                className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete conversation"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </a>
          ))}
        </nav>
      </div>
      <div className="pt-2 mt-2 border-t border-white/10 px-2">
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-content whitespace-nowrap truncate">{currentUser}</span>
                {studyStreak > 0 && (
                    <div className="flex items-center gap-1 text-orange-400" title={`${studyStreak} day streak!`}>
                        <FireIcon className="w-4 h-4" />
                        <span className="text-xs font-bold">{studyStreak}</span>
                    </div>
                )}
            </div>
            <button onClick={onLogout} className="text-content-secondary hover:text-content" aria-label="Logout">
                <LogoutIcon />
            </button>
        </div>
      </div>
    </aside>
  );
};