$(document).ready(function() {
  var song = {};
  var searchBox = $(".musicSearch");
  var searchButton = $('#searchBtn');
  var sendData = function(){
    $.ajax({
      url: 'http://localhost:3000/itunes',
      type: 'POST',
      dataType: "json",
      data: song
    })
    .done(function(data) {
      console.log('data:');
      console.log(data);
    });
  }
  searchBox.keyup(function(event){
    if(event.keyCode == 13){
      if (searchBox.val() === "") {

      } else {
      song['title'] = searchBox.val()
      sendData();
    }
    }
  });

  searchButton.click(function(event) {
    if (searchBox.val() === "") {

    } else {
    song['title'] = searchBox.val()
    sendData();
    console.log('clicked!')
    }
  })


  var parseData = function(data){
  $('body').append(data);
  }

  var appendDom = function(){

  }


});
