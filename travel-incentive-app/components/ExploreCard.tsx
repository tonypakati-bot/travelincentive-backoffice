
import React, { useState } from 'react';
import { AgendaItem } from '../types';

interface ExploreCardProps {
  item: AgendaItem;
}

const TRUNCATE_LENGTH = 120;

const ExploreCard: React.FC<ExploreCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImage = item.image && item.image.urls.length > 0;
  const hasGallery = hasImage && item.image.urls.length > 1;
  const gallery = item.image?.urls || [];

  const cardTitle = (item.image?.caption && item.title !== item.image.caption) 
    ? `${item.title} - ${item.image.caption}` 
    : item.title;

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasGallery) {
      setCurrentImageIndex((prevIndex) => (prevIndex === gallery.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionToDisplay = item.longDescription || item.description;
  const descriptionNeedsTruncation = descriptionToDisplay.length > TRUNCATE_LENGTH;
  const displayedDescription = isExpanded ? descriptionToDisplay : `${descriptionToDisplay.substring(0, TRUNCATE_LENGTH)}...`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden m-4 w-full max-w-md mx-auto border border-gray-100">
      {hasImage && (
        <div 
          className="relative"
          onClick={handleImageClick}
          style={{ cursor: hasGallery ? 'pointer' : 'default' }}
        >
          <img 
            className="w-full aspect-[4/3] object-cover" 
            src={gallery[currentImageIndex]} 
            alt={item.image.caption || item.title} 
          />
          {hasGallery && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                {gallery.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="p-6">
        {!hasImage ? (
          <>
            <div>
              <p className="font-bold text-sm" style={{color: '#F4B400'}}>{item.time}</p>
              <h3 className="text-xl font-bold text-gray-900">{cardTitle}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {descriptionNeedsTruncation ? displayedDescription : descriptionToDisplay}
              </p>
              {descriptionNeedsTruncation && (
                  <button onClick={toggleExpanded} className="text-sky-600 hover:text-sky-800 font-semibold text-sm mt-2">
                      {isExpanded ? 'Mostra di meno' : 'Mostra di più'}
                  </button>
              )}
            </div>

            {item.details && (
              <div className="space-y-3 text-sm mt-4 pt-4 border-t border-gray-200">
                {item.details.map((detail, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="material-symbols-outlined mr-2 text-amber-500 text-lg">{detail.icon}</span>
                    <span>{detail.text}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center mb-2">
              <div>
                <p className="font-bold text-sm" style={{color: '#F4B400'}}>{item.time}</p>
                <h3 className="text-xl font-bold text-gray-900">{cardTitle}</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {descriptionNeedsTruncation ? displayedDescription : descriptionToDisplay}
            </p>
            {descriptionNeedsTruncation && (
              <button onClick={toggleExpanded} className="text-sky-600 hover:text-sky-800 font-semibold text-sm mt-2 mb-4">
                {isExpanded ? 'Mostra di meno' : 'Mostra di più'}
              </button>
            )}
            
            {(item.image.details || item.details) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    
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
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreCard;