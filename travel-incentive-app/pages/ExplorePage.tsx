import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AgendaDay, AgendaCategory, AgendaItem, AgendaDetail } from '../types';
import ExploreCard from '../components/ExploreCard';

interface ExplorePageProps {
  agenda: AgendaDay[];
  navigationData: { itemId: number; category: AgendaCategory } | null;
  clearNavigationData: () => void;
}

const CATEGORIES: AgendaCategory[] = ['Hotel', 'Meeting', 'Activity', 'Restaurant'];

const CATEGORY_LABELS: Record<string, string> = {
    'Hotel': 'Hotels',
    'Meeting': 'Meetings',
    'Activity': 'Activities',
    'Restaurant': 'Restaurants',
};

interface AgendaItemWithDayAndDate extends AgendaItem {
    date: string;
    day: number;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ agenda, navigationData, clearNavigationData }) => {
  const [selectedCategory, setSelectedCategory] = useState<AgendaCategory>('Hotel');
  const pageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Effect to set the category when navigating from Agenda page
  useEffect(() => {
    if (navigationData) {
      setSelectedCategory(navigationData.category);
    }
  }, [navigationData]);

  const groupedAgenda = useMemo(() => {
    if (selectedCategory === 'Hotel') {
        const allItems: AgendaItemWithDayAndDate[] = agenda.flatMap(day =>
            day.items.map(item => ({ ...item, date: day.date, day: day.day }))
        );

        const checkInItem = allItems.find(item => item.category === 'Hotel' && item.title.toLowerCase().includes('check-in'));
        const checkOutItem = allItems.find(item => item.category === 'Hotel' && item.title.toLowerCase().includes('check-out'));

        if (checkInItem && checkOutItem) {
            const combinedDetails: AgendaDetail[] = [
                { icon: 'login', text: `Check-in: ${checkInItem.date}, ${checkInItem.time}` },
                { icon: 'logout', text: `Check-out: ${checkOutItem.date}, ${checkOutItem.time}` },
            ];

            const combinedHotelItem: AgendaItem = {
                id: 999,
                category: 'Hotel',
                icon: 'hotel',
                time: `${checkInItem.date} - ${checkOutItem.date}`,
                title: checkInItem.image?.caption || 'Informazioni Hotel',
                description: checkInItem.description,
                image: checkInItem.image,
                details: combinedDetails
            };
            
            // Use the check-in item ID for navigation purposes
            if (checkInItem) combinedHotelItem.id = checkInItem.id;


            return [{
                day: 0,
                date: 'Dettagli Soggiorno',
                items: [combinedHotelItem]
            }];
        }
    }


    // 1. Flatten all items and add the date and day from the parent day object.
    const allItems: AgendaItemWithDayAndDate[] = agenda.flatMap(day =>
      day.items.map(item => ({ ...item, date: day.date, day: day.day }))
    );

    // 2. Filter by the selected category.
    let filtered = allItems.filter(item => item.category === selectedCategory);

    // Exclude meals "in Hotel" from the Restaurant category view
    if (selectedCategory === 'Restaurant') {
      filtered = filtered.filter(item => 
        !item.title.toLowerCase().includes('in hotel')
      );
    }

    // 3. Define a parser for date and time strings.
    const parseDateTime = (dateString: string, timeString: string): Date => {
        // Italian month names to numeric representation
        const monthMap: { [key: string]: string } = {
            'Gennaio': '01', 'Febbraio': '02', 'Marzo': '03',
            'Aprile': '04', 'Maggio': '05', 'Giugno': '06',
            'Luglio': '07', 'Agosto': '08', 'Settembre': '09',
            'Ottobre': '10', 'Novembre': '11', 'Dicembre': '12',
        };
        
        // Mapping for Italian general time descriptions to sortable 24-hour times
        const timeMap: { [key: string]: string } = {
            'mattina': '09:00',
            'tarda mattinata': '11:00',
            'pranzo': '13:00',
            'pomeriggio': '15:00',
            'serata': '19:00',
            'cena': '20:00',
            'intera giornata': '08:00'
        };

        // Example dateString: "Giovedì 6 Novembre 2025"
        const dateParts = dateString.split(' ');
        if (dateParts.length < 4) return new Date(NaN); // Return invalid date

        const day = String(dateParts[1]).padStart(2, '0');
        const monthNumber = monthMap[dateParts[2]];
        const year = dateParts[3];

        if (!monthNumber || !day || !year) return new Date(NaN);

        const normalizedTimeString = timeString.toLowerCase().trim();
        const parsedTime = timeMap[normalizedTimeString] || '12:00'; // Default to noon if not found

        // Constructs a standard ISO string that `new Date()` can parse reliably.
        const isoString = `${year}-${monthNumber}-${day}T${parsedTime}:00`;
        
        return new Date(isoString);
    };

    // 4. Sort the filtered items chronologically.
    const sortedItems = filtered.sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time);
      const dateB = parseDateTime(b.date, b.time);

      if (isNaN(dateA.getTime())) return 1; // Put invalid dates at the end
      if (isNaN(dateB.getTime())) return -1;

      const timeDiff = dateA.getTime() - dateB.getTime();
      if (timeDiff !== 0) {
        return timeDiff;
      }
      
      // If times are the same (e.g., two "Mattina" events), preserve original order
      // using the item ID as a tie-breaker.
      return a.id - b.id;
    });

    // 5. Group sorted items by date.
    const grouped = sortedItems.reduce((acc, item) => {
      const key = item.date; // Group by the unique date string
      if (!acc[key]) {
        acc[key] = {
          day: item.day,
          date: item.date,
          items: []
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {} as Record<string, { day: number; date: string; items: AgendaItem[] }>);
    
    return Object.values(grouped);

  }, [agenda, selectedCategory]);
  
  // Effect to scroll and highlight after the component has rendered with the right category
  useEffect(() => {
    if (navigationData && groupedAgenda.length > 0) {
      // The hotel item might be combined, so we check for the original check-in ID
      const targetId = navigationData.category === 'Hotel'
        ? groupedAgenda[0].items[0].id
        : navigationData.itemId;
      
      const element = itemRefs.current.get(targetId);
      
      if (element) {
        setTimeout(() => {
          // The main application header is 80px tall (h-20 in Header.tsx)
          const mainHeaderHeight = 80;
          // The category selector bar is also sticky below the main header
          const categorySelectorElement = document.querySelector('.sticky.top-\\[80px\\]');
          const categorySelectorHeight = categorySelectorElement ? categorySelectorElement.clientHeight : 72; // A safe fallback height
          
          const totalStickyHeadersHeight = mainHeaderHeight + categorySelectorHeight;
          
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          // Calculate the final scroll position to place the element just below the sticky headers, with a small margin.
          const offset = elementTop - totalStickyHeadersHeight - 20;

          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });

          // Highlight effect
          element.style.transition = 'background-color 0.5s ease-in-out';
          element.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
          setTimeout(() => {
            if (element) {
              element.style.backgroundColor = '';
            }
          }, 2500);
          
          clearNavigationData();
        }, 100);
      } else {
        clearNavigationData();
      }
    }
  }, [navigationData, groupedAgenda, clearNavigationData]);


  useEffect(() => {
    if (pageRef.current && !navigationData) {
      pageRef.current.scrollTo(0, 0);
    }
  }, [selectedCategory, navigationData]);

  return (
    <div ref={pageRef} className="bg-gray-50 min-h-screen">
       <div className="sticky top-[80px] bg-gray-50/80 backdrop-blur-md z-30 py-4 px-4">
          <div className="bg-[#1A2C47] p-1 rounded-full flex justify-around items-center">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category 
                  ? 'bg-gray-200 text-[#1A2C47]' 
                  : 'bg-transparent text-white hover:bg-white/20'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
      </div>
      <div className="p-4 pt-2 flex flex-col items-center w-full">
        {groupedAgenda.map(group => (
          <div key={group.date} className="w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 px-4 mt-4 mb-2">
              {group.day > 0 ? `Day ${group.day} - ${group.date}` : group.date}
            </h2>
            {group.items.map(item => (
              <div
                key={item.id}
                ref={node => {
                  if (node) itemRefs.current.set(item.id, node);
                  else itemRefs.current.delete(item.id);
                }}
              >
                <ExploreCard item={item} />
              </div>
            ))}
          </div>
        ))}

        {groupedAgenda.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p>Nessun evento trovato per questa categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;