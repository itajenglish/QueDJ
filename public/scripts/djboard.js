$(document).ready(() => {

  const getQue = () => {
    $.ajax({
        url: '/queue',
        type: 'GET',
      })
      .done((data) => {
        console.log(data)
        parseData(data);
      });
  }
  getQue();


  const parseData = (data) => {
    data.forEach((value, index, element) => {
      const Counter = index;
      const title = value.title;
      const artist = value.artist;
      const album = value.album;
      const img = value.img;
      const songID = value.id;

      appendDom(title, artist, img, album, Counter);

      $('#song-num' + Counter).on('click', () => {
        $('#song-num' + Counter).hide('slow/400/fast', () => {
          location.reload();
        });

        $.ajax({
          url: '/queue',
          type: 'DELETE',
          data: {'songID': songID}
        })
      })
    });

  }

  const appendDom = (title, artist, img, album, Counter) => {
    const html = '<li class="collection-item avatar">'+
              `<img src="${img}" alt="image" class="circle">`+
              `<span class="title">${title}</span>`+
              `<p>${album} <br> - <span class = "textColor">${artist}</span> </p>`+
              `<div class = "row">`+
              `<button id = "song-num${Counter}" class="deleteQue waves-effect waves-light btn btnColor">Delete From Que</button></div>`+
              `</li>`;

              $('#listQue').append(html)

  }

});
