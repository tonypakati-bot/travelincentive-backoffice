import React from 'react';
import { hamburgerNavLinks } from '../config/ui';
import { Page } from '../types';
import useAuth from '../hooks/useAuth';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (page: Page) => void;
}

const getInitials = (name: string): string => {
    if (!name) return '';
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onNavClick }) => {
  const { logout, user } = useAuth();
  const mainLinks = hamburgerNavLinks.filter(link => !link.isDanger);
  const logoutLink = hamburgerNavLinks.find(link => link.isDanger);

  const handleLinkClick = (page?: Page) => {
    if (page) {
      onNavClick(page);
      onClose();
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#1A202C] text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-2xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="flex flex-col h-full">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white" aria-label="Close menu">
                <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            
            <div className="p-8 pt-20">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center ring-2 ring-sky-400 flex-shrink-0">
                        <span className="text-2xl font-bold text-white">{user ? getInitials(user.firstName + ' ' + user.lastName) : ''}</span>
                    </div>
                    <div>
                        <h2 id="menu-title" className="text-xl font-bold text-white">{user ? `${user.firstName} ${user.lastName}` : 'Utente'}</h2>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-grow px-4">
                <ul className="space-y-1">
                    {mainLinks.map(link => (
                        <li key={link.id}>
                            <button
                                onClick={() => handleLinkClick(link.page)}
                                className="flex items-center w-full px-4 py-3 text-gray-200 hover:bg-white/10 rounded-lg transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined mr-4 text-gray-400">{link.icon}</span>
                                <span className="font-medium text-base">{link.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="px-8 pb-4">
                <hr className="border-t border-white/10" />
                {logoutLink && (
                    <nav className="mt-4">
                        <ul>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined mr-4">{logoutLink.icon}</span>
                                    <span className="font-medium text-base">{logoutLink.label}</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            <p className="text-center text-xs text-gray-500 pb-6">
                Guida Viaggio v1.0
            </p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;