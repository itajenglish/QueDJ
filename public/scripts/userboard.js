$(document).ready(function() {

var getAllData = function(){$.ajax({
  url: 'http://localhost:3000/search/',
  type: 'GET',
})
.done(function(data) {
  //Prefil search box with data from database.
  $('input.autocomplete').autocomplete({
    data
  });
 });
}
getAllData()

var getSearchData = function(param){
  $.ajax({
    url: 'http://localhost:3000/api/'+param,
    type: 'GET',
  })
  .done(function(data) {
    console.log(data);
  })
}
$('#searchBtn').click(function(event) {
  var searchVal = $('.autocomplete').val();
  getSearchData(searchVal);
});



function appendDom(data){

}

});
