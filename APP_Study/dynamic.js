let player; //Youtube Video Player
let videoLength = 0;
let numberOfFields = 0;
let resolution = 1;
let videoID;

//array to collect ad-hoc evaluation data
let realtimeData;

//Variables to track the progress of the study
let pages;
let currentPage = 0;
let videoStage = 0;

//Display Sliders
let sliders = document.getElementsByClassName("slider");
let sliderFlag = new Array(sliders.length);
let sliderOutputs = document.getElementsByName("slideroutput");

// Initialize Firebase
var config = {
            apiKey: "AIzaSyB0hCRQiEMe6IHuIjDdh0vufIMDaG9xyag",
            authDomain: "chatbotdatabase-da33b.firebaseapp.com",
            databaseURL: "https://chatbotdatabase-da33b.firebaseio.com",
            projectId: "chatbotdatabase-da33b",
            storageBucket: "chatbotdatabase-da33b.appspot.com",
            messagingSenderId: "510893789563"
        };
firebase.initializeApp(config);




function setup() {
     //Get page information
     pages = document.getElementsByClassName("page");
    pages[0].style.display = "inline";
    sizeMain();
}


function sizeMain(){
    let height = window.innerHeight;
    let mainDIVs = document.getElementsByClassName("main");

    for (let i = 0; i < mainDIVs.length; i++) {
        mainDIVs[i].style.height = height - 250 + "px";
    }
}

function loadYT() {
     //Load Youtube API
     var tag = document.createElement('script');
     tag.src = "https://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
     

//Load youtube video and create player
function onYouTubeIframeAPIReady() {

    //Randomely select which performance will be shown in this run
    let performance = Math.random();
    
    if (performance < 0.5) {
        videoID = "fYInCkaOZO8"; //Load performance 1
    }
    else {
        videoID = "EFgWfcGaa6U"; //Load performance 2
    }

    //Construct new player 
    player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoID,
          playerVars: { 'autoplay': 1, 'controls': 0}, //let videoStage = 0;
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
          }
        });




}

//What happens when the video player is ready and loaded 
function onPlayerReady(event) {
    videoLength = player.getDuration();
    numberOfFields = Math.floor(videoLength/resolution);
    console.log(videoLength + " " + numberOfFields);

    //Create Fields for Timeline
    for(let i=0; i<numberOfFields; i++) {
        let field = document.createElement("td");
        field.className = "timelineField";
        //var node = document.createTextNode(i);
        //field.appendChild(node);
        let element = document.getElementById("row1");
        element.appendChild(field);
    }

    //Construct array to save adhod data
    realtimeData = new Array(numberOfFields);
}

//What happens when the video has ended
function onPlayerStateChange(event) {
      if(event.data == 0) {
      videoStage = 2;
      document.getElementById("ratingButton").innerHTML = "Next";
      }
}

    


function ratingButtonClicked() {

   if(videoStage == 0) {
        //Start Video
        loadYT();

        //Change Caption of Button
        document.getElementById("ratingButton").innerHTML = "Vote";

        //Change Stage
        videoStage = 1;
   }
   else if(videoStage == 1) {
   
        //Get current time of the video and change the color of the correlated timeline field
        let currentTime =  player.getCurrentTime();
        let index = Math.floor(currentTime/resolution);
        if(index > numberOfFields) {
            index = numberOfFields; }

        //Add marker under the video at current playback point
        let currentField = document.getElementsByClassName("timelineField")[index];
        currentField.style.backgroundColor = "green";
        currentField.style.borderColor = "black";

       //Add current playback point to evaluation data
       realtimeData[index] = 1;

   }
  else if(videoStage == 2) {
   nextPage(); 

    }


}

//Go to the next page of the study
function nextPage() {
    currentPage += 1;
    for (let i = 0; i<pages.length; i++) {
        if(i == currentPage) {
            pages[i].style.display = "inline";
        }
    else {
        pages[i].style.display = "none"
}
    }


}


//Surveys
function sliderValue(n) {
            sliderOutputs[n].innerHTML = "Value: " + sliders[n].value;

            if(!sliderFlag[n]) {
                sliderFlag[n] = true; //Save that the slider has been moved 
            }
        }



//Submit all survey forms at once
let messagesRef = firebase.database().ref('data');

function submit(){

    //Define length of data array, only ticked elements should count but ...elements.length gets the number of all elements
    let numberofelements = document.getElementById("survey").elements.length;
    let data = new Array (numberofelements + realtimeData.length);
    let j = 1; //Active Form Element Counter
    let n = 0; //Slider Counter

    if(videoID == 'fYInCkaOZO8') {
       data[0] = "Interactive"; } 
    else {
       data[0] = "Reactive"; 
    }

    
    for (let i = 0; i<numberofelements; i++) {

        let currentItem = document.getElementById("survey").elements.item(i);
        
        if (currentItem.tagName == "TEXTAREA" || currentItem.tagName == "SELECT") {
        
            if (!currentItem.value) {
                data[j] = "-";
            }
            else {
                data[j] = currentItem.value;
            }

            j++;
        }
        else if (currentItem.type == "range"){

                if (!sliderFlag[n]) {
                    data[j] = "-";
                }
                else {
                    data[j] = currentItem.value;
                }
                n++;
                j++;    
        }
        else if (currentItem.type == "radio") {
            let k = 0;
            let checkedFlag = false; 
            let nextItem = document.getElementById("survey").elements;

            while(currentItem.name == nextItem.item(i+k).name) {
                  if(nextItem.item(i+k).checked == true) {
                    data[j] = nextItem.item(i+k).value;
                    j++;
                    checkedFlag = true;
                  }
                  k++;
            }
            i = i + k - 1; //Skip all the other radio buttons that were already checked in the while loop above, 
                           //substract 1 because the for loop will add 1 again at the ende of the cycle
            if(!checkedFlag) {
                data[j] = "-";
                j++;
            }
        }
    }
    
    //Submit data to firebase
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        a_Performance: data[0],
        b_Gender: data[1],
        c_Age: data[2],
        d_Dance: data[3],
        e_Media: data[4],
        f_Enjoy: data[5],
        g_Focus: data[6],
        h_Connection: data[7],
        i_VisualSync: data[8],
        j_MusicSync: data[9],
        k_positveFeedback: data[10],
        l_negativeFeedback: data[11],
        m_generalComments: data[12],
        n_realtimeData: realtimeData

    });

    //Go to next page
    nextPage();

}


//Custom select menu
var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);