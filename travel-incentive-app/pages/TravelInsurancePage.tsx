import React from 'react';

const TravelInsurancePage: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="material-symbols-outlined text-sky-600 text-3xl">health_and_safety</span>
            </div>
            <div>
                <h2 className="text-xl font-bold text-[#1A2C47]">
                    Polizza Facoltativa
                </h2>
                <p className="text-gray-500">Spese Mediche e Annullamento</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Per stipulare la polizza più adatta alle tue esigenze e usufruire dello sconto riservato, contatta il nostro partner:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-5">
            <p className="text-sm text-gray-600 mb-1">Indirizzo Email:</p>
            <a 
              href="mailto:emissioni@clikki.it" 
              className="font-semibold text-sky-600 hover:text-sky-800 transition-colors duration-200 text-lg flex items-center group"
            >
              <span className="material-symbols-outlined mr-2 group-hover:animate-pulse">email</span>
              emissioni@clikki.it
            </a>
          </div>
          
          <div className="mt-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md flex items-start space-x-3">
                <span className="material-symbols-outlined mt-1">info</span>
                <div>
                    <h3 className="font-bold">Nota Bene</h3>
                    <p className="text-sm mt-1 leading-relaxed">
                      Ricordiamo che un'eventuale polizza annullamento va stipulata almeno 30 giorni prima della partenza. L’evento che impedisce la partecipazione al viaggio deve essere imprevedibile, documentabile, non conosciuto al momento della prenotazione e non dipendente dalla volontà dell’assicurato.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelInsurancePage;
