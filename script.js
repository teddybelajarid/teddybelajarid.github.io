const sites = [
  {
    title: "OpenAI",
    url: "https://openai.com",
    thumbnail: "https://image.thum.io/get/width/800/https://openai.com"
  },
  {
    title: "Wikipedia",
    url: "https://wikipedia.org",
    thumbnail: "https://image.thum.io/get/width/800/https://wikipedia.org"
  },
  {
    title: "Khan Academy",
    url: "https://khanacademy.org",
    thumbnail: "https://image.thum.io/get/width/800/https://khanacademy.org"
  }
];

const carousel = document.getElementById('carousel');
let currentIndex = 0;

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

function renderSlides() {
  sites.forEach(site => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    slide.innerHTML = `
      <img class="thumbnail" src="${site.thumbnail}" alt="${site.title}" />
      <div class="caption">
        <h3>${site.title}</h3>
        <a href="${site.url}" target="_blank">${site.url}</a>
      </div>
    `;

    carousel.appendChild(slide);
  });
}

document.getElementById('next').addEventListener('click', () => {
  if (currentIndex < sites.length - 1) {
    currentIndex++;
    showSlide(currentIndex);
  }
});

document.getElementById('prev').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
  }
});

renderSlides();
