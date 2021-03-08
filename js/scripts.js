////////////////////////////////////////
// SELECTORS/VARIABLES
////////////////////////////////////////

const searchContainer = document.querySelector(".search-container");
createSearchBox();
const searchInput = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const galleryDiv = document.querySelector("#gallery");


////////////////////////////////////////
// LISTENERS
////////////////////////////////////////

galleryDiv.addEventListener('click', function(e) {
  if(e.target.classname === "card") {
    console.log(e.target.id);
  }
})

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    let personData = JSON.parse(xhr.responseText);
    //createCard(person);
    loopPeopleData(personData.results);
  }  
};
xhr.open('GET', 'https://randomuser.me/api/?results=12');
xhr.send();

////////////////////////////////////////
// FUNCTIONS
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

function createCard(personJSON) {
  const personCardHTML = `
  <div class="card">
    <div class="card-img-container">
      <img class="card-img" src="${personJSON.picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${personJSON.name.first + personJSON.name.last}</h3>
      <p class="card-text">${personJSON.email}</p>
      <p class="card-text cap">${personJSON.location.city}, ${personJSON.location.state}</p>
    </div>
  </div>
  `;
  galleryDiv.insertAdjacentHTML('beforeend', personCardHTML);
}


function createModal() {
  const modalHTML = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
            <h3 id="name" class="modal-name cap">name</h3>
            <p class="modal-text">email</p>
            <p class="modal-text cap">city</p>
            <hr>
            <p class="modal-text">(555) 555-5555</p>
            <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
            <p class="modal-text">Birthday: 10/21/2015</p>
        </div>
      </div>
    </div>
    `;
}

  // IMPORTANT: Below is only for exceeds tasks 
  // <div class="modal-btn-container">
  //     <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
  //     <button type="button" id="modal-next" class="modal-next btn">Next</button>
  // </div>

function loopPeopleData(dataArray) {
  dataArray.forEach(person => {
    createCard(person);
  });
}