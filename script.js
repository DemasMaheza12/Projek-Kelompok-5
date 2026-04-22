const movie = document.querySelectorAll('.film');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const genreText = document.querySelector('.genre');
const titleText = document.querySelector('.title');

const dataMovie = [
  {title: "Dilan 1991", genre: "Drama, Romance"},
  {title: "Be With You", genre: "Fantasy, Romance"},
  {title: "Tak Ingin Usai di Sini", genre: "Drama, Romance"},
  {title: "Na Willa ", genre: "Drama, Musical"},
  {title: "Sore: Istri dari Masa Depan", genre: "Romance, Fantasy"},
  {title: "Danur: The Last Chapter", genre: "Horror, Supranatural"},
  {title: "The Call", genre: "Horror, Mystery"},
  {title: "Elf", genre: "Comedy, Fantasy"},
  {title: "Tunggu Aku Sukses Nanti", genre: "Drama, Comedy"},
  {title: "Humint", genre: "Action, Thriller"},
  {title: "5cm", genre: "Drama, Adventure"},
  {title: "Azzamine", genre: "Drama, Romance"},
  // {title: "Tak Ingin Usai di Sini", genre: "Drama, Romance"},
];

let currentIndex = 1;

function updateCarousel() {
  let total = movie.length;

  let prev3Index = (currentIndex - 3 + total) % total;
  let prev2Index = (currentIndex - 2 + total) % total;
  let prevIndex = (currentIndex - 1 + total) % total;
  let nextIndex = (currentIndex + 1) % total;
  let next2Index = (currentIndex + 2) % total;
  let next3Index = (currentIndex + 3) % total;



  // let prevIndex = currentIndex - 1;

  // if (prevIndex < 0) prevIndex = movie.length - 1;

  // let nextIndex = currentIndex + 1;

  // if(nextIndex > movie.length - 1) nextIndex = 0;

  movie.forEach(card => {
    card.className = 'film';
  });



  movie[prev3Index].classList.add('hilang-kiri');
  movie[prev2Index].classList.add('kiri-luar');
  movie[prevIndex].classList.add('kiri');
  movie[currentIndex].classList.add('tengah');
  movie[nextIndex].classList.add('kanan');
  movie[next2Index].classList.add('kanan-luar');
  movie[next3Index].classList.add('hilang-kanan');


  // movie[currentIndex].classList.add('aktif');

  genreText.textContent = dataMovie[currentIndex].genre;
  titleText.textContent = dataMovie[currentIndex].title;
}

updateCarousel();

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % movie.length;
  updateCarousel();

  jadwalMenu.classList.remove('tampil');
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + movie.length) % movie.length;
  updateCarousel();

  jadwalMenu.classList.remove('tampil');
});

const tombolPesan = document.querySelector('.btn-pesan');
const jadwalMenu = document.querySelector('.jadwal-menu');

tombolPesan.addEventListener('click', () => {
  jadwalMenu.classList.toggle('tampil');
});