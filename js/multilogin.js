//login features
var accessToken
var thecookie;
var loginType;
var user = new Array();
var codUser;
var nomeUser;
var emailUser;


//function logout for all login systems
function logout() {
  if(loginType=="facebook"){
      FB.logout(function(response) {
      statusChangeCallback(response);
    });
  }
  else{
    document.cookie = "cod=; expires=Thu, 01 Jan 2000 12:00:00 UTC path=/;" //deletes the cookie value
    thecookie = "";
  }
  loginType = "";
  $("#content").css("display", "none");
  $("#loginOptions").css("display", "inline");
  $("#botLogout").css("display", "none");
}

function toggle(option){
  if(option=="on"){
      $("#loginOptions").css("display", "none");
      $("#botLogout").css("display", "inline");
      $("#content").css("display", "inline");
      $("#formLoginDiv").css("display", "none");
  }
  else if(option=="off"){
    $("#loginOptions").css("display", "inline");
    $("#botLogout").css("display", "none");
    $("#content").css("display", "none")
  }
}


//FB functions
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'YOUR APP ID',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
});

FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    var uid = response.authResponse.userID;
    accessToken = response.authResponse.accessToken;
    loginType = "facebook";
    } else if (response.status === 'not_authorized') {
      // the user is logged in to Facebook, 
      // but has not authenticated your app
    } else {
      // the user isn't logged in to Facebook.
    }
   statusChangeCallback(response);
  });

};

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

//////////////////////////////////////////////////////////////////////////////////


function statusChangeCallback(response) {
  if (response.status === 'connected') { //you are connect with Facebook, so skip other types
		var uid = response.authResponse.userID;
		accessToken = response.authResponse.accessToken;
		loginType = "facebook";

		toggle("on"); //turn on the option as logged in, you are logged in using Facebook
	  
  } else { // You are not connected with Facebook, so try the database connection (cookies)
	  accessToken = "";
	  loginType = "";
	  toggle("off"); //turn off the option as logged out
    checkCookie();

    // you are logged in using database

  }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}

function fbLogin() {
  $("#formLoginDiv").css("display", "none"); 
    FB.login(function (response) {
        if (response.authResponse) {
            checkLoginState();
        } else {
          $("#status").html("User cancelled login or did not fully authorize.");
        }
    }, {scope: 'email'});
}
  
///////////////////////////////////////////////DB functions 
  
function showform() { //shows the form to input the database credentials
  $("#formLoginDiv").css("display", "inline");  
}

function dbLogin(){ //acess the PHP file for the database login, the return must be a JSON format
var formok = "";
var emailSent = document.getElementById("formLogin").email.value;
var senhaSent = document.getElementById("formLogin").password.value;

  if ((emailSent != "") && (senhaSent != "")){
    formok = "ok";
  }
  else{
    alert("Please fill in the form.");
  }
  
  if(formok == "ok"){
    
    $.ajax({
          url: 'YOUR PHP FILE?email='+emailSent+'&password='+senhaSent,
          dataType: 'jsonp',
          jsonp: 'jsoncallback',
          timeout: 50000,
          success: function(data, status){
            $.each(data, function(i,item){
              user[i] = [item.cod, item.email, item.nome];
              codUser = item.cod;
              nomeUser = item.nome;
              emailUser = item.email;
            });
          document.getElementById("formLogin").reset();
          
          if(nomeUser){
            loginType = "db";
            toggle("on"); //turn on the option as logged in, you are logged in using DB
            document.cookie = "cod="+codUser+"; expires=Thu, 18 Dec 2050 12:00:00 UTC path=/;"
            thecookie = document.cookie;
          }
          else{
            alert("Wrong e-mail or password.")
          }
          },
            error: function(){
              alert("Error");
            }
    });
  }
}

function checkCookie() {
    var usercookie=getCookie("cod");
    if (usercookie != "") {
            toggle("on"); //turn on the option as logged in, you are logged in using DB
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}