import React from 'react';
import { Profile } from '../types';

interface ProfilePageProps {
  userProfile: Profile;
  registrationData: { [key: string]: any } | null;
}

const ProfileInfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start py-4">
        <span className="material-symbols-outlined text-gray-500 mt-0.5 mr-4">{icon}</span>
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-medium text-gray-900">{value}</p>
        </div>
    </div>
);

const getInitials = (name: string): string => {
    if (!name) return '';
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, registrationData }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow border border-gray-200 mb-6">
          <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center mb-4 ring-4 ring-white">
            <span className="text-3xl font-bold text-sky-600">{getInitials(`${userProfile.firstName} ${userProfile.lastName}`)}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A2C47]">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
          <p className="text-gray-500">{userProfile.groupName}</p>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-bold text-[#1A2C47] mb-2">Informazioni Personali</h2>
            <div className="divide-y divide-gray-100">
                <ProfileInfoRow icon="person" label="Nome Completo" value={`${userProfile.firstName} ${userProfile.lastName}`} />
                <ProfileInfoRow icon="email" label="Email" value={userProfile.email} />
                <ProfileInfoRow icon="phone" label="Telefono" value={userProfile.mobilePhone || 'Non specificato'} />
            </div>
        </div>

        {/* Trip Details Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-bold text-[#1A2C47] mb-2">Dettagli Viaggio</h2>
            {registrationData ? (
                 <div className="divide-y divide-gray-100">
                    <ProfileInfoRow icon="flight_takeoff" label="Aeroporto di Partenza" value={registrationData.form_data?.departureAirport || 'Non specificato'} />
                    <ProfileInfoRow icon="hotel" label="Tipologia Camera" value={registrationData.form_data?.roomType || 'Non specificata'} />
                    <ProfileInfoRow icon="group" label="Accompagnatore" value={registrationData.form_data?.hasCompanion ? 'Sì' : 'No'} />
                </div>
            ) : (
                <p className="text-sm text-gray-500 py-4 text-center">
                    Completa la scheda di adesione per visualizzare i dettagli del tuo viaggio.
                </p>
            )}
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;