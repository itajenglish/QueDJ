$(document).ready(function() {
$.ajax({
  url: 'http://localhost:3000/api/',
  type: 'GET',
})
.done(function(data) {
  $('input.autocomplete').autocomplete({
    data
  });
});


});
