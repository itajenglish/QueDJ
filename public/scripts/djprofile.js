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
      parseData(data);
    });
  }
  searchBox.keyup(function(event){
    if(event.keyCode == 13){
      if (searchBox.val() === "") {

      } else {
        $('.collection-item').remove();
      song['title'] = searchBox.val()
      sendData();
    }
    }
  });

  searchButton.click(function(event) {
    $('.collection-item').remove();
    if (searchBox.val() === "") {

    } else {
    song['title'] = searchBox.val()
    sendData();
    console.log('clicked!')
    }
  })


  var parseData = function(data){
  data.results.forEach(function(value,index,arr){
      // console.log(value)
      var Title = value.trackName;
      var Artist  = value.artistName;
      var Img = value.artworkUrl30;
      appendDom(Title,Artist,Img);
    });
    // var Title = data.
  }

  var appendDom = function(Title,Artist,Img){
    $('#listSongs').append('<li class="collection-item avatar"> <img src="' + Img + '" alt="image" class="circle"> <span class="title">'+Title+'</span> <p>' + Artist+ '</li>')
  }


});
