

var ligaFixtureAt = teams["matches"]; // ACCEDER AL ARRAY EN POSICION "FixtureAt"
var teamsLigaAt = teams["clubs"];


console.log(teams["matches"]);
console.log(teams["clubs"]); // CONSOLE VER POSICION CORRECTA


//------------------------------


function convertJson() {

  for (var i = 0; i < teamsLigaAt.length; i++)
    teamsLigaAt[i]["key"] = "http://statics.laliga.es/img/escudos/gb/" + teamsLigaAt[i]["key"] + ".png";

  for (i = 0; i < ligaFixtureAt.length; i++)
    ligaFixtureAt[i]["team1"]["key"] = "http://statics.laliga.es/img/escudos/gb/" + ligaFixtureAt[i]["team1"]["key"] + ".png";

  for (i = 0; i < ligaFixtureAt.length; i++)
    ligaFixtureAt[i]["team2"]["key"] = "http://statics.laliga.es/img/escudos/gb/" + ligaFixtureAt[i]["team2"]["key"] + ".png";

  for (i = 0; i < teamsLigaAt.length; i++)
    for (var j = 0; j < ligaFixtureAt.length; j++)
      if (ligaFixtureAt[j]["team1"]["code"] == teamsLigaAt[i]["code"]) {

        ligaFixtureAt[j]["team1"]["location"] = teamsLigaAt[i]["location"]
        ligaFixtureAt[j]["team1"]["address"] = teamsLigaAt[i]["address"]
      }
  else if (ligaFixtureAt[j]["team2"]["code"] == teamsLigaAt[i]["code"]) {

    ligaFixtureAt[j]["team2"]["location"] = teamsLigaAt[i]["location"]
  }

}
convertJson();

var filterTeamsLiga = [];
var filterGameLoc = [];
var playersTeamList =[];


var app = new Vue({
  el: '#app',
  data: {
    ligaFixture: [],
    teamsLiga: [],
    gameLocat: [],
    playersList: []
  },
  methods: {
    teamsGame: function (code, name) {

      showTeamGames(code);
      console.log(code);
      console.log(name);
    },
    gameLocation: function (date) {

      console.log(date);
      showGameLocation(date);

    },
      playersTeam: function (key){
        console.log(key);
        playersTeamList.pop();
        playersTeam(key);
      },
    ubicMaps: function(){
      ubicMaps();
    }
  }
});


app.ligaFixture = filterTeamsLiga;
app.gameLocat = filterGameLoc;
app.teamsLiga = teamsLigaAt;
app.playersList = playersTeamList;



function showTeamGames(code, date) {

  document.getElementById("home").style.display = "none";
  document.getElementById("schedule").style.display = "flex";
  document.getElementById("detailsmatch").style.display = "none";
  document.getElementById("playerTeam").style.display = "none";
 // document.getElementById("mapStadium").style.display = "none";
  filterGameLoc.pop();
  
  for (var i = 0; i < ligaFixtureAt.length; i++)

    if (ligaFixtureAt[i]["team1"]["code"].includes(code)) {
      filterTeamsLiga.push(ligaFixtureAt[i]);
    }
  else if (ligaFixtureAt[i]["team2"]["code"].includes(code)) {
    filterTeamsLiga.push(ligaFixtureAt[i]);
  }
  console.log(filterTeamsLiga);

  /* var x = document.getElementsByTagName("a").getAttribute("class");
  document.getElementById("demo")
  alert(x);
  console.log(x);*/
}

function showGameLocation(date) {

  document.getElementById("schedule").style.display = "none";
  document.getElementById("detailsmatch").style.display = "flex";
  
  app.playersList.pop();
  filterGameLoc.pop();

  for (var i = 0; i < filterTeamsLiga.length; i++)
    if (filterTeamsLiga[i]["date"].includes(date)) {
      filterGameLoc.push(filterTeamsLiga[i]);
    }

  console.log(filterGameLoc);
  console.log(date);
}

function playersTeam(key){
  
  document.getElementById("playerTeam").style.display = "flex";
  document.getElementById("stadiumLoc").style.display = "none";
  //playersTeamList.pop();
  
  for (var i = 0; i < teamsLigaAt.length; i++)
    if (teamsLigaAt[i]["code"].includes(key)) {
      playersTeamList.push(teamsLigaAt[i]["players"]);
    }
  
}

function ubicMaps(){
  
  document.getElementById("stadiumLoc").style.display = "flex";
  document.getElementById("playerTeam").style.display = "none";
}

function startChat() {
  
  filterGameLoc.pop();
  document.getElementById("home").style.display = "none";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("detailsmatch").style.display = "none";
  document.getElementById("mainnav").style.display = "none";
  document.getElementById("homeChat").style.display = "flex";
 // document.getElementById("mainPageLogin").style.display = "flex";
 
  document.getElementById("playerTeam").style.display = "none";
  // alert("Entra al Chat");
 scrollToEnd();
}



//---------CHAT----------

document.getElementById("login").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", writeNewPost);
document.getElementById("create-post").addEventListener("click", deleteInput);
document.getElementById("singOut").addEventListener("click", singOut);

firebase.auth().onAuthStateChanged(function (user) {

  if (user != null) {
    document.getElementById("singOut").style.display = "flex"; //none
    document.getElementById("login").style.display = "none";
   // document.getElementById("homeChat").style.display = "flex";
    document.getElementById("chat").style.display = "flex";
    //document.getElementById("mainPageLogin").style.display = "none"; 
    console.log("we are logged in");
    getPosts();
  } else {
     document.getElementById("singOut").style.display = "none";
    document.getElementById("login").style.display = "flex";
   // document.getElementById("chat").style.display = "none"; //none
    console.log("we are logged out");
  }
});

function login() {
  console.log("log");
   
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
  
  scrollToEnd();
}

function singOut() {
  console.log("log");

  // var providerOut = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signOut();
 // alert("we are logged out");

}

function writeNewPost() {

  var text = document.getElementById("textInput").value;
  var userName = firebase.auth().currentUser.displayName;
  var preDate = new Date();
  var date = preDate.toLocaleTimeString();

  // A post entry.
  var postData = {
    name: userName,
    body: text,
    date: date
  };

  //console.log(text);
  //console.log("postData");
  //console.log(postData["body"]);

  if (postData["body"] !== "") {

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    console.log("newPostKey");
    console.log(newPostKey);

    var updates = {};
    updates[newPostKey] = postData;

    console.log(updates);
    console.log(updates["body"]);

    firebase.database().ref().child("posts").update(updates);
  } else {
    //alert("vacio");
  }
}

function getPosts() {

  var userName = firebase.auth().currentUser.displayName;
  firebase.database().ref().child('posts').on('value', function (data) {

    //console.log(data);
    var posts = data.val();
    //console.log(posts);

    var logs = document.getElementById("posts");
    logs.innerHTML = "";

    for (var key in posts) {

      var mainMensaje = document.createElement("div");
      var att = document.createAttribute("class");
      var att2 = document.createAttribute("class");
      att.value = "meChat";
      att2.value = "theyChat";

      var user = document.createElement("h5");
      mainMensaje.appendChild(user);
      var mensajeName = posts[key].name;

      var text = document.createElement("h4");
      mainMensaje.appendChild(text);
      var mensaje = posts[key].body;


      var datePost = document.createElement("h6");
      mainMensaje.appendChild(datePost);
      var date = posts[key].date;


      console.log("---", userName);
     

      if (userName == mensajeName) {
        mainMensaje.setAttributeNode(att);
      } else {
        mainMensaje.setAttributeNode(att2);
      }
      //mainMensaje.scrollTop = mainMensaje.clientHeight + mainMensaje.scrollHeight ;
      user.textContent = mensajeName;
      text.textContent = mensaje;
      datePost.textContent = date;

      logs.append(mainMensaje);
    
    }
    scrollToEnd();
  });

}

function scrollToEnd() {

  /*var chatContainer = document.querySelector(".posts");
  var scrollHeight = chatContainer.scrollHeight;
  chatContainer.scrollTop = scrollHeight;*/ 
  var chatContainer = document.querySelector(".posts");
  chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight; 
}

function deleteInput() {

  document.getElementById("textInput").value = "";
}


//---------FIN CHAT----------
