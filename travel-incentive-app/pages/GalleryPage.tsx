import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AgendaDay, Photo, Profile } from '../types';
import useAuth from '../hooks/useAuth';


// --- Confirmation Modal ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-3">warning</span>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 border-t rounded-b-xl flex gap-3">
          <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Annulla</button>
          <button onClick={onConfirm} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Elimina</button>
        </div>
      </div>
    </div>
  );
};


// --- Photo Viewer Modal ---
interface PhotoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  initialIndex: number;
  onLike: (photoId: number) => void;
  onDelete: (photoId: number) => void;
  currentUser: Profile;
  likedPhotos: number[];
}
const PhotoViewer: React.FC<PhotoViewerProps> = ({ isOpen, onClose, photos, initialIndex, onLike, onDelete, currentUser, likedPhotos }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const photo = photos[currentIndex];

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setShowConfirmDelete(false);
    }, [initialIndex, isOpen]);

    if (!isOpen || !photo) return null;

    const isCurrentlyLiked = likedPhotos.includes(photo.id);

    const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    
    const handleLike = () => {
        onLike(photo.id);
    };

    const handleDeleteConfirm = () => {
        onDelete(photo.id);
        setShowConfirmDelete(false);
        onClose(); 
    };
    
    const canDelete = currentUser.role === 'admin' || currentUser.userId === photo.userId;

    return (
        <>
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-20" aria-label="Chiudi"><span className="material-symbols-outlined text-3xl">close</span></button>
                
                {/* Navigation */}
                {photos.length > 1 && <>
                    <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white" aria-label="Precedente"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
                    <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white" aria-label="Successiva"><span className="material-symbols-outlined">arrow_forward_ios</span></button>
                </>}
                
                {/* Image & Info */}
                <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                    <img src={photo.url} alt={photo.caption} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
                    <div className="text-white text-center mt-4 p-4 w-full max-w-xl">
                        <p className="font-semibold text-lg">{photo.caption}</p>
                        <div className="flex items-center justify-center text-sm text-white/80 mt-2 space-x-6">
                            <div className="flex items-center">
                                <img src={photo.userImageUrl} alt={photo.userName} className="w-6 h-6 rounded-full mr-2 border border-white/50" />
                                <span>{photo.userName}</span>
                            </div>
                             <button onClick={handleLike} className={`flex items-center group ${isCurrentlyLiked ? 'text-red-500' : 'hover:text-red-400'}`}>
                                <span className={`material-symbols-outlined mr-1 transition-transform duration-200 ${isCurrentlyLiked ? 'fill animate-heartbeat' : 'group-hover:scale-110'}`}>{isCurrentlyLiked ? 'favorite' : 'favorite_border'}</span>
                                <span>{photo.likes}</span>
                            </button>
                            {canDelete && (
                                <button onClick={() => setShowConfirmDelete(true)} className="flex items-center hover:text-red-400">
                                    <span className="material-symbols-outlined mr-1">delete</span>
                                    <span>Elimina</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmationModal 
            isOpen={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={handleDeleteConfirm}
            title="Conferma Eliminazione"
            message="Sei sicuro di voler eliminare questa foto? L'azione è irreversibile."
        />
        </>
    );
};

// --- Upload Modal ---
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newPhotos: Omit<Photo, 'id' | 'likes' | 'timestamp' | 'userId'>[]) => void;
  agenda: AgendaDay[];
}
const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, agenda }) => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [captions, setCaptions] = useState<string[]>([]);
    const [day, setDay] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setFiles([]);
            setPreviews([]);
            setCaptions([]);
            setDay('');
        }
    }, [isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);
            setCaptions(new Array(selectedFiles.length).fill(''));

            const newPreviews = selectedFiles.map((file: File) => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };
    
    const handleCaptionChange = (index: number, value: string) => {
        const newCaptions = [...captions];
        newCaptions[index] = value;
        setCaptions(newCaptions);
    };

    const handleSubmit = () => {
        if (files.length === 0 || !day) {
            alert("Seleziona almeno una foto e un giorno del viaggio.");
            return;
        }
        const newPhotos = files.map((file, index) => ({
            url: previews[index],
            thumbnailUrl: previews[index],
            userName: user?.firstName + ' ' + user?.lastName || 'Unknown User',
            userImageUrl: user?.imageUrl || '/images/default-avatar.png',
            caption: captions[index] || 'Senza didascalia',
            day: parseInt(day),
        }));
        onUpload(newPhotos);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Carica le tue Foto</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Chiudi"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {previews.length === 0 ? (
                        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                            <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                            <p className="font-semibold mt-2">Clicca per selezionare le foto</p>
                            <p className="text-sm">Puoi caricare più immagini contemporaneamente</p>
                            <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <img src={preview} alt={`Anteprima ${index+1}`} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                    <textarea value={captions[index]} onChange={e => handleCaptionChange(index, e.target.value)} placeholder="Aggiungi una didascalia..." className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500 text-gray-900" rows={2}></textarea>
                                </div>
                            ))}
                        </div>
                    )}
                    <div>
                        <label htmlFor="day-select" className="block text-sm font-medium text-gray-700 mb-1">Associa al giorno del viaggio:</label>
                        <select id="day-select" value={day} onChange={e => setDay(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm appearance-none text-gray-900">
                            <option value="" disabled>Seleziona un giorno</option>
                            {agenda.map(d => <option key={d.day} value={d.day}>Giorno {d.day}: {d.title}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t rounded-b-xl flex justify-end">
                    <button onClick={handleSubmit} className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors duration-200 flex items-center" disabled={files.length === 0 || !day}>
                        <span className="material-symbols-outlined mr-2">upload</span>
                        Carica
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
interface GalleryPageProps {
  agenda: AgendaDay[];
  photos: Photo[];
  onUpload: (newPhotos: Omit<Photo, 'id' | 'likes' | 'timestamp' | 'userId'>[]) => void;
  onLike: (photoId: number) => void;
  onDelete: (photoId: number) => void;
  currentUser: Profile;
  likedPhotos: number[];
}
const GalleryPage: React.FC<GalleryPageProps> = ({ agenda, photos, onUpload, onLike, onDelete, currentUser, likedPhotos }) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedPhotoInfo, setSelectedPhotoInfo] = useState<{ photos: Photo[], index: number } | null>(null);

    const groupedPhotos = useMemo(() => {
        const groups: Record<number, Photo[]> = {};
        photos.forEach(photo => {
            if (!groups[photo.day]) {
                groups[photo.day] = [];
            }
            groups[photo.day].push(photo);
        });
        return Object.entries(groups).sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB));
    }, [photos]);

    const handlePhotoClick = (photo: Photo, dayPhotos: Photo[]) => {
        const index = dayPhotos.findIndex(p => p.id === photo.id);
        setSelectedPhotoInfo({ photos: dayPhotos, index });
        setIsViewerOpen(true);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {groupedPhotos.map(([day, dayPhotos]) => {
                const dayInfo = agenda.find(d => d.day === parseInt(day));
                return (
                    <section key={day} className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-[#1A2C47]">Giorno {day}</h2>
                            {dayInfo && <p className="text-gray-500">{dayInfo.title}</p>}
                        </div>
                        <div className="columns-2 md:columns-3 gap-3">
                            {dayPhotos.map(photo => (
                                <div key={photo.id} onClick={() => handlePhotoClick(photo, dayPhotos)} className="mb-3 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-md">
                                    <img src={photo.thumbnailUrl} alt={photo.caption} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                        <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}
            
            {photos.length === 0 && (
                 <div className="text-center mt-16 text-gray-500 flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl mb-4">photo_camera</span>
                    <h3 className="text-xl font-semibold text-gray-700">La galleria è vuota</h3>
                    <p className="mt-1">Sii il primo a condividere un ricordo!</p>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsUploadOpen(true)}
                className="fixed bottom-24 right-6 bg-sky-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-sky-600 transition-transform duration-200 hover:scale-105"
                aria-label="Carica foto"
            >
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
            </button>

            {/* Modals */}
            <PhotoViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                photos={selectedPhotoInfo?.photos || []}
                initialIndex={selectedPhotoInfo?.index || 0}
                onLike={onLike}
                onDelete={onDelete}
                currentUser={currentUser}
                likedPhotos={likedPhotos}
            />
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={onUpload}
                agenda={agenda}
            />
        </div>
    );
};

export default GalleryPage;