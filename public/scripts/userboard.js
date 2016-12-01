$(document).ready(function() {

  var getAllData = function() {
    $.ajax({
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

  var getSearchData = function(param) {
    $.ajax({
        url: 'http://localhost:3000/api/' + param,
        type: 'GET',
      })
      .done(function(data) {
        appendDom(data);
      })
  }
  $('#searchBtn').click(function(event) {
    var searchVal = $('.autocomplete').val();
    if (searchVal === "") {

    } else {
      getSearchData(searchVal);

    }
  });

});

function appendDom(data) {
  $('.collection-item').remove();
  console.log(data);
  data.forEach(function(value, index, element) {
    var name = value.first_name + " " + value.last_name;
    var fname = value.first_name;
    var lname = value.last_name;
    var image = value.image;
    var upvotes;
    var downvotes;
    var location = value.location;
    var bio = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    $('#listDjs').append('<li class="collection-item avatar"> <img src="' + image + '" alt="image" class="circle"> <span class="title">'+name+'</span> <p>' + bio+ ' <br>' +'- ' + '<span class = "textColor">'+ location + '</span>' +'</p><a href="http://localhost:3000/user/'+fname+'-'+lname+'" class="secondary-content">View</a>')

  });
}
