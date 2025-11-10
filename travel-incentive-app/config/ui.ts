import { NavLink, HamburgerLink } from '../types';

export const footerNavLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: 'home', page: 'home' },
  { id: 'travel', label: 'Travel', icon: 'flight', page: 'travel' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar_today', page: 'agenda' },
  { id: 'explore', label: 'Explore', icon: 'explore', page: 'explore' },
  { id: 'contact', label: 'Contact', icon: 'support_agent', page: 'contact' },
];

export const hamburgerNavLinks: HamburgerLink[] = [
    { id: 'profile', label: 'Il Mio Profilo', icon: 'person', page: 'profile' },
    { id: 'gallery', label: 'Galleria Fotografica', icon: 'photo_camera', page: 'gallery' },
    { id: 'form', label: 'Scheda di Adesione', icon: 'assignment', page: 'registration' },
    { id: 'docs', label: 'Documenti di Viaggio', icon: 'folder', page: 'documents' },
    { id: 'insurance', label: 'Assicurazione di Viaggio', icon: 'health_and_safety', page: 'travel-insurance' },
    { id: 'settings', label: 'Impostazioni', icon: 'settings', page: 'settings' },
    { id: 'logout', label: 'Logout', icon: 'logout', isDanger: true },
];