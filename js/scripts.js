////////////////////////////////////////
// SELECTORS/VARIABLES/DATA CALLS
// AND INSERTING NEEDED ELEMENTS
////////////////////////////////////////

const openAPIUrl = 'https://randomuser.me/api/?results=50&noinfo&nat=ca,de,dk,es,fi,fr,gb,us';
const searchContainer = document.querySelector(".search-container");

// Gets a promise from getJSON to handle a request, if resolved, calls for 'dataCallback',
// logs the error if unsuccesful.
getJSON(openAPIUrl)
  .then(dataCallback)
  .catch(err => console.log(err));

createSearchBox();

const searchInput = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const galleryDiv = document.querySelector("#gallery");
const ulListHTML = `<ul id="pagination"></ul>`;

galleryDiv.insertAdjacentHTML('afterend',ulListHTML);

const paginationUl = document.querySelector("#pagination");
const cardsPerPage = 12;
const body = document.querySelector("body");
let modalContainer = ''; // modal view
let modalCloseButton = '';
let modalPrevButton = '';
let modalNextButton = '';
let currentModal = ''; // id of the Modal that is viewed
let cards = ''; // profile cards in gallery
let data = ''; // data array that changes whenever a search is done
let originalData = ''; // original data that does not change after initial set

/**
 * Gets 40 profiles with western nationality. Return a promise to be handled.
 * @param {string} url 
 * @returns {promise}
 */
function getJSON(url) {
  return new Promise((resolve,reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        let personData = JSON.parse(xhr.responseText);
        resolve(personData);
      } else {
        reject( Error(xhr.statusText));
      }
    }; 
    xhr.onerror = () => reject( Error("NETWORK ERROR!"));
    xhr.send();
  });  
}

/**
 * Callback to display cards and pagination from data.
 * @param {array} personData 
 */
function dataCallback(personData) {
  data = personData.results;
  originalData = data;
  showPersonCards(data, 1);    
  addPagination();
  cards = document.querySelectorAll(".card");
  if(data.length) {
    addListenersForCards();
  }    
}

////////////////////////////////////////
// SEARCH BAR
////////////////////////////////////////

/**
 * Creates the search bar to top right of the screen.
 */
function createSearchBox() {
  const searchBoxHTML = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
  searchContainer.insertAdjacentHTML('beforeend', searchBoxHTML);
}

/**
 * Real-time search when typing in search input.
 */
searchInput.addEventListener('keyup', function(e){
  searchForInput(e.target.value.toLowerCase());
});

/**
 * Search that happens when submit button is clicked.
 */
searchSubmit.addEventListener('click', function(e){
  e.preventDefault();
  searchForInput(searchInput.value.toLowerCase());
  searchInput.value = '';
});

/**
 * Search function to check from 'originalData' for results each time this is called. 
 * Refreshes gallery view each time.
 * @param {string} inputValue 
 */
 function searchForInput(inputValue) {  
  galleryDiv.innerHTML = '';
  data = originalData.filter(person => {
    const match = `${person.name.first} ${person.name.first}`.toLowerCase();
    return match.includes(inputValue);
  });
  showPersonCards(data, 1);  
  addPagination();
  cards = document.querySelectorAll(".card");
  if (data.length) {
    addListenersForCards();
  }
}

////////////////////////////////////////
// PROFILE CARDS
////////////////////////////////////////

/**
 * Creates the wanted profile card when called. If this function is called and the 'data' array
 * is empty, "No Results!" text is inserted to the gallery.
 * @param {object} person 
 * @param {number} index 
 */
function createCard(person=null, index=0) {
  let personCardHTML = '';
  if(!data.length) {
    personCardHTML = ` 
        <div class="card empty-card">
          <h2>No results!</h2>
        </div>
        `;
  } else {
    personCardHTML = `
      <div class="card" id="${index}" tabindex="0">
        <div class="card-img-container">
          <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="card-text">${person.email}</p>
          <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
        </div>
      `;
  }
  galleryDiv.insertAdjacentHTML('beforeend', personCardHTML);
}

/**
 * Displays the wanted 12 cards or less on page. Calls 'createCard' to get each card implemented
 * on gallery view.
 * @param {array} data 
 */
 function showPersonCards(data, page) {
  const firstIndex = cardsPerPage * page - cardsPerPage;
  const lastIndex = cardsPerPage * page;
  galleryDiv.innerHTML = '';
//  addPagination();
  if(!data.length) {
    createCard();
  } else {
    for (let i = firstIndex; i < lastIndex; i++) {
      if(i < data.length) {
        const person = data[i];
        createCard(person, i);
      }
    }    
  }  
}

/**
 * Adds a listener to each card in gallery for click/keyup events. This function is called
 * everytime the card view changes by search or pagination change.
 */
 function addListenersForCards() {
  cards.forEach(card => {
    card.addEventListener('click', function() {
      createModal(data, this.id);  
      currentModal = parseInt(this.id); 
    });
    card.addEventListener('keyup', function(e) {
      if(e.key === "Enter") {
        createModal(data, this.id);  
        currentModal = parseInt(this.id); 
      }

    });
  });
}

/**
 * Creates the modal screen from data array. Listeners for Modal view are called here.
 * 'createModalHTML' is called to create the HTML and it is inserted directly here to the DOM.
 * @param {array} data 
 * @param {number} index 
 */
function createModal(data, index) {
  const person = data[index];
  if (modalContainer !== '') {
    modalContainer.remove();
  }
  const modalHTML = createModalHTML(person);
  body.insertAdjacentHTML('beforeend', modalHTML);  
  modalCloseButton = document.querySelector("#modal-close-btn");
  modalPrevButton = document.querySelector("#modal-prev");
  modalNextButton = document.querySelector("#modal-next");
  modalContainer = document.querySelector(".modal-container");
  removeModalByClickListener();
  modalPrevPersonListener();
  modalNextPersonListener();
}

/**
 * Adds a pagination bar with buttons below the gallery view. Each 'page' displays 'cardsPerPage'
 * number of cards. Pagination updates with the search results.
 * @param {array} data 
 */
function addPagination() {
  paginationUl.innerHTML = '';
  const pages = Math.ceil(data.length/cardsPerPage);
  
  for (let i = 0; i < pages; i++) {
    if(i === 0) {
      const paginationHTML = `
        <li>
          <button type="button" class="pagination-button active-button">${i+1}</button>
        </li>
        `;
      paginationUl.insertAdjacentHTML('beforeend', paginationHTML);
    } else {
      const paginationHTML = `
        <li>
          <button type="button" class="pagination-button">${i+1}</button>
        </li>
        `;
      paginationUl.insertAdjacentHTML('beforeend', paginationHTML);
    }       
  }  

  paginationUl.addEventListener('click', function(e) {
    if(e.target.tagName === 'BUTTON') {
      showPersonCards(data, e.target.innerHTML);           
      cards = document.querySelectorAll(".card");  
      document.querySelector(".active-button").classList.remove("active-button");
      e.target.classList.add("active-button");
      if (data.length) {
        addListenersForCards();
      }  
    }
  });
  // const paginationButtons = document.querySelectorAll(".pagination-button");
  // paginationButtons.forEach(button => {
  //   button.addEventListener('click', function(e) {
  
  //   });
  // });
}


////////////////////////////////////////
// MODAL 
////////////////////////////////////////


/**
 * Creates the HTML code from person object which includes all the individual details. These details
 * are implemented into the modal HTML string. This is called to create the modal screen or to
 * update it to the next or the previous person.
 * @param {object} person 
 * @returns {string} (template literal HTML)
 */
function createModalHTML(person) {
  const cleanCellNumber = formatCellNumber(person.cell);  
  const cleandob = formatDOB(person.dob.date);
  const modalHTML = `
  <div class="modal-container">
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src="${person.picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="modal-text">${person.email}</p>
          <p class="modal-text cap">${person.location.city}</p>
          <hr>
          <p class="modal-text">${cleanCellNumber}</p>
          <p class="modal-text">${person.location.street.number} ${person.location.street.name} <br>${person.location.city} ${person.location.state} ${person.location.postcode}</p>
          <p class="modal-text">Birthday: ${cleandob}</p>
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>
  `; 
  return modalHTML;
}

/**
 * Formats the Cell number to correct form.
 * @param {string} cell 
 * @returns {string}
 */
function formatCellNumber(cell) {
  const cleanCellNumber = cell.replace(/\D/g, '');
  return cleanCellNumber.replace(/(\d{3})(\d{3})(\d{2,})/, "($1) $2-$3");
}

/**
 * Formats the DOB string to correct form.
 * @param {string} dob 
 * @returns {string}
 */
function formatDOB(dob) {
  const cleanDOB = dob.replace(/\D/g, '');
  return cleanDOB.replace(/^(\d{4})(\d{2})(\d{2})(\d*)/, "$2/$3/$1");
}

/**
 * Adds a listener to close Modal screen from X in top right corner.
 */
function removeModalByClickListener() {
  modalCloseButton.addEventListener('click', createremoveModalByClickListener);
}

/**
 * Removes modal screen and updates variables 'modalContainer' and 'currentModal'.
 */
function createremoveModalByClickListener() {
  modalContainer.remove();
  modalContainer = '';
  currentModal = '';
}

/**
 * Adds listeners to navigate with arrows and escape inside modal screen.
 */
document.addEventListener('keyup', function(e) {
  if (modalContainer !== '') {
    if (e.key === "ArrowLeft") {
      createmodalPrevPersonListener();
    } else if (e.key === "Escape") {
      createremoveModalByClickListener();
    } else if (e.key === "ArrowRight") {
      createmodalNextPersonListener();
    }
  }
});

/**
 * Creates a listener for previous button.
 */
function modalPrevPersonListener() {
  modalPrevButton.addEventListener('click', function() {
    createmodalPrevPersonListener();
  });
}

/**
 * If called, updates 'currentModal' to the new value and loads previous person to the modal screen.
 */
 function createmodalPrevPersonListener() {
  if(currentModal === 0) {
    currentModal = data.length;
  }
  currentModal--;
  createModal(data, currentModal);    
}

/**
 * Creates a listener for next button.
 */
function modalNextPersonListener() {
  modalNextButton.addEventListener('click', function() {
    createmodalNextPersonListener();
  });
}

/**
 * If called, updates 'currentModal' to the new value and loads next person to the modal screen.
 */
function createmodalNextPersonListener() {
  if(currentModal === data.length - 1) {
    currentModal = -1;
  }
  currentModal++;
  createModal(data, currentModal); 
}