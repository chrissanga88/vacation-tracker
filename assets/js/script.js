let timeEl = $('#time-date');
let submitButton = $('#form-submit');
let form = $('#itinerary-form');
let table = $('#table-body')
let itineraryItems = [];

// Uses dayjs to display the current time
function setTime() {
  let today = dayjs();
  timeEl.text(today.format('MMMM D, YYYY [ at ] h:mm:ss a'));
};

// click event to validate form entries, create an object with the data, save it to local storage, and render the itenary item
submitButton.click(function(event) {
  let descriptionValue = $('#description-input').val().trim();
  let typeValue = $('#type-input').val();
  let dateValue = $('#date-input').val();

  event.preventDefault();

  // if any of the form elements have no input, the the funtion will return and notify the user of the empty field
  if(!form[0].checkValidity())
  {
    form[0].reportValidity();
    return
  }

  // passes the form input to the setStoredItinerary function to be saved 
  setStoredItinerary(descriptionValue, typeValue, dateValue);
  
  let myModal = $("#input-modal");
  // returns the instance of the bootrap modal so it can be hidden after the form data is validated and saved.
  let modal = bootstrap.Modal.getInstance(myModal);
  modal.hide();
  // resets all of the form fields
  form[0].reset();
  // renders the itinerary item data to the end of the list
  renderItineraryItem(itineraryItems.length - 1);
})


setTime(); // sets the initial time 
setInterval(setTime, 1000); // sets the time for each consecutive second after the initial time
getStoredItinerary(); // renders any locally stored itinerary items when the page loads

// uses the form field inputs as parameters to create and object, save it to the itinerary items array and save the array as a string to local storage
function setStoredItinerary(description, type, value) {
  let itineraryItem = {
    "description": description,
    "type": type,
    "value": value
  };

  itineraryItems.push(itineraryItem);

  let iteneraryString = JSON.stringify(itineraryItems);
  
  localStorage.setItem("itineraryList", iteneraryString);
}

// Retrieves renders the stored itinerary items
function getStoredItinerary() {
  let storedItems = localStorage.getItem("itineraryList");
  
  if(storedItems != null)
  {
    itineraryItems = JSON.parse(storedItems);

    for(let i = 0; i < itineraryItems.length; i++)
    {
      renderItineraryItem(i);
    }
  }
}

// Takes in an index parameter and renders that itenary item to the bottom of the list
function renderItineraryItem(currentIndex) {
  let currentItem = itineraryItems[currentIndex];
  let itemDate = dayjs(currentItem.value);
  let today = dayjs();
  
  let rowEl = $('<tr>');
  let descriptionEl = $('<td>').text(currentItem.description);
  let typeEl = $('<td>').text(currentItem.type);
  let dateEl = $('<td>').text(itemDate.format('MM/DD/YYYY'));
  let deleteButton = "<td><button type = 'button' class = 'btn btn-primary delete-item-btn'>delete</button></td>";
  
  if(itemDate.diff(today, 'hour') < 48)
    {
      rowEl.addClass("bg-danger");
    }

    rowEl.append(descriptionEl, typeEl, dateEl, deleteButton);
    table.append(rowEl);
}

// Deletes the clicked itinary item and removes it from the itinerary items array and local storage
function handleDelete(event) {
  let clickedBtn = $(event.target);
  let row = $(clickedBtn.parent().parent());
  let rowIndex = row.index();
  itineraryItems.splice(rowIndex, 1);
  let iteneraryString = JSON.stringify(itineraryItems);
  localStorage.setItem("itineraryList", iteneraryString);
  clickedBtn.parent().parent().remove();
}

table.on('click', '.delete-item-btn', handleDelete);