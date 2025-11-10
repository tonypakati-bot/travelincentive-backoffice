
import React from 'react';
import { Announcement, Page } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDismiss: (id: number) => void;
  onActionClick?: (page: Page) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onDismiss, onActionClick }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden mb-4 relative animate-fade-in-up border border-white/20">
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div className="w-full pr-4">
                <h3 className="font-bold text-teal-400 mb-1">{announcement.title}</h3>
                <p className="text-white text-base">{announcement.content}</p>
            </div>
            {announcement.action && onActionClick ? (
               null // Action button is rendered below
            ) : (
                <button
                    onClick={() => onDismiss(announcement.id)}
                    className="text-white/80 hover:text-white -mt-1 -mr-1 p-1 flex-shrink-0"
                    aria-label={`Dismiss announcement`}
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
            )}
        </div>
        {announcement.action && onActionClick && (
            <div className="mt-4">
                <button
                    onClick={() => onActionClick(announcement.action!.page)}
                    className="w-full bg-teal-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors duration-200"
                >
                    {announcement.action.label}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;