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

  // var sendSongs = function()
  searchBox.keyup(function(event){
    if(event.keyCode == 13){
      if (searchBox.val() === "") {

      } else {
        $('.collection-item').remove();
      song['title'] = searchBox.val()
      sendData();
      searchBox.val('');
    }
    }
  });

  searchButton.click(function(event) {
    $('.collection-item').remove();
    if (searchBox.val() === "") {



    } else {
    song['title'] = searchBox.val()
    searchBox.val('');
    sendData();
    console.log('clicked!')
    }
  });

  var parseData = function(data){
  data.results.forEach(function(value,index,arr){
      var Counter = index;
      var Title = value.trackName;
      var Artist  = value.artistName;
      var Img = value.artworkUrl30;
      var Album = value.collectionName;

      appendDom(Title,Artist,Img,Album,Counter);

      $('#song-num'+Counter).on('click',function(){
        var djID = $('#djNum').text();
        var songData = {'djID':djID,'Title':Title,'Artist':Artist,'Album':Album,"Image":Img};

        $.ajax({
          url: 'http://localhost:3000/saveQueData',
          type: 'POST',
          data: songData
        })
        .done(function() {
          console.log("success");
        })

      })
    });

  }

  var appendDom = function(Title,Artist,Img,Album,Counter){
    $('#listSongs').append('<li class="collection-item avatar"> <img src="' + Img + '" alt="image" data = "{{dj.id}}" class="circle"> <span class="title">'+Title+'</span> <p>' + Artist+'</p>'+'<p>'+Album+'</p>'+'<div class = "row">'+ '<button id = "song-num'+Counter+'"" class = "addQue waves-effect waves-light btn btnColor">Que</button>' +'</div>'+'</li>')

  };


});
