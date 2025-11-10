import Document from '../models/Document.mjs';

// Ottieni carte d'imbarco personali dell'utente (basate sui suoi voli)
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.user.id,
      documentType: 'boarding_pass'
    })
      .sort({ uploadedAt: -1 })
      .select('-__v');

    res.json(documents);
  } catch (error) {
    console.error('Error getting user documents:', error);
    res.status(500).json({ msg: 'Errore nel recupero delle carte d\'imbarco' });
  }
};

export const getLegalDocuments = async (req, res) => {
  try {
    // Per ora, restituiamo documenti di prova
    const legalDocs = {
      privacyPolicy: {
        title: "Informativa sulla Privacy",
        content: `
          <div class="prose prose-sm max-w-none">
            <h2 class="text-xl font-bold mb-4">Informativa sulla Privacy</h2>
            <p class="mb-4">Ai sensi dell'art. 13 del Regolamento UE 2016/679 ("GDPR"), ti informiamo che:</p>
            <ol class="list-decimal list-inside space-y-2 mb-4">
              <li>I tuoi dati personali saranno trattati per finalità strettamente connesse all'organizzazione del viaggio.</li>
              <li>Il trattamento dei dati avverrà nel rispetto delle normative vigenti e dei principi di correttezza, liceità e trasparenza.</li>
              <li>I dati forniti saranno utilizzati per:
                <ul class="list-disc list-inside ml-4 mt-2">
                  <li>Gestione delle prenotazioni</li>
                  <li>Comunicazioni relative al viaggio</li>
                  <li>Adempimenti amministrativi e fiscali</li>
                  <li>Gestione delle assicurazioni di viaggio</li>
                </ul>
              </li>
              <li>I tuoi dati saranno conservati per il tempo necessario all'espletamento delle finalità del viaggio e degli obblighi di legge.</li>
            </ol>
            <p class="mb-4">Per qualsiasi informazione o richiesta relativa al trattamento dei tuoi dati, puoi contattarci all'indirizzo privacy@example.com</p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Questa è una versione semplificata dell'informativa. Per la versione completa, consultare la documentazione fornita.</p>
            </div>
          </div>
        `
      },
      termsAndConditions: {
        title: "Termini e Condizioni",
        content: `
          <div class="prose prose-sm max-w-none">
            <h2 class="text-xl font-bold mb-4">Termini e Condizioni</h2>
            <p class="mb-4">Leggere attentamente le seguenti condizioni prima di procedere con la registrazione:</p>
            <ol class="list-decimal list-inside space-y-2 mb-4">
              <li>La partecipazione al viaggio è soggetta all'accettazione integrale di questi termini.</li>
              <li>Penali per cancellazione:
                <ul class="list-disc list-inside ml-4 mt-2">
                  <li>50% dell'importo totale per cancellazioni entro 30 giorni dalla partenza</li>
                  <li>75% dell'importo totale per cancellazioni entro 15 giorni dalla partenza</li>
                  <li>100% dell'importo totale per cancellazioni entro 7 giorni dalla partenza</li>
                </ul>
              </li>
              <li>Assicurazione:
                <ul class="list-disc list-inside ml-4 mt-2">
                  <li>L'assicurazione base è inclusa nel pacchetto</li>
                  <li>È possibile stipulare un'assicurazione integrativa</li>
                  <li>Le condizioni dettagliate sono disponibili nella documentazione assicurativa</li>
                </ul>
              </li>
              <li>Documenti di viaggio:
                <ul class="list-disc list-inside ml-4 mt-2">
                  <li>È responsabilità del partecipante assicurarsi di avere documenti validi</li>
                  <li>Il passaporto deve avere validità residua di almeno 6 mesi</li>
                  <li>Eventuali visti necessari sono a carico del partecipante</li>
                </ul>
              </li>
            </ol>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <p class="text-sm text-yellow-800">Importante: La registrazione al viaggio implica l'accettazione automatica di questi termini e condizioni.</p>
            </div>
          </div>
        `
      }
    };

    res.json(legalDocs);
  } catch (error) {
    console.error('Error in getLegalDocuments:', error);
    res.status(500).json({ msg: 'Errore nel recupero dei documenti legali' });
  }
};