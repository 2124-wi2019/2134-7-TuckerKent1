/*
    Tucker Kent
    script.js
    19SP_INFO_2134_WW Online - JavaScript II
    Thoendel
    25 april 2020
*/

window.addEventListener("load", (e) => { //event listened added for load event

    const errorHolder = document.getElementById("errorHolder"); //setting reference to errorHolder div
    const wrapper = document.getElementById("wrapper"); //setting reference to wrapper section
    const left = document.getElementById("left"); //setting reference to left div
    const right = document.getElementById("right"); //setting reference to right div

    displayLoading(left, "Loading employee list..."); //invoking displayLoading function to display the loading text on page
    const listURL = "https://www.mccinfo.net/epsample/employees"; //set url for employee list

    fetch(listURL) //invoking fetch api
     .then((response) => { //when response is received
         if(response.ok){ //if response status returns okay
             return response.json(); //returning response as json object
         }
         throw new Error(response.statusText); //if error -- logs status text
     })
      .then((employees) => { //using returned json data
          console.log(employees); //logging data to console

          let pElement = document.createElement("p"); //creating paragraph element
          pElement.innerHTML = "Select an employee from the list below:";//setting innerHTML of the paragraph element

          let employeeList = document.createElement("select"); //creating select element
          employeeList.id = "employeeList"; //setting id value of select element

          let option = document.createElement("option"); //creating option element
          option.value = ""; //setting value of the option element to blank
          option.innerHTML = " --Select an option-- "; //setting innerHTML of option element 
          employeeList.appendChild(option); //appending option element to select element

          for(let employee of employees){ //foreach loop to loop through returned json data
              option = document.createElement("option"); //creating option element for each iteration
              option.value = employee.id; //setting option value to employee id value
              option.innerHTML = `${employee.first_name} ${employee.last_name} (${employee.department.name})`; //creating string literal for each option display
              employeeList.appendChild(option); //appending this iterations optoin to employeeList select element
          }
          clearContainer(left); //calling clearContainer method to empty the specified div
          left.appendChild(pElement); //appending paragraph element to div
          left.appendChild(employeeList);//appending employeeList to div element

          employeeList.addEventListener("change", onChange); //when employeeList value changes, logs selected employee id of the change to the console
      })
       .catch(error => console.log("Error:   " + error)); //catching error if necessary and logging to console

    function clearContainer(side) { //function to clear innerHTML of specified side
        side.innerHTML = ""; //setting specified div to blank
    }

    function displayLoading(side, text) { //function to add the loading display text to page
        if (text === undefined){ //if text was not specified as argument
            text = "Loading content..."; //sets text to string
        }
        if (side != left && side != right){ //if argument did not include left or right
            throw new Error("Parameter will only accept left or right for the side"); //throws descriptive error
        } else { // if side was passed correctly
            let loadingPara = document.createElement("p"); //creates paragraph element
            loadingPara.innerText = text; //sets inner text of p element to text variable
            side.appendChild(loadingPara); //appends paragraph element to specified div side
            let emptyDiv = document.createElement("div"); //creates div element
            emptyDiv.classList.add("loading"); //adds loading class to div
            emptyDiv.classList.add("centered"); //adds centered class to div
            side.appendChild(emptyDiv); //appends div to specified div
        }
    }

    //begin step 2  -- I decided to update this function because it was already working toward step 2
    function onChange(eventObject) { //function to log value of select option
        console.log(eventObject.target.value); //logging target value of the event passed to function
        let employeeURL = listURL + `/${eventObject.target.value}`; //setting employeeURL based on previous url and adding a / with the employee id passed from previous fetch

        if(event.target.value !== ""){ //if the employee id passed is not blank
            clearContainer(right); //clearing container with helper function
            displayLoading(right, "Loading content..."); //displaying loading text with helper function
            fetch(employeeURL) //invoking fetch api for updated url
             .then((response) => { //when we get a response
                 if(response.ok){ //if response status is okay
                     console.log(response); //logging response to console
                     return response.json(); //returning response as json object
                }
                throw new Error(response.statusText); //if error -- log status text
             })
              .then((employee) => { //using the employee json data returned
                let h1 = document.createElement("H1"); //creating h1 element
                h1.innerHTML = `${employee.first_name} ${employee.last_name}`; //appending employee data to h1

                let h2 = document.createElement("H2"); //creating h2 element
                h2.innerHTML = `Department: ${employee.department.name}`; //appending department name to h2

                let p1 = document.createElement("p"); //creating paragraph element
                p1.innerHTML = `Annual Salary: ${employee.annual_salary}`; //appending salary data 

                let p2 = document.createElement("p"); //creating paragraph element
                p2.innerHTML = `Hire Date: ${employee.hire_date}`; //appending hired date data to p element

                clearContainer(right); //clearing loading text and any previous empoyee data from right div
                right.appendChild(h1); //appending element
                right.appendChild(h2); //appending element
                right.appendChild(p1); //appending element
                right.appendChild(p2); //appending element
                fetchPhoto(employee.image_filename); //step 3 calling this so I can separate code nicely with function
                //begin step 4
                addAnchor(); //using funciton to add anchor element
                let deptAnchor = document.getElementById("deptAnchor"); //getting reference to the added anchor element so I can add event listener
                deptAnchor.addEventListener("click", () => { //event listener added for when link is clicked on
                    getDepartmentList(employee); //invoking function to get the list of employees in the department
                });
                //end step 4 -- continued below
            })
               .catch(error => { //if error is thrown
                    console.log("Error occurred during fetch:    " + error); //logging error
                });
        } else { //if employee id passed to function is blank
            clearContainer(right); //clear container
        }
    }
    //end step 2
    //begin step 3
    function fetchPhoto(photoURL) { //function to fetch the selected employee photo
        fetch(photoURL, { //invoking fetch with built in request interface
            method: "GET", //using get method
            mode: "cors", //allowing cors
            redirect: "follow" //following the redirect -- image_filename contains a separate url
        })
        .then((response) => { //when response is received
            if(response.ok){ //if response status is ok
                console.log(response); //log response data
                return response.blob(); //return response as blob object
            }
            throw new Error(response.statusText); //if error log statusText
        })
        .then((blob) => { //work with the blob
            let imageElement = new Image(); //create new img element
            imageElement.src = URL.createObjectURL(blob); //setting src of img element to blob location
            right.appendChild(imageElement); //appending image element to right div
        })
        .catch(error => console.log("Error occurred retrieving photo:    " + error)); //catch and log error
    }
    //end step 3
    //begin step 4
    function addAnchor(){ //function adding anchor element to document
        let deptAnchor = document.createElement("a"); //creating element
        deptAnchor.innerText = "View Department"; //setting inner text
        deptAnchor.id = "deptAnchor"; //setting id value
        let imgTag = document.getElementsByTagName("img")[0]; //getting reference to image tag to place anchor above
        right.insertBefore(deptAnchor, imgTag); //placing anchor before image tag
    }


    function getDepartmentList(employee) { //function to create and display department list
        let empID = employee.department.id; //getting department id value
        fetch(listURL) //invoking fetch
         .then((response) => { //when response is received
             if(response.ok){ //if response status is ok
                 console.log(response); //logging response for verification
                 return response.json(); //returning response as json object
             }
             throw new Error(response.statusText); //if error -- log status text
         })
          .then((employees) => { //using json data
              let deptUL = document.createElement("ul"); //creating ul element
              let h4 = document.createElement("h4"); //creating h4 element
              h4.innerHTML = `Department: ${employee.department.name}`; //setting h4 text
              let h5 = document.createElement("h5"); //creating h5 element
              h5.innerHTML = `Employees`; //setting h5 text
              let horizontalRule = document.createElement("hr"); //creating hr element
              right.appendChild(h4); //appending h4
              right.appendChild(h5); //appending h5
              right.appendChild(horizontalRule); //appending hr

              for(let employee of employees){ //for each to iterate through employees returned
                  if(employee.department.id === empID){ //if employee id matches the employee id passed to function
                      let deptLI = document.createElement("li"); //create li element
                      deptLI.innerHTML = `${employee.first_name} ${employee.last_name}`; //setting li text
                      deptUL.appendChild(deptLI); //appending li element to ul
                  }
              }
              right.appendChild(deptUL); //appending ul
          })
          .catch(error => console.log("Error occurred during fetch operation:   " + error)); //if error -- log to console
    }
    //end step 4
});