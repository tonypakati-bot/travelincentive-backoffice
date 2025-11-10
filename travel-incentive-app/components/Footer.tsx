
import React from 'react';
import { Page } from '../types';
import { footerNavLinks } from '../config/ui';

interface FooterProps {
  activePage: Page;
  onNavClick: (page: Page) => void;
  unreadCount: number;
}

const Footer: React.FC<FooterProps> = ({ activePage, onNavClick, unreadCount }) => {
  const isHomePage = activePage === 'home';

  const containerClasses = isHomePage
    ? "bg-black/20 backdrop-blur-lg rounded-full shadow-2xl flex justify-around items-center h-16 border border-white/20"
    : "bg-white rounded-full shadow-lg flex justify-around items-center h-16 border border-gray-200/50";

  const getIconClasses = (isActive: boolean) => {
    if (isHomePage) {
      return `material-symbols-outlined transition-colors duration-200 ${isActive ? 'fill text-sky-400' : 'text-white/70'}`;
    }
    return `material-symbols-outlined transition-colors duration-200 ${isActive ? 'fill text-sky-500' : 'text-gray-500'}`;
  };
  
  const getLabelClasses = (isActive: boolean) => {
    if (isHomePage) {
      return `text-xs mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-sky-400' : 'text-white/70'}`;
    }
    return `text-xs mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-sky-500' : 'text-gray-500'}`;
  };

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm z-40">
      <div className={containerClasses}>
        {footerNavLinks.map((link) => {
          const isActive = activePage === link.page;
          return (
            <button
              key={link.id}
              onClick={() => onNavClick(link.page)}
              className="flex flex-col items-center justify-center text-center w-16 h-full rounded-full transition-opacity duration-300"
              aria-label={link.label}
            >
              <div className="relative">
                <span className={getIconClasses(isActive)}>
                  {link.icon}
                </span>
                {link.id === 'home' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={getLabelClasses(isActive)}>
                {link.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;