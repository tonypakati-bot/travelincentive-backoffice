import React, { useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ToggleSwitch: React.FC<{
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ id, label, description, enabled, onChange }) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="pr-4">
        <label htmlFor={id} className="font-medium text-gray-900 cursor-pointer">{label}</label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        id={id}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
          enabled ? 'bg-sky-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};


const SettingsPage: React.FC = () => {
    const [notifications, setNotifications] = useState({
        general: true,
        agenda: true,
        documents: false,
    });
    const [theme, setTheme] = useState<Theme>('system');

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const themeOptions: { value: Theme; label: string; icon: string }[] = [
        { value: 'light', label: 'Chiaro', icon: 'light_mode' },
        { value: 'dark', label: 'Scuro', icon: 'dark_mode' },
        { value: 'system', label: 'Automatico', icon: 'brightness_auto' },
    ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-[#1A2C47] mb-2">Preferenze di Notifica</h2>
            <div className="divide-y divide-gray-100">
                <ToggleSwitch
                    id="general-notifications"
                    label="Annunci Generali"
                    description="Ricevi avvisi importanti e comunicazioni."
                    enabled={notifications.general}
                    onChange={(value) => handleNotificationChange('general', value)}
                />
                <ToggleSwitch
                    id="agenda-updates"
                    label="Aggiornamenti Agenda"
                    description="Notifiche su cambi di orario o eventi."
                    enabled={notifications.agenda}
                    onChange={(value) => handleNotificationChange('agenda', value)}
                />
                 <ToggleSwitch
                    id="document-notifications"
                    label="Documenti Pronti"
                    description="Ricevi una notifica quando i documenti sono disponibili."
                    enabled={notifications.documents}
                    onChange={(value) => handleNotificationChange('documents', value)}
                />
            </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-[#1A2C47] mb-4">Aspetto</h2>
            <div className="bg-gray-100 p-1 rounded-full flex justify-between items-center space-x-1">
                {themeOptions.map(option => (
                     <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`w-full flex items-center justify-center space-x-2 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                            theme === option.value
                            ? 'bg-white text-sky-600 shadow'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                     >
                        <span className="material-symbols-outlined text-base">{option.icon}</span>
                        <span>{option.label}</span>
                     </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;