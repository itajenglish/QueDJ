$(document).ready(function() {
  var song = {};
  var searchBox = $(".musicSearch");
  var searchButton = $('#searchBtn');
  var sendData = function(){
    $.ajax({
      url: 'http://localhost:3000/itunes',
      type: 'POST',
      data: song
    })
    .done(function() {
      console.log(data);
    });
  }
  searchBox.keyup(function(event){
    if(event.keyCode == 13){
      song['title'] = searchBox.val()
      sendData();
    }
  });

  searchButton.click(function(event) {
    song['title'] = searchBox.val()
    sendData();
    console.log('clicked!')
  })


  // var parseData = function(data){
  // $('body').append(data);
  // }
  //
  // var appendDom = function(){
  //
  // }
  //
  //
});
