import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import Event from '../server/models/Event.mjs';
import Flight from '../server/models/Flight.mjs';
import Photo from '../server/models/Photo.mjs';
import EmergencyContact from '../server/models/EmergencyContact.mjs';

async function verifyData() {
  try {
    await connectDB();
    
    // Aspetta un momento per assicurarsi che la connessione sia stabile
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Connected to MongoDB');

    // Verifica i dati importati
    console.log('\nVerifica dei dati importati:');
    
    const events = await Event.find();
    console.log(`\nEventi trovati: ${events.length}`);
    if (events.length > 0) {
      const event = events[0];
      console.log('\nDettagli Evento:');
      console.log('Titolo:', event.title);
      console.log('Sottotitolo:', event.subtitle);
      console.log('Deadline registrazione:', event.registrationDeadline);
      
      console.log('\nAgenda:');
      event.agenda.forEach(day => {
        console.log(`\nGiorno ${day.day}: ${day.title} - ${day.date}`);
        day.items.forEach(item => {
          console.log(`- [${item.time}] ${item.title} (${item.category})`);
          if (item.description) {
            console.log(`  ${item.description.slice(0, 100)}...`);
          }
        });
      });
    }
    
    const flights = await Flight.find();
    console.log(`\nVoli trovati: ${flights.length}`);
    
    // Raggruppa i voli per città di partenza
    const flightsByGroup = flights.reduce((groups, flight) => {
      const group = flight.departureGroup;
      if (!groups[group]) {
        groups[group] = { outbound: [], return: [] };
      }
      groups[group][flight.direction].push(flight);
      return groups;
    }, {});

    // Mostra i voli raggruppati
    for (const group in flightsByGroup) {
      console.log(`\n=== Voli ${group} ===`);
      
      console.log('\nAndata:');
      flightsByGroup[group].outbound.forEach(flight => {
        console.log(`${flight.airline} ${flight.flightNumber}`);
        console.log(`Da: ${flight.departure.airport} (${flight.departure.code}) - ${flight.departure.time}`);
        console.log(`A:  ${flight.arrival.airport} (${flight.arrival.code}) - ${flight.arrival.time}`);
        console.log(`Durata: ${flight.duration}\n`);
      });
      
      console.log('Ritorno:');
      flightsByGroup[group].return.forEach(flight => {
        console.log(`${flight.airline} ${flight.flightNumber}`);
        console.log(`Da: ${flight.departure.airport} (${flight.departure.code}) - ${flight.departure.time}`);
        console.log(`A:  ${flight.arrival.airport} (${flight.arrival.code}) - ${flight.arrival.time}`);
        console.log(`Durata: ${flight.duration}\n`);
      });
    }
    
    const photos = await Photo.find();
    console.log(`\nFoto trovate: ${photos.length}`);
    
    const contacts = await EmergencyContact.find();
    console.log(`\nContatti di emergenza trovati: ${contacts.length}`);

  } catch (error) {
    console.error('Error verifying data:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
    }
    // Forza la chiusura del processo
    process.exit(0);
  }
}

verifyData();