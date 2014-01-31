var fat_fractal = new FatFractal();
var currentTeacher = null;
var currentCourse = null;
var teacherCourses = null;
var currentStudents = null;
var currentStudent = null;

//fat_fractal.debug = true;

var Teacher = function(){
	this.username;
	this.password;
	this.school;
	this.clazz = 'MFTeacher';
	this.guid = null;
	//add teacher's name and lastname
};

var Course = function(){
	this.classId;
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
	this.clazz = 'MFFrAttempt';
	this.guid = null;
	this.answer;
	this.question;
	this.date;
	this.studentid;
	this.correct;
	this.activity;
};

var Message = function(){
	this.clazz = 'MFFeedbackMessage';
	this.guid = null;
	this.studentid;
	this.teacherid;
	this.teachername;
	this.teacherlastname;
	this.messagetext;
	this.messagedate;
};




$(document).on("pagechange",function(event,data){
	console.log(" page change  ");

	 var currentPage = $.mobile.activePage.attr('id');
	if(currentPage === "registrationPage"){
		
		}

if(currentPage !='loginPage' && currentPage != "registrationPage" ){
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
if(currentPage === "studentsAttemptPage"){
	if(currentCourse&&currentStudent&&currentTeacher){
		$("#student_info").replaceWith(currentStudent.firstname +" "+ currentStudent.lastname);
		getAttempts(currentStudent,displayAttempts);
		refreshMessages(currentTeacher,currentStudent);
				
	}
	else{
		console.log("Potential problem. Current course doesn't exist '");
	}
}	

if(currentPage === "coursePage"){
	if(!currentCourse){
			console.log("Potential Problem - current course shouldn't be null");
			$.mobile.changePage("#loginPage");			
	}
		coursePageInit();

}		
});

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
	//console.log("Login Return data"+statusMessage + "   " + returnedData[0].guid);	
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

/*__________________________________FEEDBACK Section_____________________________________________ */
function sendMessage(){
	//from current teacher to current student 
	var message = new Message();
	message.teacherid = currentTeacher.guid;
	message.teachername =currentTeacher.username;
	//teacher.username
	message.teacherlastname = currentTeacher.lastname;
	message.messagetext = $("#message_text").val();
	message.studentid = currentStudent.guid;
	message.messagedate = new Date();
	
	fat_fractal.createObjAtUri(message, "MFFeedbackMessage",
                        function(returnedData, statusMessage) { 
								$("#student_status").replaceWith("Message Sent."); 
									//refresh the feedback list
									refreshMessages(currentTeacher, currentStudent);
								},
                        function(statusCode, statusMessage) { 
								$("#student_status").replaceWith("We couldn't send your message.");
	});											
}	

function refreshMessages(teacher, student){

	var url = "ff/resources/MFFeedbackMessage/((studentid eq '"+student.guid+"') and (teacherid eq '"+teacher.guid+"'))";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {			
			console.log("Get Students" + statusMessage)
			displayMessages(returnedData);
		});	
}

function displayMessages(returnedData){
	//student_messages_list_view
	$("#student_messages_list_view").empty();
	$("#student_messages_list_view").append('<li data-role="list-divider">Messages</li>');
	
	if(returnedData.length >0){
			for(var i =0; i< returnedData.length;i++){
				var message=  returnedData[i];
				var date = new Date(message.messagedate);
				$("#student_messages_list_view").append('<li data-icon="false"><div> Date: '+  date+ ' <br> Message: '+  message.messagetext+'</div></li>');
								
				}					
		}
		//refreshMessages(currenTeacher, currentStudent);
		if ( $('#student_messages_list_view').hasClass('ui-listview')) {
			$('#student_messages_list_view').listview('refresh');
			} 
		else {
			$('#student_messages_list_view').trigger('create');
		}
	
	
}


/* __________________________________COURSES MANAGEMENT SECTION __________________________________*/




//single page
function coursePageInit()
{
	if(!currentCourse)
	{
		console.log("course page possible problem. Course doesn't exist " );			
	}
	else{
		//get students
		displayAllStudentsForCourse(currentCourse,getStudentsCallback);			
	}
	
}


function displayAllStudentsForCourse(course, callback)
{
	if(!course) {console.log("course is null"); return;}
	
	var url = "ff/resources/MFStudent/(classId eq '"+course.classId+"')";
	fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {
			
			console.log("Get Students" + statusMessage)
			callback(returnedData, statusMessage);
			
		});	
	
}

function getStudentsCallback(returnedData, statusMessage){
		
	currentStudents = returnedData;
	if(returnedData.length >0){
		
	$("#student_list_view").empty();
	$("#student_list_view").append('<li data-role="list-divider">Students in '+currentCourse.classId +' </li>');	
		
		for(var i =0; i< returnedData.length;i++){
		var student = currentStudents[i];
		$("#student_list_view").append('<li><a href="#" onClick="showProgress('+i+')">'+student.firstname + " " + student.lastname+'</a></li>');
					
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


function showProgress(index){
	currentStudent = currentStudents[index];	
	$.mobile.changePage("#studentsAttemptPage");

}

function refreshAttempts(){
	getAttempts(currentStudent, displayAttempts);	
}

function getAttempts(student, callback){
	var url = "ff/resources/MFFrAttempt/(userId eq '"+student.guid+"')? sort=activity asc";
//		url = "ff/resources/MFFrAttempt/(userId eq 'T1uY3zMl0jeYPAcrZYSjk6')?sort=activity asc";
		fat_fractal.getArrayFromUri(url, function(returnedData, statusMessage) {	
	    console.log("Get Attempts " + statusMessage );
		callback(returnedData, statusMessage);
		displayAttempts(returnedData, statusMessage);
			
	});	
}

function displayAttempts(returnedData, statusMessage){
	$("#student_attempts_list_view").empty();
		$("#student_attempts_list_view").append('<li data-role="list-divider">List of Atempts </li>');	
		var attempts = returnedData;
		var cid = -1; 
		if(returnedData.length >0){
			for(var i =0; i< returnedData.length;i++){
					var attempt=  returnedData[i];
					if(attempt.activity != cid){
						$("#student_attempts_list_view").append('<li data-role="list-divider">Activity '+attempt.activity +'</li>');		
						cid = attempt.activity;
					}
					var date = new Date(attempt.attempt_date);					
					if(attempt.score == 1 || attempt.score === "1"){
		 				$("#student_attempts_list_view").append('<li data-icon="check"><a href="#" data-icon="check" >Activity '+ attempt.activity+' Date: '+ date+'</a></li>');
					}
					else{
						$("#student_attempts_list_view").append('<li data-icon="delete"><a href="#" data-icon="delete" >Activity '+ attempt.activity+' Date: '+ date+'</a></li>');
					}
				}					
		}
		
		if ( $('#student_attempts_list_view').hasClass('ui-listview')) {
			$('#student_attempts_list_view').listview('refresh');
			} 
		else {
			$('#student_attempts_list_view').trigger('create');
		}
	
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
  
//      var attempt = function () {
//       
//         this.clazz = "MFFractalAttempt"; this.guid = null; this.version = null;
//     };
// 		//reloadAttempts()
	
	ff.login("cdt_user", "Stany174",
    function (loggedInUser) {

	console.log("Success");
    
    },
    
    function (statusCode, statusMessage) {
        // error occurred
	console.log("Error "+ statusMessage);	
    });

});

	
