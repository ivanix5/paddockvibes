async function fetchClassificaPiloti() {
  try {
    const response = await fetch('https://f1api.dev/api/2025/drivers-championship');
    const data = await response.json();

    const pilotiList = document.querySelector('#piloti .ranking-list');
    pilotiList.innerHTML = '';

    data.drivers_championship.forEach(pilota => {
      const fullName = `${pilota.driver.name} ${pilota.driver.surname}`;
      const teamName = pilota.team.teamName;
      const displayTeamName = getDisplayTeamName(teamName);
      const punti = pilota.points;
      const posizione = pilota.position;
      const logoSrc = `images/teams/${getTeamLogo(teamName)}`;
      const teamClass = getTeamClass(teamName) || 'team-unknown';

      const li = document.createElement('li');
      li.classList.add(teamClass);
      li.innerHTML = `
        <span class="pos">${posizione}°</span>
        <img src="${logoSrc}" alt="${displayTeamName} logo" class="team-logo" />
        <span class="driver-name">${fullName}</span>
        <span class="team-name-driver">${displayTeamName}</span>
        <span class="driver-points">${punti} </span>
      `;
      pilotiList.appendChild(li);
    });
  } catch (error) {
    console.error("Errore nel caricamento dati piloti:", error);
  }
}



async function fetchClassificaCostruttori() {
  try {
    const response = await fetch('https://f1api.dev/api/2025/constructors-championship');
    const data = await response.json();

    const teamList = document.querySelector('#costruttori .ranking-list');
    teamList.innerHTML = '';

    data.constructors_championship.forEach(team => {
      const teamName = team.team.teamName;
      const displayTeamName = getDisplayTeamName(teamName);
      const points = team.points;
      const position = team.position;
      const logoSrc = `images/teams/${getTeamLogo(teamName)}`;
      const teamClass = getTeamClass(teamName) || 'team-unknown';

      const li = document.createElement('li');
      li.classList.add(teamClass);
      li.innerHTML = `
        <span class="pos">${position}°</span>
        <img src="${logoSrc}" alt="${displayTeamName} logo" class="team-logo" />
        <span class="team-name">${displayTeamName}</span>
        <span class="team-points">${points} </span>
      `;
      teamList.appendChild(li);
    });
  } catch (error) {
    console.error("Errore nel caricamento dati costruttori:", error);
  }
}


function showTab(tabId, event) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function getTeamLogo(teamName) {
  switch (teamName) {
    case 'Scuderia Ferrari':
      return 'FERRARI.png';
    case 'McLaren Formula 1 Team':
      return 'McLAREN - White.png';
    case 'Red Bull Racing':
      return 'RED BULL.png';
    case 'RB F1 Team':
      return 'RACING BULLS - White.png';
    case 'Mercedes Formula 1 Team':
      return 'MERCEDES.png';
    case 'Williams Racing':
      return 'WILLIAMS - White.png';
    case 'Sauber F1 Team':
      return 'KICK SAUBER - Black.png';
    case 'Haas F1 Team':
      return 'HAAS.png';
    case 'Alpine F1 Team':
      return 'ALPINE - White.png';
    case 'Aston Martin F1 Team':
      return 'ASTON MARTIN.png';
    default:
      return 'F1.png'; // Un logo generico
  }
}


function getTeamClass(teamName) {
  switch (teamName) {
    case 'Scuderia Ferrari':
      return 'ferrari';
    case 'McLaren Formula 1 Team':
      return 'mclaren';
    case 'Red Bull Racing':
    return 'redbull';
    case 'RB F1 Team':
      return 'rb';
    case 'Mercedes Formula 1 Team':
      return 'mercedes';
    case 'Williams Racing':
      return 'williams';
    case 'Sauber F1 Team':
      return 'sauber';
    case 'Haas F1 Team':
      return 'haas';
    case 'Alpine F1 Team':
      return 'alpine';
    case 'Aston Martin F1 Team':
      return 'astonmartin';
    default:
      return 'team-unknown'; // fallback sicuro
  }
}

function getDisplayTeamName(teamName) {
  switch (teamName) {
    case 'Scuderia Ferrari':
      return 'FERRARI';
    case 'McLaren Formula 1 Team':
      return 'McLAREN';
    case 'Red Bull Racing':
      return 'RED BULL';
    case 'RB F1 Team':
      return 'RACING BULLS';
    case 'Mercedes Formula 1 Team':
      return 'MERCEDES';
    case 'Williams Racing':
      return 'WILLIAMS';
    case 'Sauber F1 Team':
      return 'KICK SAUBER';
    case 'Haas F1 Team':
      return 'HAAS';
    case 'Alpine F1 Team':
      return 'ALPINE';
    case 'Aston Martin F1 Team':
      return 'ASTON MARTIN';
    default:
      return teamName;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  fetchClassificaPiloti();
  fetchClassificaCostruttori();
});


// script.js
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "index.html";
});
