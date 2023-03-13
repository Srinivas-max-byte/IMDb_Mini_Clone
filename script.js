const logo = document.getElementById("Logo");
const searchTextArea = document.getElementById("search-text-area");
const searchBtn = document.getElementById("search-btn");
const searchResultDisplay = document.getElementById("search-results");
const searchDiv = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-text");
const movieInfo = document.getElementById("movie-info");
const favSection = document.getElementById("fav-section");
const hideFavourites = document.getElementById("close-Favourites");
const favDiv = document.getElementById("Favourites");

// Function for finding movies by taking text inside search box then removing white-spaces and chaging semantics of search bar
// and search result div.
function findMovies() {
  clearBtn.style.display = "inline";
  searchDiv.style.top = "30%";
  searchDiv.style.left = "50%";
  logo.style.top = "10%";
  logo.style.left = "50%";
  logo.style.width = "30vw";
  logo.style.height = "15vh";
  movieInfo.classList.add("hide-search-list");
  movieInfo.style.top = "100%";
  movieInfo.style.left = "0%";
  let searchMovie = searchTextArea.value.trim();
  if (searchMovie.length > 0) {
    searchDiv.style.borderRadius = "5px";
    searchResultDisplay.classList.remove("hide-search-list");
    loadMovies(searchMovie);
  } else {
    searchDiv.style.borderRadius = "15px";
    searchResultDisplay.classList.add("hide-search-list");
  }
}
//Making an async API call using fetch and if the returned promise has data then displaying the search results.
async function loadMovies(searchMovie) {
  await fetch(`https://omdbapi.com/?s=${searchMovie}&page=1&apikey=94397865`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") displayMovieList(data.Search);
    });
}

// Array of movie data results is used one by one to show the results by creating div to be appended in results.
function displayMovieList(movies) {
  // searchBoxBoderTrigger();
  searchResultDisplay.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.poster = movies[idx].Poster; //settting url of poster in data-poster. 
    movieListItem.dataset.id = movies[idx].imdbID; //setting movie id in data-id.
    movieListItem.classList.add("search-results-item");

    // Hits another API where Actors working in the film are stored
    fetch(`http://www.omdbapi.com/?i=${movies[idx].imdbID}&apikey=94397865`)
      .then((response) => response.json())
      .then((data) => {
        let moviePoster;
        if (movies[idx].Poster !== "N/A") moviePoster = movies[idx].Poster;
        else moviePoster = "notfound.png";
        //defining the inner html content to be displayed inside results div.
        movieListItem.innerHTML = `
              <img src="${moviePoster}">
              <div onclick="movieDetails()">
                <p class="dark-color">${movies[idx].Title}</p>
                <p class="light-color">${movies[idx].Year}</p>
                <p class="light-color">${data.Actors}</p>
              </div>
              <p style="font-size: x-large;">|</p>
              <i class="fa-regular fa-heart" onclick="fav(this)"></i>
              `;
      });
    // Appending the divs to result section.
    searchResultDisplay.appendChild(movieListItem);
  }
}

// Function to clear the text inside text box.
function clearText(){
  clearBtn.style.display = "none";
  searchResultDisplay.classList.add("hide-search-list");
  searchTextArea.value = '';
}
// Function to show details of a movie along with some animations to be done.
function movieDetails() {
  resetBars();
  loadMovieDetails();  
}
// Used to load the data of a movie by hitting API with 'i' selector inside URL specifying the IMDb ID.
function loadMovieDetails(){
  const searchListMovies = searchResultDisplay.querySelectorAll('.search-results-item');
  searchListMovies.forEach(movie => {
      movie.addEventListener('click', () => {
          fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=94397865`)
          .then((response) => response.json())
          .then((data) => {
              displayMovieDetails(data);
          });
      });
  });
}
// Incorporating the innert html elements and showcasing the movie details by appending it to the movie-info div.
function displayMovieDetails(details){
  movieInfo.innerHTML = `
  <div id = "movie-image">
      <img src = "${(details.Poster != "N/A") ? details.Poster : "notFound.jfif"}" alt = "movie poster" class="rounded shadow-2xl">
  </div>
  <div id = "movie-info-desc">
      <h1 class = "movie-title dark-color">${details.Title}</h1>
      <p class = "dark-color">Year: ${details.Year} &nbsp;<span class=" bg-yellow-500 p-1 rounded">Rating: ${details.Rated}</span> &nbsp;Released: ${details.Released}</p>
      <p class="rounded shadow-md bg-zinc-700 p-1.5 w-fit dark-color"><span>Genere:</span> ${details.Genre}</p>
      <p class = "dark-color"><span class = "dark-color">Writer:</span> ${details.Writer}</p>
      <p class = "dark-color"><span class = "dark-color">Actors:</span> ${details.Actors}</p>
      <p class = "dark-color"><span class = "dark-color">Plot:</span> ${details.Plot}</p>
      <p class="italic mv-lang" class = "dark-color"><span class = "dark-color">Language: </span>${details.Language}</p>
      <p class = "dark-color"><span class = "dark-color"><i class="fa-solid fa-award"></i></span>&nbsp;&nbsp;  ${details.Awards}</p>
      <p class = "dark-color"><span class = "dark-color">IMDb Rating</span>&nbsp;&nbsp;  ${details.imdbRating}</p>
  </div>
  `;
  movieInfo.style.top = "20%";
  movieInfo.style.left = "10%";
  movieInfo.classList.remove("hide-search-list");
}

// Function to reset searchbar to it's initial state
function resetBars() {
  searchTextArea.value = "";
  searchDiv.style.top = "2%";
  searchDiv.style.left = "40%";
  logo.style.top = "2%";
  logo.style.left = "6%";
  logo.style.width = "10vw";
  logo.style.height = "0.8cm";
  searchResultDisplay.classList.add('hide-search-list');
}
// Function includes transition animations while opening of Favourite div and showing movies in that div.
function showFavouties(){
  favSection.style.width = "60vw";
  favSection.style.height = "75vh";
  favSection.style.top = "20%";
  favSection.style.right = "20%";
  hideFavourites.style.top = "5%";
  favDiv.style.top = "-10%";
  showFavList();
}
// Function includes transition animations while closing of Favourite div and showing movies in that div.
function closeFavouties(){
  favSection.style.width = "0vw";
  favSection.style.height = "0vh";
  favSection.style.top = "5%";
  favSection.style.right = "10%";
  hideFavourites.style.top = "-50%";
  favDiv.style.top = "2%";
  exitFavPage();
}

// Favourite func called when user clicks on fav icon for a movie.
function fav(data) {
  let arr = JSON.parse(localStorage.getItem("movies"));
  if(arr == null)
  {
    makeFavList(data.parentNode.dataset.poster);
  }
  else{
    for(let i=0;i<arr.length;i++){
      if(arr[i] == data.parentNode.dataset.poster)
      {
        window.alert("Movie already present in Favourites");
        return;
      }
    }
    makeFavList(data.parentNode.dataset.poster);
  }
}
// Adding POster url of fav movie to local storage for storing a list of fav movies.
function makeFavList(posterURL) {
  if(localStorage.length == 0) {
      movies = [];
      movies.push(posterURL);
      localStorage.setItem("movies", JSON.stringify(movies));
      window.alert("Movie added to Favourites")
  }
  else {
      movies = JSON.parse(localStorage.getItem("movies"));
      movies.push(posterURL);
      localStorage.setItem("movies", JSON.stringify(movies));
  }    
}
//Function used to clear all fav movies.
function clearList() {
  exitFavPage();
  localStorage.clear();
}
// Resetting the innerHtml contents when closing the Favourite Movies division.
function exitFavPage() {
  favSection.innerHTML = `<div id="fav-section-head" style="margin-top: 10px;">
  <i class="fa-solid fa-heart">Favourite Movies</i>
  <i class="fa-solid fa-broom" onclick="clearList()" style="cursor:pointer">Clear All</i>
</div>`;
}
// Removing the URL of poster stored against the index( Id in this case) of the movie from array stored in local storage and 
// resetting the inner HTML content.
function removeMovie(idx) {
  let arr = JSON.parse(localStorage.getItem("movies"));
  arr.splice(idx, 1);
  localStorage.setItem("movies", JSON.stringify(arr));
  favSection.innerHTML = `<div id="fav-section-head" style="margin-top: 10px;">
  <i class="fa-solid fa-heart">Favourite Movies</i>
  <i class="fa-solid fa-broom" onclick="clearList()" style="cursor:pointer">Clear All</i>
  </div>`;
  if(arr.length == 0) {
      favSection.innerHTML = `<div id="fav-section-head">
      <h2>Favourites</h2>
      <span onclick="clearList()">Clear All</span>
    </div>`;
    exitFavPage();
  }
  showFavList();
}
// Creating a div and adding favourite movie info inside it by fetching it from the local storage.
function showFavList(){
  let arr = JSON.parse(localStorage.getItem("movies"));
  // console.log(arr);
  if(arr == null || arr.length == 0) {
      window.alert("You've not added any movie into the list yet.");
      return;
  }
  for (var i = 0; i < arr.length; i++) {
      let movieListItem = document.createElement('div');
      movieListItem.dataset.id = i;
      movieListItem.classList.add('fav-movie-item');
      movieListItem.innerHTML = 
        `<img src="${arr[i]}">
        <i class="fa-solid fa-trash" onclick="removeMovie(${i})">  Remove</i>`;//Here removeMovie is called when clicken on Remove iCon.
        favSection.appendChild(movieListItem);
  }
}