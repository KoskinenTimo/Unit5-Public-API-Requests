////////////////////////////////////////
// SELECTORS/VARIABLES
////////////////////////////////////////

const searchContainer = document.querySelector(".search-container");
createSearchBox();
const searchInput = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const galleryDiv = document.querySelector("#gallery");
const ulListHTML = `<ul id="pagination"></ul>`;
galleryDiv.insertAdjacentHTML('afterend',ulListHTML);
const paginationUl = document.querySelector("#pagination");
const cardsPerPage = 12;
const body = document.querySelector("body");
let modalContainer = '';
let modalClose = '';
let modalPrev = '';
let modalNext = '';
let currentModal = '';
let modalInfoContainer = '';
let cards = '';
let data = '';
let originalData = '';

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    let personData = JSON.parse(xhr.responseText);
    data = personData.results;
    originalData = data;
    loopPeopleData(data, 1);    
    cards = document.querySelectorAll(".card");
    addListenersForCards();
  }  
};
xhr.open('GET', 'https://randomuser.me/api/?results=40&noinfo&nat=ca,de,dk,es,fi,fr,gb,us');
xhr.send();

////////////////////////////////////////
// SEARCH BAR
////////////////////////////////////////

/**
 * 
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

searchInput.addEventListener('keyup', function(e){
  searchForInput(e.target.value.toLowerCase());
});

searchSubmit.addEventListener('click', function(e){
  searchForInput(searchInput.value.toLowerCase());
});

/**
 * 
 * @param {string} inputValue 
 */
 function searchForInput(inputValue) {  
  galleryDiv.innerHTML = '';
  data = originalData.filter(person => {
    const match = `${person.name.first} ${person.name.first}`.toLowerCase();
    return match.includes(inputValue);
  });
  loopPeopleData(data, 1);  
  cards = document.querySelectorAll(".card");
  addListenersForCards();
}

////////////////////////////////////////
// PROFILE CARDS
////////////////////////////////////////

/**
 * 
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
 * 
 * @param {array} data 
 */
 function loopPeopleData(data, page) {
  const firstIndex = cardsPerPage * page - cardsPerPage;
  const lastIndex = cardsPerPage * page;
  galleryDiv.innerHTML = '';
  paginationUl.innerHTML = '';
  addPagination();
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
 * 
 */
 function addListenersForCards() {
  cards.forEach(card => {
    card.addEventListener('click', function() {
      createModal(data, this.id);  
      currentModal = parseInt(this.id); 
    })
  })
}

/**
 * 
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
  modalClose = document.querySelector("#modal-close-btn");
  modalPrev = document.querySelector("#modal-prev");
  modalNext = document.querySelector("#modal-next");
  modalContainer = document.querySelector(".modal-container");
  modalInfoContainer = document.querySelector(".modal-info-container");
  removeModalByClickListener();
  modalPrevPersonListener();
  modalNextPersonListener();
}

/**
 * 
 * @param {array} data 
 */
function addPagination() {
  const pages = Math.ceil(data.length/cardsPerPage);
  
  for (let i = 0; i < pages; i++) {
    if(i === 0) {
      const paginationHTML = `
        <li>
          <button type="button" class="pagination-button active">${i+1}</button>
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

  const paginationButtons = document.querySelectorAll(".pagination-button");
  paginationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        document.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        loopPeopleData(data, e.target.innerHTML);      
    });
  });
}






////////////////////////////////////////
// MODAL 
////////////////////////////////////////

/**
 * 
 * @param {*} person 
 * @returns 
 */
function createModalHTML(person) {
  const modalHTML = `
  <div class="modal-container">
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src="${person.picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${person.name.first + person.name.last}</h3>
          <p class="modal-text">${person.email}</p>
          <p class="modal-text cap">${person.location.city}</p>
          <hr>
          <p class="modal-text">${person.cell}</p>
          <p class="modal-text">${person.location.street.number} ${person.location.street.name} <br>${person.location.city} ${person.location.state} ${person.location.postalcode}</p>
          <p class="modal-text">Birthday: ${person.dob.date}</p>
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
 * 
 */
function removeModalByClickListener() {
  modalClose.addEventListener('click', createremoveModalByClickListener);
}

/**
 * 
 * @param {event} e 
 */
function createremoveModalByClickListener(e) {
  modalContainer.remove();
  modalContainer = '';
  currentModal = '';
}

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

function modalPrevPersonListener() {
  modalPrev.addEventListener('click', function() {
    createmodalPrevPersonListener();
  });
}

/**
 * 
 */
 function createmodalPrevPersonListener() {
  if(currentModal === 0) {
    currentModal = data.length;
  }
  currentModal--;
  createModal(data, currentModal);    
}

/**
 * 
 */
function modalNextPersonListener() {
  modalNext.addEventListener('click', function() {
    createmodalNextPersonListener();
  });
}

/**
 * 
 */
function createmodalNextPersonListener() {
  if(currentModal === data.length - 1) {
    currentModal = -1;
  }
  currentModal++;
  createModal(data, currentModal); 
}
