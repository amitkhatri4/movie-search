const movieList = document.getElementById('movieList');
const movieForm = document.getElementById('movieForm');
const titleInput = document.getElementById('titleInput');
const genreInput = document.getElementById('genreInput');
const directorInput = document.getElementById('directorInput');
const releaseYearInput = document.getElementById('releaseYearInput');
const addMovieButton = document.getElementById('addMovieButton');

const API_URL = 'http://localhost:3000/movies';

// Function to fetch movies
const fetchMovies = async () => {
  try {
    const response = await fetch(API_URL);
    const movies = await response.json();

    displayMovies(movies);
  } catch (error) {
    console.log('Error:', error);
    movieList.innerHTML = 'Error occurred while fetching data.';
  }
};

// Function to display movies
const displayMovies = (movies) => {
  movieList.innerHTML = '';

  movies.forEach((movie) => {
    const movieItem = createMovieItem(movie);
    movieList.appendChild(movieItem);
  });
};

// Function to create a movie item
const createMovieItem = (movie) => {
  const movieItem = document.createElement('div');
  movieItem.classList.add('movie-item');

  const movieTitle = document.createElement('h2');
  movieTitle.textContent = movie.title;
  movieItem.appendChild(movieTitle);

  const movieDetails = document.createElement('p');
  movieDetails.textContent = `Genre: ${movie.genre}, Director: ${movie.director}, Release Year: ${movie.releaseYear}`;
  movieItem.appendChild(movieDetails);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editMovie(movie.id));
  movieItem.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteMovie(movie.id));
  movieItem.appendChild(deleteButton);

  return movieItem;
};

// Function to add a new movie
const addMovie = async () => {
  const movie = {
    title: titleInput.value,
    genre: genreInput.value,
    director: directorInput.value,
    releaseYear: releaseYearInput.value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });

    if (response.ok) {
      const newMovie = await response.json();
      const movieItem = createMovieItem(newMovie);
      movieList.appendChild(movieItem);
      clearFormInputs();
    } else {
      console.log('Error:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

// Function to edit a movie
const editMovie = async (movieId) => {
  const updatedTitle = prompt('Enter new title:');
  if (!updatedTitle) return;

  try {
    const response = await fetch(`${API_URL}/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: updatedTitle })
    });

    if (response.ok) {
      const updatedMovie = await response.json();
      const movieItem = createMovieItem(updatedMovie);
      const existingMovieItem = document.querySelector(`.movie-item[data-id="${movieId}"]`);
      movieList.replaceChild(movieItem, existingMovieItem);
    } else {
      console.log('Error:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

// Function to delete a movie
const deleteMovie = async (movieId) => {
  if (!confirm('Are you sure you want to delete this movie?')) return;

  try {
    const response = await fetch(`${API_URL}/${movieId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const deletedMovie = document.querySelector(`.movie-item[data-id="${movieId}"]`);
      movieList.removeChild(deletedMovie);
    } else {
      console.log('Error:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

// Function to clear form inputs
const clearFormInputs = () => {
  titleInput.value = '';
  genreInput.value = '';
  directorInput.value = '';
  releaseYearInput.value = '';
};

// Event listeners
addMovieButton.addEventListener('click', addMovie);
window.addEventListener('DOMContentLoaded', fetchMovies);