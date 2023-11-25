const movie = document.querySelector(".movies")
const form = document.querySelector("form");
const search = document.querySelector(".search__input");
const month = document.getElementById("mounth-premier");
const expected = document.getElementById("top-expected")
const relize_for_month = document.getElementById("mounth-reliz");
const best = document.getElementById("top-best")
const favorite = document.getElementById("favorite");
const buttons = document.querySelectorAll(".nav-bar__button");
    

document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = "3d73b662-f1b3-4b82-9e6a-33a349d1d4dd";
    const API =
      "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
    const SEARCH_API =
      "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
    const MOUNTH_API =
      "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=";
    const MOUNTH_RELIZE =
      "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=";
    const YEAR_RELIZE =
      "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=";

      function getParam(data) {
        if (data.films) {
          return data.films;
        } else if (data.items) {
          return data.items;
        } else {
          return data.releases;
        }
      }
      
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
        });
      });
      
      getLocal();
      
      getMovie(API);
      
      async function getMovie(url) {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "X-API-KEY": API_KEY,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          movieList(getParam(data));
      }
      
      function createMovieCard(elem) {
          const createEl = (tag, className) => {
            const el = document.createElement(tag);
            el.className = className;
            return el;
          };
        
          const card = createEl("div", "movie");
          const coverInner = createEl("div", "movie__cover-inner");
          const cover = createEl("img", "movie__cover");
          const coverEffect = createEl("div", "movie__cover--effect");
          const info = createEl("div", "movie-info");
          const [info__left, info__right] = ["movie-info__left", "movie-info__right"].map((className) => createEl("div", className));
          const [title, category, average, favorite__heart] = ["movie__title", "movie__category", "movie__avarage movie__avarage--green", "favorite-movie"].map((className) => createEl("div", className));
        
          cover.src = elem.posterUrl;
          title.textContent = elem.nameRu;
          category.textContent = elem.genres[0].genre;
          average.textContent = elem.rating;
        
          coverInner.append(cover, coverEffect);
          info.append(info__left, info__right, average);
          info__left.append(title, category);
          info__right.appendChild(favorite__heart);
          card.append(coverInner, info);
        
          const heartSrc = isFavorite(elem) 
          ? "media/heart.png" 
          : "media/empty-heart.png";
          favorite__heart.src = heartSrc;
        
          favorite__heart.addEventListener("click", () => {
            toggleFavorite(elem);
            favorite__heart.src = isFavorite(elem) 
            ? "media/heart.png" 
            : "media/empty-heart.png";
          });
        
          return card;
        }
      
      function getLocal() {
        if (!localStorage.getItem("films")) {
          localStorage.setItem("films", JSON.stringify([]));
        }
      }
      
      function movieList(data) {  
          movie.innerHTML = "";
        
          data.forEach((elem) => {
            let card = createMovieCard(elem);
            if (movie) {
              movie.appendChild(card);
            } 
          });
        }
      
      function isFavorite(elem) {
        let data = JSON.parse(localStorage.getItem("films")) || [];
        return data.findIndex((item) => item.filmId === elem.filmId) !== -1;
      }
      
      function toggleFavorite(elem) {
        let data = JSON.parse(localStorage.getItem("films")) || [];
        const existingFilmIndex = data.findIndex((item) => {
          if (item.filmId) {
            return item.filmId === elem.filmId;
          } else {
            return item.kinopoiskId === elem.kinopoiskId;
          }
        });
      
        if (existingFilmIndex !== -1) {
          data.splice(existingFilmIndex, 1);
        } else {
          data.push(elem);
        }
      
        localStorage.setItem("films", JSON.stringify(data));
      }
      
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (search.value) {
          let NEW_URL = `${SEARCH_API}${search.value}`;
          getMovie(NEW_URL);
        }
      });
      
      function getCurrentMonth() {
        return new Date().toLocaleString("en-US", { month: "long" });
      }
      
      month.addEventListener("click", () => {
        let newMonth = getCurrentMonth();
        getMovie(`${MOUNTH_API}${new Date().getFullYear()}&month=${newMonth}`);
      });
      
      relize_for_month.addEventListener("click", () => {
        let newMonth = getCurrentMonth();
        getMovie(`${MOUNTH_RELIZE}${new Date().getFullYear()}&month=${newMonth}&page=1`);
      });
      
      best.addEventListener("click", () => {
        getMovie(API);
      });
      
      expected.addEventListener("click", () => {
        getMovie(`${YEAR_RELIZE}${new Date().getFullYear() + 1}&month=JANUARY`);
      });
      
      favorite.addEventListener("click", () => {
        let data = JSON.parse(localStorage.getItem("films")) || [];
        movieList(data);
      });
});