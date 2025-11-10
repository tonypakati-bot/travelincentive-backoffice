import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AgendaDay, AgendaItem } from '../types';
import AgendaCard from '../components/AgendaCard';

interface AgendaPageProps {
  agenda: AgendaDay[];
  onNavigateToExplore: (itemId: number) => void;
  userRegistration: { [key: string]: any } | null;
}

const AgendaPage: React.FC<AgendaPageProps> = ({ agenda, onNavigateToExplore, userRegistration }) => {
  const [selectedDay, setSelectedDay] = useState(agenda[0]?.day || 1);
  const pageRef = useRef<HTMLDivElement>(null);

  const explorableCategories: AgendaItem['category'][] = ['Hotel', 'Meeting', 'Activity', 'Restaurant'];

  // Filtra agenda items in base all'aeroporto di partenza dell'utente
  const filteredAgenda = useMemo(() => {
    const userDepartureAirport = userRegistration?.form_data?.departureAirport;
    
    return agenda.map(day => ({
      ...day,
      items: day.items.filter(item => {
        // Se l'item ha targetAirports specificati, controlla se l'utente ha selezionato uno di questi aeroporti
        if (item.targetAirports && item.targetAirports.length > 0) {
          return userDepartureAirport && item.targetAirports.includes(userDepartureAirport);
        }
        // Altrimenti mostra l'item a tutti
        return true;
      })
    }));
  }, [agenda, userRegistration]);

  const days = useMemo(() => {
    return filteredAgenda.map(dayData => dayData.day).sort((a, b) => a - b);
  }, [filteredAgenda]);

  const selectedDayData = useMemo(() => {
    return filteredAgenda.find(item => item.day === selectedDay);
  }, [filteredAgenda, selectedDay]);

  useEffect(() => {
    pageRef.current?.scrollTo(0, 0);
  }, [selectedDay]);

  return (
    <div ref={pageRef} className="bg-gray-50 min-h-screen font-sans">

      {/* Day Selector */}
      <div className="sticky top-[80px] bg-gray-50/90 backdrop-blur-md z-20 py-4 flex justify-center">
        <div className="bg-[#1A2C47] p-1 rounded-full flex space-x-1">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedDay === day 
                ? 'bg-white text-[#1A2C47] shadow' 
                : 'bg-transparent text-white hover:bg-white/20'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {selectedDayData && (
          <div className="animate-fade-in-up">
            {/* Day Header */}
            <div className="mb-10">
                <p className="text-gray-500 text-base mb-1">{selectedDayData.date}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{selectedDayData.title}</h1>
            </div>


            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" aria-hidden="true" />
              
              <div className="space-y-8">
                {selectedDayData.items.map((item) => {
                  const isExplorable = explorableCategories.includes(item.category);
                  return (
                    <div key={item.id} className="relative pl-16">
                      <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#1A2C47] text-white z-10">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>

                      <div 
                        onClick={isExplorable ? () => onNavigateToExplore(item.id) : undefined}
                        className={isExplorable ? 'cursor-pointer rounded-lg -ml-4 p-4 transition-colors duration-200 hover:bg-gray-100' : ''}
                      >
                        <p className="font-bold text-yellow-600 text-sm mb-1">{item.time}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                        
                        {item.image ? (
                          <AgendaCard item={item} />
                        ) : (
                          // NO IMAGE: Just render details if they exist.
                          item.details && (
                            <div className="mt-4 space-y-2">
                            {item.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-700">
                                <span className="material-symbols-outlined mr-2 text-amber-500 text-lg">{detail.icon}</span>
                                <span>{detail.text}</span>
                              </div>
                            ))}
                          </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaPage;