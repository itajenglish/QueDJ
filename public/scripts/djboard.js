$(document).ready(function() {
  var searchBox = $("#autocomplete-input");
    var searchBtn = $('#searchBtn');

    var getQue = function(){
      $.ajax({
        url: 'http://localhost:3000/queData/',
        type: 'GET',
      })
      .done(function(data) {
        console.log(data)
        parseData(data);
      });
  }
  getQue();


      var parseData = function(data){
        data.forEach(function(value, index, element) {
        var Counter = index;
        var title = value.title;
        var artist = value.artist;
        var album = value.album;
        var img = value.img;
        var songID = value.id;

        appendDom(title,artist,img,album,Counter);

          $('#song-num'+Counter).on('click',function(){
            $('#song-num'+Counter).hide('slow/400/fast', function() {
              location.reload();
            });

            var songData = {'songID':songID};
            $.ajax({
              url: 'http://localhost:3000/deleteQueData',
              type: 'DELETE',
              data: songData
            })
          })
        });

      }

      var appendDom = function(title,artist,img,album,Counter){

        $('#listQue').append('<li class="collection-item avatar"> <img src="' + img + '" alt="image" class="circle"> <span class="title">'+title+'</span> <p>' + album+ ' <br>' +'- ' + '<span class = "textColor">'+ artist + '</span>'+'<div class = "row">'+ '<button id = "song-num'+Counter+'"" class = "deleteQue waves-effect waves-light btn btnColor">Delete From Que</button>' +'</div>');
      }

});
