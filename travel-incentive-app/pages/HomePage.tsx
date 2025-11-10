
import React from 'react';
import { Announcement, EventDetails, Page } from '../types';
import AnnouncementCard from '../components/AnnouncementCard';

interface HomePageProps {
  eventDetails: EventDetails;
  announcements: Announcement[];
  onDismiss: (id: number) => void;
  onNavClick: (page: Page) => void;
  userRegistration: { [key: string]: any } | null;
}

const HomePage: React.FC<HomePageProps> = ({ eventDetails, announcements, onDismiss, onNavClick, userRegistration }) => {
  const backgroundStyle = eventDetails.backgroundImageUrl
    ? { backgroundImage: `url(${eventDetails.backgroundImageUrl})` }
    : {};

  // Filtra annunci in base all'aeroporto di partenza dell'utente
  const userDepartureAirport = userRegistration?.form_data?.departureAirport;
  const filteredAnnouncements = announcements.filter(announcement => {
    // Se l'annuncio ha targetAirports specificati, controlla se l'utente ha selezionato uno di questi aeroporti
    if (announcement.targetAirports && announcement.targetAirports.length > 0) {
      return userDepartureAirport && announcement.targetAirports.includes(userDepartureAirport);
    }
    // Altrimenti mostra l'annuncio a tutti
    return true;
  });

  const regularAnnouncements = filteredAnnouncements.filter(a => !a.action);
  const actionAnnouncements = filteredAnnouncements.filter(a => a.action);

  return (
    <div className="relative min-h-screen text-white">
      <div 
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-screen pt-4 pb-24">
        
        <div className="flex flex-col items-center justify-start pt-16 text-center px-4 flex-grow">
            <div className="bg-white/10 backdrop-blur-sm rounded-full mb-6 w-36 h-36 flex items-center justify-center overflow-hidden">
              {eventDetails.brandImageUrl && (
                <img src={eventDetails.brandImageUrl} alt="Brand Logo" className="w-full h-full object-contain p-4" />
              )}
            </div>
            <h1 className="text-5xl font-bold tracking-tight">{eventDetails.title}</h1>
            <p className="mt-2 text-xl text-white/90">{eventDetails.subtitle}</p>
        </div>
        
        {filteredAnnouncements.length > 0 && (
          <div className="px-4 w-full max-w-lg mx-auto flex-shrink-0">
            {actionAnnouncements.map((announcement) => (
              <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onDismiss={onDismiss}
                  onActionClick={onNavClick}
              />
            ))}
            {regularAnnouncements.length > 0 && (
                <div className="flex items-center justify-center my-3">
                    <span className="material-symbols-outlined mr-2 text-teal-400">campaign</span>
                    <h2 className="text-lg font-semibold text-teal-400">Avvisi Importanti</h2>
                </div>
            )}
            {regularAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden mb-4 relative animate-fade-in-up border border-white/20">
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div className="w-full pr-4">
                                <p className="text-white text-base">{announcement.content}</p>
                            </div>
                            <button
                            onClick={() => onDismiss(announcement.id)}
                            className="text-white/80 hover:text-white -mt-1 -mr-1 p-1"
                            aria-label={`Dismiss announcement`}
                            >
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;