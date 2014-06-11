(function(){
    if(getCookie('fav') && (getCookie('fav') != '[]')){
        document.getElementById('myFav').style.display="block";
    }
})();
var runScript = function (e) {
    if (e.keyCode == 13) {
        getData();
    }
}
var getData = function(){
    var my_JSON_object = {};
    var http_request = new XMLHttpRequest();
    var str, queryInput = document.getElementById("search");
    var loader = document.getElementsByClassName('loading')[0];

if(!queryInput.value){
    return;
}

str = encodeURIComponent(queryInput.value);

loader.style.display='block';
 var access_token = "1569498323276946|YiWI21lbZNiWVBHlcKGMygwkCd8"; // my access token here
 var url = "https://graph.facebook.com/search?type=page&q="+ str +"&access_token="+access_token;
http_request.open("GET", url, true);
http_request.onreadystatechange = function () {
    var done = 4, ok = 200;
    if (http_request.readyState == done && http_request.status == ok) {
        my_JSON_object = JSON.parse(http_request.responseText);
        displayResults(my_JSON_object);
        window.result= my_JSON_object;
        loader.style.display="none";
    }
};
http_request.send(null);
};


var displayResults = function(pages){
   var resultDiv = document.getElementsByClassName('page-results')[0];
   if(pages.data.length){
      resultDiv.innerHTML = "";
    document.getElementById('searchResultCount').innerHTML = pages.data.length +" Results found";
   }
   else{
      document.getElementById('searchResultCount').innerHTML = "No results found";
   }
   for(var i=0; i<pages.data.length; i++)
   {
      var name = pages.data[i].name, category = pages.data[i].category, id= pages.data[i].id;
      var li = document.createElement("li");
      var pdetails = document.createElement("div");
      var pname = document.createElement("h4");
      var findmore = document.createElement("a");
      var addFav = document.createElement("a");
      var pcategory = document.createElement("p");
      pname.innerHTML = name;
      findmore.innerHTML = " Find out more";
      findmore.href= "detail.html?id="+id;
      findmore.target = "_blank";
      addFav.innerHTML = "Add to Fav";
      addFav.href= "#";
      addFav.setAttribute('onclick','addFav("'+name+'","'+id+'")')
      pcategory.innerHTML = "<span>Category:</span> " + category;
      pdetails.appendChild(pname);
      pdetails.appendChild(pcategory);
      li.appendChild(pdetails);
      li.appendChild(findmore);
      li.appendChild(addFav);
      resultDiv.appendChild(li);
     }
    };


   var getPageDeatil = function(){
   var query = window.location.search.substring(1);
   var vars = query.split("=");
   getDetailsAjax(vars[1]);
 };

 var getDetailsAjax = function(pageId){
 var my_JSON_object = {};
 var http_request = new XMLHttpRequest();
 var str = encodeURIComponent(pageId);

  var url = "https://graph.facebook.com/"+ str;
 http_request.open("GET", url, true);
 http_request.onreadystatechange = function () {
    var done = 4, ok = 200;
    if (http_request.readyState == done && http_request.status == ok) {
        my_JSON_object = JSON.parse(http_request.responseText);
        displayDetailsResult(my_JSON_object);
    }
 };
 http_request.send(null);
};

var displayDetailsResult = function(detail){
    console.log(detail);
  var resultDiv = document.getElementById('details');
  var displayImage;
  document.getElementById('pageName').innerHTML=detail.name;
  document.getElementById('likesCount').innerHTML=detail.likes;
  document.getElementById('talkingCount').innerHTML=detail.talking_about_count;
  document.getElementById('pageCat').innerHTML='('+detail.category+')';
  for (key in detail) {
    if (detail.hasOwnProperty(key)) {
        if(key=="cover"){
            displayImage =true;
        }
        else{
            var li = document.createElement("li");
            li.setAttribute('class',"removeDecor");
            li.innerHTML = "<b>"+key+ "</b> : " + detail[key];
            resultDiv.appendChild(li);
        }
    }
   }
   if(displayImage){
    var heading = document.getElementById('coverImg');
    var image =  document.createElement('img');
    image.setAttribute('src', detail.cover.source);
    heading.insertBefore(image);
   }
  };

var addFav = function(name,value){
    if(getCookie('fav')){
            var favArray =JSON.parse(getCookie('fav'));
    }else{
         var favArray = [];
    }   
    favArray.push({
        'name':name,
        'value':value
    });
    setCookie('fav',JSON.stringify(favArray));
    document.getElementById('myFav').style.display="block";
}
var showFav = function(){
    var li ='',
        favList =JSON.parse(getCookie('fav'));
    for(var i=0; i<favList.length; i++){
        var value=favList[i].value,
            id= 'value',
            click= "removeFav('"+id+"','"+value+"')";
        li += '<li id="'+value+'"><a href="detail.html?id='+value+'" target="_blank">'+favList[i].name+'</a><span onclick="'+click+'">x</span></li>'
    }
    document.getElementById('myfavList').innerHTML = li;
    document.getElementById('myFavWrapper').style.display="block";
}
var hideFav = function(){
    document.getElementById('myFavWrapper').style.display="none";
}

function removeFav(property, value) {
    var array = JSON.parse(getCookie('fav'));
    for(var i=0; i<array.length;i++){
        if(array[i][property] == value) {
          array.splice(i, 1);
            document.getElementById(value).style.display='none';
      }
    }
    setCookie('fav',JSON.stringify(array));
}

function setCookie(name,value,days)
{
    if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name)
{
    var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return "";
}
function deleteCookie(name) {
  setCookie(name,"",-1);
}

