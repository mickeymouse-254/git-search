// Get references to HTML elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Add form submit event listener
searchForm.addEventListener('submit', handleFormSubmit);

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  const searchTerm = searchInput.value.trim(); // Get the search term from the input field

  if (searchTerm === '') {
    // Check if search term is empty
    searchResults.innerHTML = '<p>Please enter a username</p>'; // Display a message if no username is entered
    return;
  }

  searchUsers(searchTerm); // Call the function to search for users
}

// Function to search for users
function searchUsers(username) {
  const searchUrl = `https://api.github.com/search/users?q=${username}`; // Construct the URL for user search

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        displayUsers(data.items); // Display the found users if any
      } else {
        searchResults.innerHTML = '<p>No results found</p>'; // Display a message if no users found
      }
    })
    .catch(error => {
      console.error('Error:', error);
      searchResults.innerHTML = '<p>An error occurred while fetching data</p>'; // Display an error message if there was an issue with fetching data
    });
}

// Function to display users
function displayUsers(users) {
  searchResults.innerHTML = ''; // Clear previous search results
  users.forEach(user => {
    const userElement = document.createElement('div'); // Create a div element for each user
    userElement.classList.add('user'); // Add 'user' class to the div

    fetch(`https://api.github.com/users/${user.login}`) // Corrected fetch URL using backticks
      .then(response => response.json())
      .then(userData => {
        const avatar = document.createElement('img'); // Create an img element for the user avatar
        avatar.src = userData.avatar_url; // Set the avatar image source
        userElement.appendChild(avatar); // Append the avatar image to the user div
      })
      .catch(error => {
        console.error('Error:', error);
        // Display a placeholder avatar or an error message if avatar retrieval fails
      });

    const username = document.createElement('a'); // Create an anchor element for the username
    username.href = user.html_url; // Set the link URL to the user's GitHub profile
    username.textContent = user.login; // Set the username as the link text
    userElement.appendChild(username); // Append the username link to the user div

    userElement.addEventListener('click', () => {
      getUserRepositories(user.login); // Add a click event listener to retrieve user repositories on click
    });

    searchResults.appendChild(userElement); // Append the user div to the search results container
  });
}

// Function to get user repositories
function getUserRepositories(username) {
  const repositoriesUrl = `https://api.github.com/users/${username}/repos`; // Construct the URL for user repositories

  fetch(repositoriesUrl)
    .then(response => response.json())
    .then(repositories => {
      displayRepositories(username, repositories); // Display the user repositories
    })
    .catch(error => {
      console.error('Error:', error);
      searchResults.innerHTML = '<p>An error occurred while fetching repositories</p>'; // Display an error message if there was an issue with fetching repositories
    });
}

// Function to display user repositories
function displayRepositories(username, repositories) {
  searchResults.innerHTML = `<h2>Repositories for ${username}</h2>`; // Display heading with the username
  if (repositories.length === 0) {
    searchResults.innerHTML += '<p>No repositories found</p>'; // Display a message if no repositories found
    return;
  }
  const repositoriesList = document.createElement('ul'); // Create a ul element for the repositories
  repositories.forEach(repo => {
    const repositoryItem = document.createElement('li'); // Create an li element for each repository
    repositoryItem.textContent = repo.name; // Set the repository name as the li text
    repositoriesList.appendChild(repositoryItem); // Append the repository li to the ul
  });
  searchResults.appendChild(repositoriesList); // Append the repositories ul to the search results container
}
