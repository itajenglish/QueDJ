$(document).ready(function() {
  var searchBox = $("#autocomplete-input");
  var searchBtn = $('#searchBtn');
  var getAllData = function() {
    $.ajax({
        url: '/search',
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
        url: '/api/' + param,
        type: 'GET',
      })
      .done(function(data) {
        appendDom(data);
      })
  }
  searchBox.keyup(function(event) {
    $('.collection-item').remove();
    if (event.keyCode == 13) {
      if (searchBox.val() === "") {

      } else {
        var searchVal = $('.autocomplete').val();
        getSearchData(searchVal);
      }
    }
  });

 searchBtn.click(function(event) {
   $('.collection-item').remove();
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
    var bio = value.bio;

    $('#listDjs').append('<li class="collection-item avatar"> <img src="' + image + '" alt="image" class="circle"> <span class="title">'+name+'</span> <p>' + bio+ ' <br>' +'- ' + '<span class = "textColor">'+ location + '</span>' +'</p><a href="/user/'+fname+'-'+lname+'" class="textColor secondary-content">View</a>')

  });
}
