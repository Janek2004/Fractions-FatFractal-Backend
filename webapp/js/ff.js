var fat_fractal = new FatFractal();
var currentTeacher = null;
var currentCourse = null;
var teacherCourses = null;
var currentStudents = null;

fat_fractal.debug = true;



var Teacher = function(){
	this.username;
	this.password;
	this.school;
	this.clazz = 'MFTeacher';
	this.guid = null;
};

var Course = function(){
	this.classid;
	this.clazz = 'MFCourse';
	this.teacherId;
	this.guid = null;
	
};

var Student = function(){
	this.classId;
	this.clazz = 'MFStudent';
	this.guid = null;
	this.firstname;
	this.lastname;
	this.email;
	
};

var Attempt = function(){
	this.classId;
	this.clazz = 'MFAttempt';
	this.guid = null;
	this.answer;
	this.question;
	this.date;
	this.studentid;
	this.correct;
};

$(document).on("pagechange",function(event,data){
	console.log(" page change  ");

	 var currentPage = $.mobile.activePage.attr('id');
	if(currentPage === "registrationPage"){
		
		}

if(currentPage !='loginPage'){
	if(!currentTeacher){
		$.mobile.changePage("#loginPage");	
	
	}
	
}
if(currentPage === "coursesListPage"){
			if(!currentTeacher){
				console.log("Current Teacher Doesn't Exist");
			}
			coursesListPageInit();
			
	}

if(currentPage === "coursePage"){
	if(!currentCourse){
			console.log("Potential Problem - current course shouldn't be null");
	}
		coursePageInit();

}		
});




//registration page



//does exist
function checkTeacher(successCallback, teacher){
	
	var url = "ff/resources/MFTeacher/((username eq '"+teacher.username+"') and (password eq '"+teacher.password+"'))";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
			console.log("Status Message" + statusMessage)
			successCallback(returnedData,statusMessage,teacher);	
		});	
}

function registerSuccess(returnedData, statusMessage, teacher)
{
	
	if(returnedData.length ==0){
	//proceed
	fat_fractal.createObjAtUri(teacher, "MFTeacher",
                function(returnedData, statusMessage) {
			console.log("message" + statusMessage);
			console.log("data " + returnedData);
			$("#regStatusMessage").replaceWith('User created. Go back to  <a href="index.html">home page</a> to log in.');		
		},
                function(statusCode, statusMessage) { alert("Failed to register user: " + statusMessage); });
	}
	if(returnedData.length >0){
		$("#regStatusMessage").val('Username already exists.');
		
	}
}

function loginSuccess(returnedData,statusMessage,teacher){
	console.log("Login Return data"+statusMessage + "   " + returnedData[0].guid);	
	if(returnedData.length ==1){
		
		//set current teacher 
		 currentTeacher = returnedData[0];
		 $.mobile.changePage("#coursesListPage");//user found redirect to the user's page
	}
	else{
	
		$("#statusMessage").replaceWith("User not found.");	
	}
}


//register user
function register(username, password, school){
	//add validation
	
	var teacher = new Teacher();
	if((username.val().length >0 )&& (password.val().length>0) && (school.val().length>0)){
		
	  teacher.username = username.val();
	  teacher.password = password.val();
	  teacher.school = school.val();

	  checkTeacher(registerSuccess,teacher);
	  
	}
	else{
		console.log("All fields are required");
		
			return;
		
	}
}

function logoutUser(){
	currentTeacher = null;
	//move to the login page
	
}

//logging in user
function login_user(username, password){
	console.log("_"+username.val());
	console.log("_"+password.val());
	var temp_teacher = new Teacher();
	temp_teacher.username =username.val(); 
	temp_teacher.password =password.val(); 
	
	checkTeacher(loginSuccess,temp_teacher);
}

/* __________________________________COURSES MANAGEMENT SECTION __________________________________*/


//single page
function coursePageInit()
{
	console.log("course page");	
	//get students
	displayAllStudentsForCourse(currentCourse,getStudentsCallback);		
}


function displayAllStudentsForCourse(course, callback)
{
	if(!course) {console.log("course is null"); return;}
	
	var url = "ff/resources/MFStudent/(classid eq '"+course.classid+"')";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
			
			console.log("Get Students" + statusMessage)
			callback(returnedData, statusMessage);
			
		});	
	
}

function getStudentsCallback(returnedData, statusMessage){
		
	currentStudents = returnedData;
	if(returnedData.length >0){
		
	$("#student_list_view").empty();
	$("#student_list_view").append('<li data-role="list-divider">Students in '+ +' </li>');	
		
		for(var i =0; i< returnedData.length;i++){
		var student = currentStudents[i];
		$("#student_list_view").append('<li><a href="#" onClick="showProgress(i)">'+student.firstname + " " + student.lastname+'</a></li>');
					
		}	
	}
	else{
		$("#student_list_view").append('<li data-role="list-divider">No Students.</li>');
			
	}
	if ( $('#student_list_view').hasClass('ui-listview')) {
			$('#student_list_view').listview('refresh');
			} 
		else {
			$('#student_list_view').trigger('create');
		}
}


function showProgress(){
	
	
}



// LIST OF THE COURSES
function coursesListPageInit(){
	console.log("courses list page init");
	//get all courses for teacher
	displayAllCoursesForTeacher(currentTeacher,getCoursesCallback);		
}

function displayAllCoursesForTeacher(teacher,callback){
	var url = "ff/resources/MFCourse/(teacherId eq '"+teacher.guid+"')";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
			
		console.log("Get Courses" + statusMessage)
		callback(returnedData, statusMessage);
			
	});	
}

function addNewClass(classId){
	checkClass(classId.val(), checkClassSuccess);	
	
}

//triggered when user clicks on the list view
function showCourse(courseIndex){
		//change page and display the content
		if(teacherCourses.length>0){		      
		      currentCourse  = teacherCourses[courseIndex];
		     $.mobile.changePage("#coursePage");
		}
}

function getCoursesCallback(returnedData, statusMessage){
		$("#course_list_view").empty();
		$("#course_list_view").append('<li data-role="list-divider">List of Courses </li>');	
		teacherCourses = returnedData;
		
		if(returnedData.length >0){
		
			for(var i =0; i< returnedData.length;i++){
					var course = returnedData[i];
	 				$("#course_list_view").append('<li><a href="#" onClick="showCourse('+i+')">'+course.classId+'</a></li>');
					
			}	
		}
		
		if ( $('#course_list_view').hasClass('ui-listview')) {
			$('#course_list_view').listview('refresh');
			} 
		else {
			$('#course_list_view').trigger('create');
		}
}

function checkClassSuccess(returnedData, statusMessage,classId){
		if(returnedData==null){
			console.log("Nullll");	
		}
			if(returnedData==null){
			console.log("Nullll");	
		}
	
		if(returnedData.length ==0){
				//add an object
				var course = new Course();
				course.classId = classId;
				course.teacherId = currentTeacher.guid;
	
				fat_fractal.createObjAtUri(course, "MFCourse",
                        function(returnedData, statusMessage) { 
								$("#courseStatusMessage").replaceWith("Course ID created. Now share it with your students."); 
												
								},
                        function(statusCode, statusMessage) { 
													$("#courseStatusMessage").replaceWith("Error.");
												});
		//get all course ids 										
				displayAllCoursesForTeacher(currentTeacher,getCoursesCallback);								
	
				
		}else{
					$("#courseStatusMessage").replaceWith("Course ID already exists.");
			}
}


function checkClass(classId,successCallback){
	console.log("classId");
	
	var url = "ff/resources/MFCourse/(classId eq '"+classId+"')";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
			
			console.log("Check Class Status Message" + statusMessage)
			successCallback(returnedData, statusMessage, classId);
			
		});	
}


$(document).ready(function () {
  		//your code here
			// initialize the FatFractal library
  
     var attempt = function () {
      
        this.clazz = "MFAttempt"; this.guid = null; this.version = null;
    };
		//reloadAttempts()
	
	ff.login("cdt_user", "Stany174",
    function (loggedInUser) {

	console.log("Success");
	//$.mobile.changePage( "#registrationPage", { transition: "slideup", changeHash: false });	
    
    
    
    },
    
    function (statusCode, statusMessage) {
        // error occurred
	console.log("Error "+ statusMessage);	
    });

});

	
/*	
function reloadAttempts(){
$(document).ready(function() {$("#attemptsTable").find("tr:gt(0)").remove();});
     var url = "ff/resources/MFAttempt";
		 if($("#className").val().length >0)
			{
				url = "ff/resources/MFAttempt/(mfclassId eq '"+$("#className").val()+"')";
			}
			else{
                              
                        	return;
			}
                        
	  
    	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
                
                if (returnedData != null) {
                 
                    for (var i = 0; i < returnedData.length; i++) {
     									 var date = new Date(returnedData[i].attempt_date);
											 var n = returnedData[i].name;
	      							 var fr = 	returnedData[i].fractions;
											 var fr_str ="";
											 for(var j=0;j<fr.length;j++){
												 	fr_str = fr_str +" "+fr[j].numerator  +"/" + fr[j].denominator;
	  										}
		
											 var date_sts =date.getFullYear()+"/"+date.getMonth()+" " +date.getHours()+":"+date.getMinutes();
                     	 var score = returnedData[i].score;
                       var activity = returnedData[i].activity;
											 var nr = i+1;
											 var class_name="correct";
											 if(score ==1){
													class_name="correct" 
											 }
											 else{
												 class_name="incorrect"
											}
											                                                                   
											 
			$("#attemptsTable").append("<tr><td>"+activity+"</td><td>"+n+"</td><td class='"+class_name+"'>"+class_name +"</td><td>"+fr_str+"</td><td>"+date+"</td></tr>");
										
										}
                }
            }
    );
			
			}
		
*/
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
  
