const movies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    rating: "8.8",
    description: "A thief enters dreams to steal secrets and perform one impossible heist.",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: "9.0",
    description: "Batman confronts the Joker as chaos spreads across Gotham City.",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: "8.7",
    description: "Astronauts search for humanity's new home beyond a collapsing Earth.",
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    rating: "8.5",
    description: "A poor family schemes to work for a wealthy household, with dark consequences.",
  },
  {
    id: 5,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Comedy",
    rating: "8.1",
    description: "A concierge and his protégé become embroiled in a priceless painting theft.",
  },
  {
    id: 6,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    genre: "Animation",
    rating: "8.4",
    description: "Miles Morales discovers multiple Spider-People from parallel universes.",
  },
];

const favoriteKey = "movies_app_favorites";
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const favoritesToggle = document.getElementById("favoritesToggle");
const movieGrid = document.getElementById("movieGrid");
const resultsTitle = document.getElementById("resultsTitle");
const template = document.getElementById("movieCardTemplate");

let favorites = new Set(JSON.parse(localStorage.getItem(favoriteKey) ?? "[]"));
let showFavoritesOnly = false;

function saveFavorites() {
  localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
}

function populateGenres() {
  const genres = [...new Set(movies.map((movie) => movie.genre))].sort();
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.append(option);
  });
}

function toggleFavorite(movieId) {
  if (favorites.has(movieId)) {
    favorites.delete(movieId);
  } else {
    favorites.add(movieId);
  }

  saveFavorites();
  renderMovies();
}

function renderMovies() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filtered = movies.filter((movie) => {
    const bySearch =
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm) ||
      String(movie.year).includes(searchTerm);
    const byGenre = selectedGenre === "all" || movie.genre === selectedGenre;
    const byFavorites = !showFavoritesOnly || favorites.has(movie.id);

    return bySearch && byGenre && byFavorites;
  });

  resultsTitle.textContent = showFavoritesOnly ? "Favorite movies" : "All movies";
  movieGrid.innerHTML = "";

  if (!filtered.length) {
    movieGrid.innerHTML = '<p class="empty-state">No movies match your filters.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((movie) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector(".movie-card__title").textContent = movie.title;
    card.querySelector(".movie-card__year").textContent = movie.year;
    card.querySelector(".movie-card__meta").textContent = `${movie.genre} • ⭐ ${movie.rating}`;
    card.querySelector(".movie-card__description").textContent = movie.description;

    const favoriteButton = card.querySelector(".favorite-button");
    const isFavorite = favorites.has(movie.id);
    favoriteButton.textContent = isFavorite ? "★ Remove favorite" : "☆ Add favorite";
    favoriteButton.classList.toggle("is-favorite", isFavorite);
    favoriteButton.addEventListener("click", () => toggleFavorite(movie.id));

    fragment.append(card);
  });

  movieGrid.append(fragment);
}

searchInput.addEventListener("input", renderMovies);
genreFilter.addEventListener("change", renderMovies);
favoritesToggle.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favoritesToggle.setAttribute("aria-pressed", String(showFavoritesOnly));
  favoritesToggle.textContent = showFavoritesOnly ? "Showing favorites only" : "Show favorites only";
  renderMovies();
});

populateGenres();
renderMovies();
