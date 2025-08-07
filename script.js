const websites = [
  "https://teddybelajarid.github.io/web1",
  "https://teddybelajarid.github.io/web2",
  "https://teddybelajarid.github.io/web3",
  "https://teddybelajarid.github.io/web4"
];

const carousel = document.getElementById("carousel");
let currentIndex = 0;

async function fetchPreview(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`;
  const response = await fetch(api);
  const data = await response.json();
  return {
    title: data.data.title,
    image: data.data.screenshot.url,
    url: data.data.url
  };
}

async function renderSlides() {
  for (let site of websites) {
    const preview = await fetchPreview(site);
    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
      <img src="${preview.image}" alt="${preview.title}" />
      <div class="caption">
        <h3>${preview.title}</h3>
        <a href="${preview.url}" target="_blank">${preview.url}</a>
      </div>
    `;
    carousel.appendChild(slide);
  }
}

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

document.getElementById("next").addEventListener("click", () => {
  if (currentIndex < websites.length - 1) {
    currentIndex++;
    showSlide(currentIndex);
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
  }
});

renderSlides();
