#!/bin/bash

# Colori per i messaggi
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verifica se Docker è in esecuzione
echo -e "${BLUE}Verifico se Docker è in esecuzione...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo "Docker non è in esecuzione. Avvialo prima di procedere."
    exit 1
fi

# Verifica se il container MongoDB è in esecuzione
echo -e "${BLUE}Verifico il container MongoDB...${NC}"
if ! docker ps | grep -q travel-db; then
    echo -e "${BLUE}Avvio il container MongoDB...${NC}"
    docker start travel-db || docker run -d -p 27017:27017 --name travel-db mongo:latest
fi

# Funzione per terminare tutti i processi quando lo script viene interrotto
cleanup() {
    echo -e "\n${BLUE}Arresto delle applicazioni...${NC}"
    kill $NODE_PID $VITE_PID 2>/dev/null
    rm -f .vite_output
    exit 0
}

# Imposta il gestore di interruzione
trap cleanup SIGINT SIGTERM

# Memorizza la directory del progetto
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Avvia il server Express
echo -e "${BLUE}Avvio il server Express...${NC}"
cd "$PROJECT_DIR/server" && node server.js > /dev/null 2>&1 & NODE_PID=$!

# Attendi qualche secondo per assicurarti che il server sia pronto
sleep 2

# Avvia l'applicazione React e cattura l'URL
echo -e "${BLUE}Avvio l'applicazione frontend...${NC}"
cd "$PROJECT_DIR"

# Pulisci eventuali file di output precedenti
rm -f .vite_output

# Avvia npm run dev e monitora l'output
npm run dev > .vite_output 2>&1 & VITE_PID=$!

# Attendi che Vite mostri l'URL (massimo 10 secondi)
COUNTER=0
while [ $COUNTER -lt 10 ]; do
    if grep -q "Local:" .vite_output; then
        FRONTEND_URL=$(grep "Local:" .vite_output | grep -o 'http://localhost:[0-9]*')
        break
    fi
    sleep 1
    COUNTER=$((COUNTER + 1))
done

# Mostra l'output di Vite in tempo reale
tail -f .vite_output &
TAIL_PID=$!

# Stampa le informazioni di accesso
echo -e "\n${GREEN}=== Applicazione Avviata ===${NC}"
echo -e "${GREEN}Frontend: $FRONTEND_URL${NC}"
echo -e "${GREEN}Backend: http://localhost:5001${NC}"
echo -e "\n${GREEN}Credenziali di accesso:${NC}"
echo -e "Email: test@example.com"
echo -e "Password: password123"
echo -e "\n${BLUE}Premi Ctrl+C per terminare tutte le applicazioni${NC}"

# Attendi che uno dei processi termini
wait $NODE_PID