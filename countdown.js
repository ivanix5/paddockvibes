// countdown.js
const countdown = document.getElementById("countdown");
const raceDate = new Date("2025-08-31T15:00:00Z"); // Esempio: data GP

function updateCountdown() {
  const now = new Date();
  const diff = raceDate - now;

  if (diff <= 0) {
    countdown.textContent = "La gara è iniziata!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.textContent = `${days}g ${hours}h ${minutes}min ${seconds}s`;
}

setInterval(updateCountdown, 1000);

// script.js
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "index.html";
});
