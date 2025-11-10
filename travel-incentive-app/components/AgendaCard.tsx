

import React from 'react';
import { AgendaItem } from '../types';

interface AgendaCardProps {
  item: AgendaItem;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ item }) => {
  if (!item.image || item.image.urls.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
      <img src={item.image.urls[0]} alt={item.image.caption || item.title} className="w-full h-auto object-cover max-h-60" />
      
      {(item.image.caption || item.image.details || item.details) && (
        <div className="p-4">
          {item.image.caption && <h4 className="text-lg font-bold text-gray-800 mb-3">{item.image.caption}</h4>}
          
          {item.image.details && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {item.image.details.map((detail, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-700">
                  <span className="material-symbols-outlined mr-2 text-amber-500 text-lg">{detail.icon}</span>
                  <span>{detail.text}</span>
                </div>
              ))}
            </div>
          )}
  
          {item.details && (
              <div className={`space-y-3 ${item.image.details ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
              {item.details.map((detail, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-700">
                  <span className="material-symbols-outlined mr-2 text-amber-500 text-lg">{detail.icon}</span>
                  <span>{detail.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaCard;