const countdown = document.getElementById("countdown");
const countdownLabel = document.querySelector(".countdown-content p:nth-of-type(1)");
let raceDate = null;

async function fetchRaceData() {
  try {
    const response = await fetch("https://f1api.dev/api/current/next");
    const data = await response.json();
    const raceInfo = data.race[0];
    const schedule = raceInfo.schedule;

    // Cerca la prossima sessione disponibile
    const nextSession = getNextSession(schedule);

    if (!nextSession) {
      countdown.textContent = "Nessuna sessione disponibile";
      countdownLabel.textContent = "Prossima sessione: --";
      return;
    }

    // Imposta la data per il countdown
    raceDate = new Date(`${nextSession.date}T${nextSession.time}`);
    updateCountdown();

    // Aggiorna i contenuti dinamici
    document.querySelector(".countdown-content h2").textContent = raceInfo.raceName.toUpperCase();
    document.querySelector(".countdown-content h3").textContent = `${raceInfo.circuit.circuitName}`;
    
    const driverId = raceInfo.circuit.fastestLapDriverId;
    const driverName = await getDriverFullName(driverId);

    document.querySelector(".countdown-content p:nth-of-type(3)").textContent =
    `Record giro: ${raceInfo.circuit.lapRecord} – ${driverName} (${raceInfo.circuit.fastestLapYear})`;


    // Mostra il nome della sessione
    countdownLabel.textContent = `Prossima sessione: ${nextSession.label}`;

  } catch (error) {
    console.error("Errore nel caricamento dati API:", error);
  }
}

async function getDriverFullName(driverId) {
  try {
    const response = await fetch(`https://f1api.dev/api/drivers/${driverId}`);
    const data = await response.json();
    const driver = data.driver[0];
    return `${driver.name} ${driver.surname}`;
  } catch (error) {
    console.error("Errore nel recupero dati pilota:", error);
    return driverId;
  }
}


function getNextSession(schedule) {
  const now = new Date();
  const order = [
    { key: "fp1", label: "FP1" },
    { key: "fp2", label: "FP2" },
    { key: "fp3", label: "FP3" },
    { key: "qualy", label: "Qualifiche" },
    { key: "sprintQualy", label: "Qualifiche Sprint" },
    { key: "sprintRace", label: "Gara Sprint" },
    { key: "race", label: "Gara" }
  ];

  for (const session of order) {
    const item = schedule[session.key];
    if (item?.date && item?.time) {
      const sessionTime = new Date(`${item.date}T${item.time}`);
      if (sessionTime > now) {
        return {
          date: item.date,
          time: item.time,
          label: session.label
        };
      }
    }
  }
  return null;
}

function updateCountdown() {
  if (!raceDate) return;

  const now = new Date();
  const diff = raceDate - now;

  if (diff <= 0) {
    countdown.textContent = "La sessione è iniziata!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.textContent = `${days}g ${hours}h ${minutes}min ${seconds}s`;
}

async function aggiornaMeteo() {
  try {
    // Ottieni dati F1 e coordinate circuito
    const res = await fetch("https://f1api.dev/api/current/next");
    const data = await res.json();
    const raceInfo = data.race[0];
    const circuito = raceInfo.circuit;
    const nomeCircuito = circuito.circuitName;

    const coord = coordinateCircuiti[nomeCircuito];
    if (!coord) {
      document.querySelector(".countdown-content p:nth-of-type(2)").textContent =
        `Coordinate non disponibili per ${nomeCircuito} 🧐`;
      return;
    }

    // Ottieni la prossima sessione
    const nextSession = getNextSession(raceInfo.schedule);
    if (!nextSession) {
      document.querySelector(".countdown-content p:nth-of-type(2)").textContent =
        `Nessuna sessione disponibile`;
      return;
    }

    // Richiedi previsione meteo per l’orario esatto della sessione
    const meteoRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&hourly=temperature_2m,weathercode&start=${nextSession.date}T${nextSession.time}&end=${nextSession.date}T${nextSession.time}&timezone=auto`
    );
    const meteoData = await meteoRes.json();

    const temperatura = meteoData.hourly?.temperature_2m?.[0];
    const codice = meteoData.hourly?.weathercode?.[0];

    const meteoBox = document.querySelector(".countdown-content p:nth-of-type(2)");

    if (temperatura === undefined || codice === undefined) {
      meteoBox.textContent = `Meteo non disponibile per ${nextSession.label}`;
      return;
    }

    const descrizione = descrizioneMeteo(codice);

    meteoBox.textContent = `Meteo previsto: ${descrizione} ${temperatura}°C`;

  } catch (error) {
    console.error("Errore nel recupero meteo:", error);
    document.querySelector(".countdown-content p:nth-of-type(2)").textContent =
      `Errore nel caricamento meteo ⛅`;
  }
}



const coordinateCircuiti = {
  "Hungaroring": { lat: 47.5789, lon: 19.2486 }, // Mogyoród, Hungary
  "Silverstone Circuit": { lat: 52.0733, lon: -1.0147 },
  "Suzuka International Racing Course": { lat: 34.8431, lon: 136.5414 },
  "Circuit de Monaco": { lat: 43.7347, lon: 7.4206 },
  "Monza": { lat: 45.6156, lon: 9.2811 }
  // Aggiungine altri se vuoi più circuiti supportati!
};



function descrizioneMeteo(codice) {
  const dizionario = {
    0: "☀️ Soleggiato -",
    1: "🌤️ Parzialmente nuvoloso -",
    2: "⛅ Nuvoloso -",
    3: "☁️ Coperto -",
    45: "🌫️ Nebbia -",
    51: "🌦️ Pioggia leggera -",
    61: "🌧️ Pioggia -",
    71: "🌨️ Neve -",
    80: "⛈️ Rovesci -"
  };
  return dizionario[codice] || "🤷‍♂️ Meteo ignoto";
}


fetchRaceData();
setInterval(updateCountdown, 1000);
aggiornaMeteo();


// script.js
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "index.html";
});
