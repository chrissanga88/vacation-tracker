let timeEl = $('#time-date');
let submitButton = $('#form-submit');
let form = $('#itinerary-form');
let table = $('#table-body')
let itineraryItems = [];

function setTime() {
  let today = dayjs();
  timeEl.text(today.format('MMMM D, YYYY [ at ] h:mm:ss a'));
};

submitButton.click(function(event) {
  let descriptionValue = $('#description-input').val().trim();
  let typeValue = $('#type-input').val();
  let dateValue = $('#date-input').val();

  event.preventDefault();

  if(!form[0].checkValidity())
  {
    form[0].reportValidity();
    return
  }

  setStoredItinerary(descriptionValue, typeValue, dateValue);
  
  let myModal = $("#input-modal");
  let modal = bootstrap.Modal.getInstance(myModal);
  modal.hide();
  form[0].reset();
  renderItineraryItem(itineraryItems.length - 1);
})

setTime();
setInterval(setTime, 1000);
getStoredItinerary();

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