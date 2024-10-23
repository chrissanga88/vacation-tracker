let timeEl = $('#time-date');


function setTime() {
  let today = dayjs();
  timeEl.text(today.format('MMMM D, YYYY [ at ] h:mm:ss a'));
};

setTime();
setInterval(setTime, 1000);