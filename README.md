# Unit5-Public-API-Requests
Treehouse UNIT 5 project 

______________________________________________________________
SEARCH BAR

Added realtime search for input field, as the user types name of the person, the card gallery updates.

______________________________________________________________
GALLERY VIEW

Gallery view hold 12 cards, if more than 12 people are in the data, you have to use pagination to view more or filter with search to reduce the amount of total cards. Gallery cards are selectable with tab and you can hit enter to get the modal view. Selecting card can of course be done by click also. Adjusted the hover/selected property to have more visual effect with border.

.card:hover, .card:focus 
{
background: rgba(255, 255, 255, 1);
border: 2px solid rgba(50, 50, 50, 0.9);
}

______________________________________________________________
PAGINATION

Pagination bar implemented to limit view to 12 cards per "page". Pagination has some minor stylin for when a certain page is selected. View starts from page 1 when loading the page or using the search. Pagination updates as the search is done.

#pagination 
{
list-style: none;
display: flex;
justify-content: center;
}

.pagination-button 
{
margin: 4px;
display: block;
padding: 5px;
width: 2em;
height: 2em;
}

.active-button 
{
background-color: rgba(100, 100, 100, 0.3);
}

______________________________________________________________
MODAL VIEW

Added key navigation, ArrowLeft to go to previous, ArrowRight to go to next and Esc to close the view.