 var fat_fractal = new FatFractal();
$(document).ready(function () {
  		//your code here
			// initialize the FatFractal library
  
 		 var attempt = function () {
        //this.furnitureType = null; this.furnitureStyle = null;
        this.clazz = "MFAttempt"; this.guid = null; this.version = null;
    };
		reloadAttempts()
	
		});
	
	  function getAttempts(){
	
		}

	
		function reloadAttempts(){
		 var url = "ff/resources/MFAttempt";
		 if($("#className").text().length >0)
			{
				url = "ff/resources/MFAttempt?mfclassId = '"+$("#className").text()+"'";
			}
			else{
				return;
			}
		  
    	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
                if (returnedData != null) {
                    for (var i = 0; i < returnedData.length; i++) {
                       // viewModel.furniture.push(returnedData[i]);
											 console.log("Furniture "+returnedData[i]);
											 var date = new Date(returnedData[i].attempt_date);
											 var n = returnedData[i].name;
	      							 var fr = 	returnedData[i].fractions;
											 var fr_str ="";
											 for(var j=0;j<fr.length;j++){
												 	fr_str = fr_str +" "+fr[j].numerator  +"/" + fr[j].denominator;
	  										}
		
											 var date_sts =date.getFullYear()+"/"+date.getMonth()+" " +date.getHours()+":"+date.getMinutes();
                     	 var score = returnedData[i].score;									 
											 var nr = i+1;
											 
											 $("#attemptsTable").append("<tr><td>"+nr+"</td><td>"+n+"</td><td>"+score +"</td><td>"+fr_str+"</td><td>"+date+"</td></tr>");
										
										}
                }
            }
    );
			
			}
		

/* 
    // the "viewModel" which we attach to our html using KnockoutJS
    var viewModel = {
        userName: new ko.observable(""), password: new ko.observable(""),
 
        // Yup - it's a login function!
        login: function() {
            fat_fractal.login(viewModel.userName(), viewModel.password(),
                    function(loggedInUser) { viewModel.userName(loggedInUser.userName); viewModel.password(""); },
                    function(statusCode, statusMessage) { alert("Failed to login: " + statusMessage); });
        },
 
        // And a logout function
        logout: function() {
            fat_fractal.logout(function(logoutResponse) { viewModel.userName(""); viewModel.password(""); },
                    function(statusCode, statusMessage) { alert("Failed to logout: " + statusMessage); });
        },
 
        // An array to hold our list of furniture objects
        furniture: new ko.observableArray([]),
 
        // Function called when the "Add a piece of Furniture" button is clicked
        addFurniture: function () {
            viewModel.furniture.push(new Furniture());
        },
 
        // Function called when the "Save" button is clicked for a Furniture object
        // If the object's guid is null, then we'll CREATE, otherwise we'll UPDATE
        saveFurniture: function (furniture) {
            if (furniture.guid == null)
                fat_fractal.createObjAtUri(furniture, "Furniture",
                        function(returnedData, statusMessage) { viewModel.furnitureUpdated(furniture); },
                        function(statusCode, statusMessage) { alert("Failed to create Furniture: " + statusMessage); });
            else
                fat_fractal.updateObj(furniture,
                        function(returnedData, statusMessage) { viewModel.furnitureUpdated(furniture); },
                        function(statusCode, statusMessage) { alert("Failed to update Furniture: " + statusMessage); });
        },
 
        // Function called when the "Delete" button is clicked for a Furniture object
        removeFurniture: function (furniture) {
            fat_fractal.deleteObj(furniture,
                    function(statusMessage) { viewModel.furniture.remove(furniture); },
                    function(statusCode, statusMessage) { alert("Failed to delete Furniture: " + statusMessage); });
        },
 
        // We're using a very simple view model here, just an observable array.
        // When a piece of furniture is updated via a response from the server, then
        // we need to let knockout know that the array has been modified
        blank: new Furniture(),
        furnitureUpdated: function(furniture) {
            viewModel.furniture.replace(furniture, viewModel.blank);
            viewModel.furniture.replace(viewModel.blank, furniture);
        }
    };
 */
    // Apply the KnockoutJS bindings
 //   ko.applyBindings(viewModel);
 
    // Finally, now everything is initialized, get all the Furniture from the server
  
