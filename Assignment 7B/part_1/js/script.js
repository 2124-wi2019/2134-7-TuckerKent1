/*
    Tucker Kent
    script.js
    19SP_INFO_2134_WW Online JavaScript II
    Thoendel
    23 April 2020
*/

window.addEventListener("load", (event) => { //event listener added to window object upon load

    const leftSide = document.getElementById("left"); //constant to store div location with id of left
    const rightSide = document.getElementById("right"); //constant to store div location with id of right
    const errorHolder = document.getElementById("errorHolder"); //constant to store div location with id of errorHolder 
    const airportCode = document.getElementById("airportCode"); //constant to store location of input field
    const actionAnchor = document.getElementById("actionGetWeather"); //constant to store location of anchor element 
    const airportNameContainer = document.createElement("div"); //constant to create and store reference to a new div element
    const wrapper = document.getElementById("wrapper"); //contstant to store location of wrapper section
    

    actionAnchor.addEventListener("click", (e) => { //event listener add to anchor element on click
        if(checkAirportCode()){ //checking if airport code is of valid format and a valid code
            displayLoading(rightSide, "Loading content..."); //displayloading function called to display the message in right div
            let url = `https://w1.weather.gov/xml/current_obs/display.php?stid=K${airportCode.value}`; //url created in template literal to add changeable airport code at end of string
            fetch(url) //calling fetch function
             .then((response) => { //using response of fetch
                if(response.ok){ //if response is ok / 200 status
                    return response; //returning response to be used
                }
                throw new Error("Error: " + response.statusText); // if error log status text
             })
              .then(response => response.text()) //converting response to text format
                .then(clearLoading()) //clear right div of any text or html
                    .then(text => displayData(text)) //calling the displayData function to display the text returned in response
                        .catch(error => console.log(error)); //if error -- catches and logs
        }
    });

    //begin step 2
    
    airportCode.addEventListener("blur", (e) => { //event listener added on blur event of input field
        if(checkAirportCode() === false){ //checking if airport code is not valid
            e.preventDefault(); //if not valid -- preventing submission
            airportCode.focus(); //focusing back on the input field
        } else { //if checkAirportCode returns true
            clearErrorHolder(); //clears the error div via function
        } 
    });

    //end step 2
    //begin step 3
    const airportCodes = ["anw", "bvn", "aia", "auh", "bie", "bta", "hte", "bbw", "cdr", "olu", "fnb", "fet", "gri",//added array of airport codes into constant 
                             "hsi", "hjh", "iml", "ear", "ibm", "lxn", "lnk","mck", "mle", "afk", "ofk", "lbf", "onl", "oga", "off",//codes cont.
                             "oma", "odx", "pmv", "bff", "sny", "tqe", "tif", "vtn", "ahq", "lcg", "jyr"];//codes cont.
    
    document.body.insertBefore(airportNameContainer, wrapper); //inserting airport name container in body of document -- before wrapper section
    let airportCodeString = "Note -- You must choose one of the following airport codes: \n\n"; //declaring string and adding a helpful text
    let entryCounter = 0; //declaring a counter variable
    for(let code of airportCodes){ //foreach loop to loop through airport codes
        airportCodeString += (code); //adding iterated code to the string
        entryCounter++; //incrementing counter
        if(code !== "jyr"){ //if the code is not "jyr" -- last on the list
            airportCodeString += ", "; // adding a comma and space -- could have just added this more simply as an html element, but in the spirit of practice..
        }
        if(entryCounter === 7){ //if the counter variable is equal to 7 (seven airport codes on each row)
            airportCodeString += "\n"; //adds new line escape character
            entryCounter = 0; //resets counter variable
        }
    }
    airportNameContainer.innerText = airportCodeString; //appending the string as innerText so that the escape characters will work -- learned this the hard way
    //end step 3 --continued in checkAirportCode()

    function displayLoading(side, loadingText) { //function to display loading text in rightSide div
        if(loadingText === undefined){ //if loadingText was not passed as argument
            loadingText = "Loading content..."; //setting loadingText string
        }
        if(side != leftSide && side != rightSide){ //if leftSide or rightSide were not passed as argument
            throw new Error("displayLoading() only accepts leftSide or RightSide as parameter"); //throwing descriptive error
        } else { //if leftSide or rightSide were passed to function
            let loadingPara = document.createElement("p"); //creating and storing a paragraph element
            loadingPara.innerHTML = loadingText; //setting the passed text into the paragraph element
            side.appendChild(loadingPara); //appending paragraph element
            let loadingDiv = document.createElement("div"); //creating div element
            loadingDiv.classList.add("loading"); //adding loading class to div
            loadingDiv.classList.add("centered"); //adding centered class to div -- which isn't on the css file
            side.appendChild(loadingDiv); //appending loading div to the passed side  
            }
    }

    function clearLoading() { //function clearLoading()
        rightSide.innerHTML = ""; //sets rightSide to blank string
    }

    // checkAirportCode() upated in step 3 to contain helper functions
    function checkAirportCode() { //function to check validity of airport code input
        let aCode = airportCode.value; //passing input field value to variable for simplicity
        if(aCode.length !== 3) { //if the length is not equal to 3 digits
            clearErrorHolder(); //clears error div
            createErrorMessage("Airport code can only contain 3 letters"); //calls function to create and append error message
            return false; //returns false boolean to calling method
        } else if(compareAirportArray(aCode) === false) { //else if -- checks if the airport code matches an array of valid code values -- if false
            clearErrorHolder(); // clears error div
            createErrorMessage("Airport code must match one of the 3 digit codes listed below"); //creates and appends error message passed with function
            return false; //returns false to calling method
        } else { //if neither previous condition is met
            return true; //returns true
        }       
    }
    // step 3 continued
    function compareAirportArray(inputCode) { //function to compare input value to array of values to check validity
        for(let code of airportCodes){ //foreach loop to iterate array values
            if(inputCode.toLowerCase() === code.toLowerCase()){ //if input code matches an array code
                return true; //returns true -- valid code entered
            }
        }
        return false; //if no match is found -- returns false
    }

    function clearErrorHolder(){ //function to clear the errorHolder div
        errorHolder.innerHTML = ""; //setting innerHTML to blank string
        errorHolder.setAttribute("class", "hidden"); //setting errorHolder class to hidden
    }

    function createErrorMessage(errorString){ //function to create and append error message to error div
        errorHolder.innerHTML = ""; //sets innerHTML to blank string
        errorHolder.innerHTML = errorString; //appends passed error message
        errorHolder.setAttribute("class", "visible"); //sets class to visible
        errorHolder.classList.add("error"); //adds error class
        errorHolder.classList.add("errorBox"); //adds errorBox class
    }
    // end step 3
    //begin step 4
    function displayData(xmlString) { //function display data -- parses xml file and displays it in right div
        let parser = new DOMParser(); //creating new DOMParser object as parser
        let xmlDoc = parser.parseFromString(xmlString, "text/xml"); //translating returned text file 
        console.log(xmlDoc); //logging the xml file to console
        let location = xmlDoc.getElementsByTagName("location")[0].innerHTML; //getting location from xml file
        let temp_f = xmlDoc.getElementsByTagName("temp_f")[0].innerHTML; //getting farenheit temp from xml file
        let temp_c = xmlDoc.getElementsByTagName("temp_c")[0].innerHTML; //getting celsius temp from xml file
        let windchill_f = xmlDoc.getElementsByTagName("windchill_f")[0].innerHTML; //getting windchill temp in farenheit from xml file
        let windchill_c = xmlDoc.getElementsByTagName("windchill_c")[0].innerHTML; //getting windchill temp in celsius from xml file
        let visibility_mi = xmlDoc.getElementsByTagName("visibility_mi")[0].innerHTML; //getting visibility from xml file
        let wind_mph =  xmlDoc.getElementsByTagName("wind_mph")[0].innerHTML; //getting windspeed from xml file
        let h1Element = createElement("H1", "Current Weather"); //creating h1 element with specified text -- via function
        let h2Element = createElement("H2", location); //creating h2 element with specified text -- via function
        let ulElement = createElement("ul", "");//creating ul element with specified text -- via function
        let li1 = createElement("li", `${temp_f}${"&#176"}F (${temp_c}${"&#176"}C)`);//creating li element with specified text -- via function
        let li2 = createElement("li", `Wind Speed: ${wind_mph} MPH`);//creating li element with specified text -- via function
        let li3 = createElement("li", `Visibility: ${visibility_mi} Miles`);//creating li element with specified text -- via function
        let imageElement = document.createElement("img"); //created img element for step 5
        //begin step 6 
        clearLoading(); //clears value of right div
        //end step 6 (continued below also)
        rightSide.appendChild(h1Element); //appending element to right div
        rightSide.appendChild(h2Element); //appending element to right div
        rightSide.appendChild(ulElement); //appending element to right div
        ulElement.appendChild(li1); //appending li to ul
        ulElement.appendChild(li2); //appending li to ul
        ulElement.appendChild(li3); //appending li to ul
        rightSide.appendChild(imageElement); //added img element to rightSide as part of step 5
        fetchWeatherIcon(imageElement, xmlDoc); //added as part of step 5 -- to fetch the weather icon and add it to the div id right
    }

    function createElement(elementChoice, textChoice){ //function to create an element with a passed innerHTML text
        let element = document.createElement(elementChoice); //creating passed element type
        element.innerHTML = textChoice; //setting passed text value to element
        return element; //returning element
    }

    //end step 4
    //begin step 5
    function fetchWeatherIcon(elementName, xmlDoc){ //function to fetch the weather icon 
        //begin step 6
        let siteURL = "http://forecast.weather.gov/images/wtf/large/"; //set the site url to the actual URL and changed small to large
        //end step 6
        let iconURL = xmlDoc.getElementsByTagName("icon_url_name")[0].innerHTML; //setting icon url via what is returned in the xmlDoc that was fetched previously
        let completeURL = `${siteURL}${iconURL}`; //adding the two url pieces together in a template literal
        fetch(completeURL, { //fetching icon with built in request interface
            method: "GET", //GET method to recieve data
            mode: "cors", //cors enabled to allow fetch outside of domain
            redirect: "follow" //if a redirect happens -- follow it 
        })
          .then((response) => { //after respone is received
              if(response.ok){ //if response is successful / 200 status
                  console.log(response); //logging response for my own verification
                  return response.blob(); //returning response received as a blob object
              }
              throw new Error(response.statusText) //if error -- throw status text
          })
            .then(blob => { //using blob data
                console.log(blob); //logging blob for my own verification
                elementName.src = URL.createObjectURL(blob); //setting the passed elements src value to return value of URL.createObjectURL (so the src knows where to look) -- to display image on the element
            })
             .catch(error => console.log("Error retrieving icon:     " + error)); //if error is thrown -- log to console
    }
    //end step 5




});