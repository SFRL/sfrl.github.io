
        var slideIndex = 1; //Which slide (Bots/Survey) is active 
        var welcomeIndex = 1; //Which welcome screen is active
        var random = new Array(document.getElementsByClassName("mySlides").length); //Array to randomise the order of the bots
        var submitFlag = false; //Check if the form has been submitted 

        //Setup Function
        function setup() {
            //display welcome screen
            document.getElementById("welcome").style.display = "block";
            document.getElementById("firstWelcome").style.display = "block";

            //fill the random array
            for (var i=0; i<random.length; i++) {
                random[i] = i;
            }

            //initialise Eliza
            start();

            //randomise the chatbot order
            shuffleBots();

        }

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

        //Randomise the chatbot order
        function shuffleBots() {
            var slides = document.getElementsByClassName("mySlides");
            var length = (slides.length - 1) / 2 ;
            var renumber = document.getElementsByClassName("numbertext");
            var j, x, i;


            for (i = length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = random[2*i];
                random[2*i] = random[2*j];
                random[2*i+1] = random[2*i]+1;
                random[2*j] = x;
                random[2*j+1] = random[2*j] + 1;
                }

            //Number the bots in the right order
            for (i = 0; i<length; i++) {
                var j = i + 1;
                renumber[random[2*i]].innerHTML = "Entity " + j + "/" + length;
                renumber[random[2*i+1]].innerHTML = "Survey " + j + "/" + length;
            }

        }

        //Next Welcome screen
        function nextWelcome() {
            var i;
            welcomeIndex++;
            var slides = document.getElementsByClassName("myWelcome");

            for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                }
            slides[welcomeIndex-1].style.display = "block";

        }



        //Get all the the bot Navigation buttons
        var naviButtons = document.getElementsByClassName("navibutton");
        
        //Display the chat bots and survey


        
        function startStudy() {

        if(checkInfos()) {
            document.getElementById("welcome").style.display = "none";
            document.getElementById("warning1").style.display = "none";
            document.getElementById("bots").style.display = "block";
            document.getElementById("next").style.display = "block";
            showSlides(slideIndex);
        }
        else {
            document.getElementById("warning1").style.display = "block";
        }

        }

        //Check if all personal information have been entered
        function checkInfos() {

            for(var i=0;i<4;i++) {
                if(document.getElementById("survey").elements.item(i).checked == true) {
                    if (document.getElementById("survey").elements.item(5).checked == true || document.getElementById("survey").elements.item(6).checked == true )
                        {
                            return true;
                        }
                    else {return false;};
                }
                else if (document.getElementById("survey").elements.item(i).checked == false && i == 3) {
                    return false;
                }
            }


            return false;
        }


        //Next slide
        function plusSlides(n) {
            showSlides(slideIndex += n);

            }

        function currentSlide(n) {
            showSlides(slideIndex = n);
            }

        //Display Slides
        function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("mySlides");

            if (slideIndex > 1) {
                document.getElementById("prev").style.display = "block";
                }
            else {
                document.getElementById("prev").style.display = "none";
            }

           if (slideIndex < slides.length) {
                document.getElementById("next").style.display = "block";
                }
            else {
                document.getElementById("next").style.display = "none";
            }

            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[random[i]].style.display = "none";
                }

            slides[random[slideIndex-1]].style.display = "block";
            
            naviButtons[Math.floor((slideIndex-1)/2)].style.display = "inline-block";
            }



        //Display slider values
        var sliders = document.getElementsByClassName("slider");
        var sliderFlag = new Array(sliders.length);
        var sliderOutputs = document.getElementsByName("slideroutput");

        function sliderValue(n) {
            sliderOutputs[n].innerHTML = "Value: " + sliders[n].value;

            if(!sliderFlag[n]) {
                sliderFlag[n] = true; //Save that the slider has been moved 
            }
        }


        //Ask to submit before leaving
        function leaving() {
            if(!submitFlag) {
            return "It would be great if you would submit your progress before leaving";
            }
        }

        //Submit all survey forms at once
        var messagesRef = firebase.database().ref('data');

        function submitForms(){

              //Define length of data array, only ticked elements should count but ...elements.length gets the number of all elements
              var numberofelements = document.getElementById("survey").elements.length;
              var data = new Array (numberofelements - (document.getElementsByClassName("mySlides").length-1)/2 - 4 + 1);
              var j = 0; //Active Form Element Counter
              var n = 0; //Slider Counter
                    for (var i = 0; i<numberofelements; i++) {

                        var currentItem = document.getElementById("survey").elements.item(i);
                        var nextItem = document.getElementById("survey").elements.item(i+1);

                        if(currentItem.checked == true || currentItem.tagName == "TEXTAREA" || currentItem.tagName == "SELECT") {


                            if(!currentItem.value) {
                                data[j] = "-";
                            }
                            else {
                                data[j] = currentItem.value;
                            }
                            j++;
                        }
                        else {
                            if (currentItem.className == "slider") {
                                 if (!sliderFlag[n]) {
                                     data[j] = "-"; 
                                    }
                                 else {
                                    data[j] = currentItem.value;
                                 }

                                 n++;
                                 j++;
                            }
                            else if (currentItem.checked == false && nextItem.checked == false && i>6) {
                                    data[j] = "-";
                                    j++;
                                    i++;
                            }
                        }

                    }

            //Add the order of chatbots to data
            var botOrder = "";

            for(var i = 0; i<random.length; i+=2) {
            switch(random[i]) {
                case 0:
                botOrder = botOrder + " " + "Eliza";
                break;

                case 2:
                botOrder = botOrder + " " + "Cleverbot";
                break;

                case 4:
                botOrder = botOrder + " " + "Mitsuku";
                break;
            
                case 6:
                botOrder = botOrder + " " + "UltraHal";
                }

            }

            data[data.length - 1] = botOrder;

            //Submit data to firebase
            var newMessageRef = messagesRef.push();
            newMessageRef.set({
                    a_Gender: data[0],
                    b_Age: data[1],
                    c_Native_English: data[2],
                    d_Chatbot_Order: data[15],
                    e_Eliza_Score: data[3],
                    f_6_Eliza_Emotion: data[4],
                    g_7_Eliza_Comment: data[5],
                    h_8_Cleverbot_Score: data[6],
                    i_9_Cleverbot_Emotion: data[7],
                    j_10_Cleverbot_Comment: data[8],
                    k_11_Mitsuku_Score: data[9],
                    l_12_Mitsuku_Emotion: data[10],
                    m_13_Mitsuku_Comment: data[11],
                    n_14_UltraHal_Score: data[12],
                    o_15_UltraHal_Emotion: data[13],
                    p_16_UltraHal_Comment: data[14]

                    });


            //Hide last slide and buttons
            document.getElementById("bots").style.display = "none";
            document.getElementById("next").style.display = "none";
            document.getElementById("prev").style.display = "none";

            //Show submit confirmation
            document.getElementById("bye").style.display = "block";
            document.getElementById("byeText").style.display = "block";
            document.getElementById("botnavi").style.display = "none";

            //The form has been submitted  
            submitFlag = true;

            //alert(data);

        }