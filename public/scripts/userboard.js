$(document).ready(() => {
  let searchBox = $("#autocomplete-input");
  let searchBtn = $('#searchBtn');

  const getAllData = () => {
    $.ajax({
        url: '/api/search',
        type: 'GET',
      })
      .done((data) => {
        //Prefil search box with data from database.
        $('input.autocomplete').autocomplete({data});
      });
  }
  getAllData();

  const getSearchData = (fname, lname) => {
    $.ajax({
        url: `/api/${fname}-${lname}`,
        type: 'GET',
      })
      .done((response) => {
        appendDom(response);
      })
  }

  //When enter key is pressed.
  searchBox.keyup((event) => {
    $('.collection-item').remove();
    if (event.keyCode == 13) {
      if (searchBox.val() === "") {
        return
      } else {

        let searchVal = $('.autocomplete').val();
        searchVal = searchVal.replace('%20', ' ');
        searchVal = searchVal.split(' ');

        const fname = searchVal[0];
        const lname = searchVal[1];

        getSearchData(fname, lname);
      }
    }
  });

 searchBtn.click((event) => {
   $('.collection-item').remove();
    let searchVal = $('.autocomplete').val();
    if (searchVal === "") {
      return
    } else {
      searchVal = searchVal.replace('%20', ' ');
      searchVal = searchVal.split(' ');

      const fname = searchVal[0];
      const lname = searchVal[1];

      getSearchData(fname, lname);
    }
  });

});

const appendDom = (data) => {
  $('.collection-item').remove();
  console.log(data);
  data.forEach((value, index, element) => {
    let name = value.first_name + " " + value.last_name;
    let fname = value.first_name;
    let lname = value.last_name;
    let image = value.image;
    let upvotes;
    let downvotes;
    let location = value.location;
    let bio = value.bio;

    $('#listDjs').append('<li class="collection-item avatar"> <img src="' + image + '" alt="image" class="circle"> <span class="title">'+name+'</span> <p>' + bio+ ' <br>' +'- ' + '<span class = "textColor">'+ location + '</span>' +'</p><a href="/user/'+fname+'-'+lname+'" class="textColor secondary-content">View</a>')

  });
}
