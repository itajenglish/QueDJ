$(document).ready(() => {
  let song;
  let searchBox = $(".musicSearch");
  let searchButton = $('#searchBtn');

  //Gets songs from itunes matching song name passed in
  const sendData = () => {
    $.ajax({
      url: `/api/itunes/${song}`,
      type: 'GET',
      dataType: "json",
      data: song
    })
    .done((data) => {
      parseData(data);
    });
  }

  //Send songs when Enter Button is pressed
  searchBox.keyup((event) => {
    if (event.keyCode == 13) {
      if (searchBox.val() === "") {
        return
      } else {
        $('.collection-item').remove();
        song = searchBox.val()
        sendData();
        searchBox.val('');
      }
    }
  });

  searchButton.click((event) => {
    $('.collection-item').remove();
    if (searchBox.val() === "") {
      return
    } else {
      song = searchBox.val()
      sendData();
      searchBox.val('');
      console.log('clicked!')
    }
  });

  const parseData = (data) => {

  data.results.forEach((value,index,arr) => {
      const Counter = index;
      const Title = value.trackName;
      const Artist  = value.artistName;
      const Img = value.artworkUrl30;
      const Album = value.collectionName;

      appendDom(Title,Artist,Img,Album,Counter);

      $('#song-num' + Counter).on('click', () => {
        const djID = $('#djNum').text();
        const songData = {
          'djID': djID,
          'Title': Title,
          'Artist': Artist,
          'Album': Album,
          "Image": Img
        };

        $.ajax({
          url: 'https://quedj.herokuapp.com/saveQueData',
          type: 'POST',
          data: songData
        })
        .done(() => {
          console.log("success");
        })

      })
    });

  }

  const appendDom = (Title,Artist,Img,Album,Counter) => {
    $('#listSongs').append('<li class="collection-item avatar"> <img src="' + Img + '" alt="image" data = "{{dj.id}}" class="circle"> <span class="title">'+Title+'</span> <p>' + Artist+'</p>'+'<p>'+Album+'</p>'+'<div class = "row">'+ '<button id = "song-num'+Counter+'"" class = "addQue waves-effect waves-light btn btnColor">Que</button>' +'</div>'+'</li>')
  };


});
