////////////////////////////////////////
// SELECTORS/VARIABLES
////////////////////////////////////////

const searchContainer = document.querySelector(".search-container");
createSearchBox();
const searchInput = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const galleryDiv = document.querySelector("#gallery");
const body = document.querySelector("body");
let modalContainer = '';
let modalClose = '';
let modalPrev = '';
let modalNext = '';
let currentModal = '';
let cards = '';
let data = '';


////////////////////////////////////////
// LISTENERS
////////////////////////////////////////

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    let personData = JSON.parse(xhr.responseText);
    //createCard(person);
    data = personData.results;
    console.log(data[10]);
    loopPeopleData(data);
    cards = document.querySelectorAll(".card");
    addListenersForModal();
  }  
};
xhr.open('GET', 'https://randomuser.me/api/?results=12');
xhr.send();

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

function createCard(data, index) {
  const personCardHTML = `
  <div class="card" id="${index}">
    <div class="card-img-container">
      <img class="card-img" src="${data.picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${data.name.first + data.name.last}</h3>
      <p class="card-text">${data.email}</p>
      <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
    </div>
  </div>
  `;
  galleryDiv.insertAdjacentHTML('beforeend', personCardHTML);
}


function createModal(data, index) {
  const person = data[index];
  if (modalContainer !== '') {
    modalContainer.remove();
  }
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
            <p class="modal-text">${person.location.street + person.location.city + person.location.state + person.location.postalcode}</p>
            <p class="modal-text">Birthday: ${person.dob.date}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>

    `;  
  body.insertAdjacentHTML('beforeend', modalHTML);  
  modalClose = document.querySelector("#modal-close-btn");
  modalPrev = document.querySelector("#modal-prev");
  modalNext = document.querySelector("#modal-next");
  modalContainer = document.querySelector(".modal-container");
  removeModalByClick();
  modalPrevPerson();
  modalNextPerson()
}

  // IMPORTANT: Below is only for exceeds tasks 


  /**
   * 
   * @param {array} data 
   */
function loopPeopleData(data) {
  data.forEach((person, index) => {
    createCard(person, index);
  });
}

/**
 * 
 */
function addListenersForModal() {
  cards.forEach(card => {
    card.addEventListener('click', function() {
      createModal(data, this.id);  
      currentModal = parseInt(this.id); 
    })
  })
}

/**
 * 
 */
function removeModalByClick() {
  modalClose.addEventListener('click', function() {    
    modalContainer.remove();
    modalContainer = '';
    currentModal = '';
  });
}

/**
 * 
 */
function modalPrevPerson() {
  modalPrev.addEventListener('click', function() {
    console.log(currentModal);
    if(currentModal === 0) {
      currentModal = data.length;
    }
    currentModal--;
    createModal(data, currentModal);    
  })
}

/**
 * 
 */
function modalNextPerson() {
  modalNext.addEventListener('click', function() {
    console.log(currentModal);
    if(currentModal === 11) {
      currentModal = -1;
    }
    currentModal++;
    createModal(data, currentModal);    
  })
}
