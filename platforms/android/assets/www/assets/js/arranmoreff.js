// FIREBASE REFERENCES
var firebaseRef = new Firebase("https://amber-fire-55.firebaseio.com/timetable3/");

// CHECK INTERNET CONNECTION
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available - CHECK CSS IS COMMENTED OUT

function onDeviceReady() {
    var connectionType = checkConnection();
    displayNoInternet(connectionType);
    
    if ( connectionType == 'No network connection') {
        var localTimetablesObj = localStorage.getItem('firebaseObj');
        var localTimetables = JSON.parse(localTimetablesObj);
        var timetableObj = localTimetables;

        // HIDE ALL OTHER CARDS, SHOW ONLY WARNING FOR OFFLINE + BUTTON FOR OFFLINE TIMETABLE
        // HIDE ID : next_ferries, todays_timetables
        if (timetableObj == null) {
            document.getElementById('next_ferries').style.display = 'none';
            document.getElementById('todays_timetables').style.display = 'none';
            document.getElementById('static_timetable').style.display = 'block';
        } else {
            // CALL FUNCTIONS
            // NEXT FERRY
            // nextFerry(timetableObj);
            // testTimetableObj(timetableObj);
        }

    } else {
            // console.log("testing");
            // FIREBASE REF
            var timetableObj = pullFirebase();
            
            testDiv();

            // BREAKS
            
            var object = timetableObj.summer_da.weekday;

            

            displayObjectAsArray(object);

            document.getElementById("testingObj").innerHTML = array[0]; 
        
            localStorage.setItem('firebaseObj', JSON.stringify(timetableObj));
            var latestDateTime = getPrettyDateTime();
            localStorage.setItem('latestDateTime', latestDateTime);

            

            testTimetableObj(timetableObj);
            // firebaseRef.on("value", function(snapshot) {
            //     var timetableObj = {};
            //     timetableObj = snapshot.val();
            //     testDiv();
            //     // STORE THE TIMETABLE
            //     localStorage.setItem('firebaseObj', JSON.stringify(timetableObj));
            //     // STORE THE NEW DATE FOR THE TIMETABLE
            //     latestDateTime = getPrettyDateTime();
            //     localStorage.setItem('latestDateTime', latestDateTime);

            //     // CALL FUNCTIONS
            //     // NEXT FERRY
            // // FERRY TIMETABLES
            // });
    };

    // TIME LABEL FOR SYNC
    syncTimeDisplay();
};

// TESTING CSS - SAME AS onDeviceReady
// $(function() {
//     var connectionType = 'No network connection';
//     // var connectionType = "WiFi connection";

//     displayNoInternet(connectionType);
//     // var htmlRES = testingDiv("Testing!");
//     // document.getElementById("testing").innerHTML = htmlRES;
    

//     if ( connectionType == 'No network connection') {
//         var localTimetablesObj = localStorage.getItem('firebaseObj');
//         var localTimetables = JSON.parse(localTimetablesObj);
//         var timetableObj = localTimetables;

//         // HIDE ALL OTHER CARDS, SHOW ONLY WARNING FOR OFFLINE + BUTTON FOR OFFLINE TIMETABLE
//         // HIDE ID : next_ferries, todays_timetables
//         if (timetableObj == null) {
//             document.getElementById('next_ferries').style.display = 'none';
//             document.getElementById('todays_timetables').style.display = 'none';
//             document.getElementById('static_timetable').style.display = 'block';
//         } else {
//             // CALL FUNCTIONS
//             // NEXT FERRY
//             nextFerry(timetableObj);
//         }

//     } else {
//             // console.log("testing");
//             // FIREBASE REF            
//             firebaseRef.on("value", function(snapshot) {
//                 // var timetableObj = {};
//                 timetableObj = snapshot.val();
//                 // STORE THE TIMETABLE
//                 localStorage.setItem('firebaseObj', JSON.stringify(timetableObj));
//                 // STORE THE NEW DATE FOR THE TIMETABLE
//                 latestDateTime = getPrettyDateTime();
//                 localStorage.setItem('latestDateTime', latestDateTime);

//                 // CALL FUNCTIONS
//                 // NEXT FERRY
//                 nextFerry(timetableObj);
//                 // FERRY TIMETABLES

//              });
//     };

//     // TIME LABEL FOR SYNC
//     syncTimeDisplay();

//     // ERROR FUNCTION
//     }, function (errorObject) {
//         console.log("The read failed: " + errorObject.code);
// });




// ============= CALLED FUNCTIONS ===================

function pullFirebase(){

    firebaseRef.on("value", function(snapshot) {
    var timetableObj = {};
    timetableObj = snapshot.val();
    return timetableObj;

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}


function testTimetableObj(object){
    var obj = {};
    var obj = object.summer_da.weekend;
    document.getElementById("testingObj").innerHTML = obj; 
    testDiv();
    var result = generateArrays(obj);
    var htmlinput = "This is the " + result;

    document.getElementById("testingObj").innerHTML = htmlinput;    
}

function nextFerry(timetableObj) {

    var date = new Date();
    
    var timetables = getDateTimetables(timetableObj, date);

    var result_da = "20:00";
    var result_db = "19:00";
    document.getElementById("nextFerry_da").innerHTML = result_da;
    document.getElementById("nextFerry_db").innerHTML = result_db;    
}


function getDateTimetables(timetableObj, date) {

    console.log(date);

    var dateTimetables = getDateFerries(timetableObj, date);
    var extrasTimetables = getExtraFerries(timetableObj, date);
    var cancelTimetables = getCancelFerries(timetableObj, date);

    var timetables = collateTimes(dateTimetables, extrasTimetables, cancelTimetables);
    // timetables format should be: {da:[1900, 2000, 2200], db:[1900, 2000, 2200]};
    // EXAMPLE OBJECTS IN ARRAYS
    // var times = {da:[1900, 2000, 2200], db:[1900, 2000, 2200]};
    // console.log(times.da[0]);
}


// NEED TO COMPLETE
function getDateFerries(timetableObj, date) {
    
    dMonth = date.getMonth()+1;
    dDay = date.getDay();

    // DECISION TREE RETURNS - timetableObj_da + timetableObj_db
    if ( dMonth > 4 && dMonth < 9 ) {
        // ITS SUMMER
        console.log("ITS SUMMER!")
        // CHECK DAY OF WEEK
        if (dDay == 0) {
            // ITS SUNDAY
            console.log("IT's SUNDAY")
            var timetableObj_da = timetableObj.summer_da.weekend;
            var timetableObj_db = timetableObj.summer_db.weekend;
        } else {
            // ITS WEEKDAY
            console.log("IT's A WEEKDAY")     
            var timetableObj_da = timetableObj.summer_da.weekday;
            var timetableObj_db = timetableObj.summer_db.weekday;
        }   
    } else {
        // ITS WINTER
        console.log("ITS WINTER!")
        // CHECK DAY OF WEEK
        if (dDay == 0) {
            // ITS SUNDAY
            console.log("IT's SUNDAY")
            var timetableObj_da = timetableObj.winter_da.weekend;
            var timetableObj_db = timetableObj.winter_db.weekend;
        } else {
            // ITS WEEKDAY
            console.log("IT's A WEEKDAY")     
            var timetableObj_da = timetableObj.winter_da.weekday;
            var timetableObj_db = timetableObj.winter_db.weekday;
        }  
    }

    var daArray = generateArrays(timetableObj_da);
    var dbArray = generateArrays(timetableObj_db);

    var dateFerries = {da: daArray, db: dbArray};
    // console.log(dateFerries);
    return dateFerries;

}

// FORMAT OF INPUT DATES

function getExtraFerries(timetableObj, date) {
    console.log(timetableObj + date);

}

function getCancelFerries(timetableObj, date) {
    console.log(timetableObj + date);
}

function collateTimes(dateTimetables, extrasTimetables, cancelTimetables) {
    console.log("TESTING");
    // console.log(dateTimetables + extrasTimetables + cancelTimetables);
}


// TIME LABEL FOR SYNC
function syncTimeDisplay() {
    // CHECK SYNC DATE AND DISPLAY IT
    var latestDateTime = localStorage.getItem('latestDateTime');
    if ( latestDateTime == null ) {
        var latestDateTime = "No previous sync"
    }
    var dateDiv = "<div class='grid padded'> <div class='unit whole align-right'> <span class='date_text'> <span> Last Sync: " + latestDateTime +" </span> </div> </div>";
    document.getElementById("lastest_sync_date").innerHTML = dateDiv;  
}

// CHECK CONNECTION - RETURNS VALUE
function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return states[networkState];
};
// DISPLAY INTERNET NOTIFICATION
function displayNoInternet(connectionType) {
    if (connectionType == 'No network connection') {
        var result = "<div class='grid padded'> <div class='unit whole card shadow1 red align-center'> <span class='tferry_table_title'><i class='mdi-alert-warning pull-left'></i><span>No internet connection!</span><i class='mdi-navigation-close dismiss_internet_notification pull-right'></i></span> </div> </div>";
        document.getElementById("internet_notification").innerHTML = result;
    }
};

// DISMISS THE INTERNET NOTIFICATION
$(function() { 
    jQuery('body').on('click', 'i', function () {
    if ( $(this).hasClass("dismiss_internet_notification") ) {
            document.getElementById('internet_notification').style.display = 'none';
        } 
    });
});


// ================ GENERAL FUNCTIONS ===========================

function getPrettyDateTime() {
    var rawDate = new Date();
    // PRETTY HOURS
    var date = lessThanTen(rawDate.getDate());
    var month = lessThanTen(rawDate.getMonth()+1);    
    var hours = lessThanTen(rawDate.getHours());
    var minutes = lessThanTen(rawDate.getMinutes());
    var seconds = lessThanTen(rawDate.getSeconds());

    var datetime = "" + date + "/"
                + month + "/" 
                + rawDate.getFullYear() + " at "  
                + hours + ":"  
                + minutes + ":" 
                + seconds;
    return datetime;
};

// USED FOR DATES AND TIMES
function lessThanTen(number) {
    if (number < 10) {
        var newNumber = "0"+number;
    } else {
        var newNumber = number;
    };
    return newNumber;
};

function generateArrays(object){
    array = [];
    // GENERATE THE ARRAY
    for (key in object ) {
        array.push(object[key].time);
    };
    // SORT THE ARRAY
    array.sort(function (a, b) {
        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
    });
    // return the array
    return array;
    // console.log("This happens");
}

// ================ TESTING PURPOSE ONLY ===========================

function testingDiv(content) {
    var result = "<div class='grid padded'> <div class='unit whole card plain align-right'> <span class='date_text'> <span> " + content +" </span> </div> </div>";
    return result
};


function testDiv(){
    var htmlRES = testingDiv("Testing!");
    document.getElementById("testing").innerHTML = htmlRES;
};

function displayObjectAsArray(object) {

    var array = [];
    // GENERATE THE ARRAY
    for (key in object) {
        array.push(object[key].time);
    };

    var result = ""
    for (var i = array.length - 1; i >= 0; i--) {
        result += "" + array[i] + ", ";
    };

    document.getElementById("testingObjArray").innerHTML = result;   
}

// RUNNING FUNCTION REMOVE THE LOCAL STORAGE
$(function() { 
    jQuery('body').on('click', 'a', function () {
    if ( $(this).hasClass("remove_storage") ) {
            localStorage.removeItem('firebaseObj');
            localStorage.removeItem('latestDateTime');
            console.log("cleared")
        }
    });
});


// EMPTY RUNNING FUNCTION
$(function() {

    // ERROR FUNCTION
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
});


