// Add DOM selectors to target input and UL movie list
const inp = document.querySelector("input");
const myMovieList = document.querySelector("ul");
const movieHistoryCard = document.querySelector("#movieHistoryCard");
const filterInput = document.querySelector("#filter");

// local storage variables
const theLocalStorage = window.localStorage;

// Example of a simple function that clears the input after a user types something in
function clearInput() {
    inp.value = "";
}

function clearMovies() {
    // To delete all children of the <ul></ul> (meaning all <li>'s)..we can wipe out the <ul>'s innerHTML
    myMovieList.innerHTML = '';
    theLocalStorage.setItem("movieList", "");
}

// This function is executed when the user clicks [ADD MOVIE] button.
function addMovie() {
    // Step 1: Get value of input
    const userTypedText = inp.value.toLowerCase();

    if (!userTypedText) {

        alert("User input should not be empty!");

    } else {
        
        const movies = JSON.parse(theLocalStorage.getItem('movieHistory'));
        const movieList = getMovieList();

        if (movies[userTypedText]) {
            // increment viewedTimes if movie is in movieHistory

            movies[userTypedText] = {
                "viewedTimes": movies[userTypedText].viewedTimes += 1
            };

            if (!movieList.includes(userTypedText)) {
                // add movie to movieList if it's not in it
                addMovieToMyMovieList(userTypedText);
            }
            
        } else {
            // add movie to movies if it's not in movieHistory
            movies[userTypedText] = {
                "viewedTimes": 1
            };
            
            // add movie to movieList
            addMovieToMyMovieList(userTypedText);
        }

        theLocalStorage.setItem('movieHistory', JSON.stringify(movies));
        // Call the clearInput function to clear the input field
        clearInput();
        
        // update movie history table
        updateMovieHistoryTable(movies);
    }
    
}

// filter movie with keys
filterInput.addEventListener("input", () => {
    myMovieList.innerHTML = '';
    const key = filterInput.value;
    const movieList = getMovieList();
    
    const filteredList = movieList.filter((title) => title.includes(key));

    showMovies(filteredList);
})

// add movie to movieList in local storage and show all movies in the list
function addMovieToMyMovieList(newMovie) {
    let movieListStr = theLocalStorage.getItem("movieList")
    movieListStr += newMovie + "," 
    theLocalStorage.setItem("movieList", movieListStr)
    const movieList = getMovieList()
    showMovies(movieList)
}


function updateMovieHistoryTable(movies) {
    // remove movie history table if found
    const oldMovieHistoryTable = document.querySelector("table.table");
    if (oldMovieHistoryTable) {
        movieHistoryCard.removeChild(oldMovieHistoryTable);
    } 

    // make new movie history table
    initializeHistoryTable();
    const newMovieHistoryTable = document.querySelector("table.table");
    for (let movie in movies) {
        const row = newMovieHistoryTable.insertRow();
        const movieCell = row.insertCell();
        const movieText = document.createTextNode(movie);
        movieCell.appendChild(movieText);

        const newNumCell = row.insertCell();
        const numNum = document.createTextNode(movies[movie].viewedTimes);
        newNumCell.appendChild(numNum);
    }

}

function initializeHistoryTable() {
    // Add an initial table to innerHTML 
    const movieHistoryTable = document.createElement("table");
    movieHistoryTable.className = "table"
    movieHistoryTable.innerHTML = `<thead> 
                                        <tr> 
                                            <th> Movie </th> 
                                            <th> Views </th> 
                                        </tr> 
                                    </thead>`;

                                                                
    movieHistoryCard.appendChild(movieHistoryTable);
}


window.addEventListener('load', () => {
    // After each reload, if lists are not in Local Storage it will
    // initialize blank lists, otherwise loads previous lists to inferface

    const storedMovieList = theLocalStorage.getItem("movieList")
    const storedMovieHistory = theLocalStorage.getItem("movieHistory")

    if (!storedMovieList) {
        theLocalStorage.setItem("movieList", "")
    } else {
        const movieList = storedMovieList.split(',').slice(0,-1)
        showMovies(movieList)
    }
    

    if (!storedMovieHistory) {
        theLocalStorage.setItem("movieHistory", "{}")
    } else {
        const oldMovieHistory = JSON.parse(storedMovieHistory)
        updateMovieHistoryTable(oldMovieHistory)
    }


});

function showMovies(movieList) {
    
    myMovieList.innerHTML = ""
    for (let title of movieList) {
        // step 2
        const li = document.createElement("li"); // <li></li>
        // step 3
        const textToInsert = document.createTextNode(title);
        // step 4
        li.appendChild(textToInsert);
        // step 5
        myMovieList.appendChild(li);
    }
}

function getMovieList() {
    // Parses the movieList string into a usable list 
    const movieListStr = theLocalStorage.getItem('movieList');
    const movieList = movieListStr.split(',').slice(0,-1);
    return movieList
}