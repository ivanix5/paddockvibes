document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const leftBtn = document.querySelector(".nav-button.left");
  const rightBtn = document.querySelector(".nav-button.right");
  let currentIndex = 0;

  function showSlide(index) {
    const track = document.querySelector(".slider-track");
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  leftBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  rightBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });
});
