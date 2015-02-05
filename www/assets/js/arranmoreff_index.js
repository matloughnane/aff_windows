// FIREBASE REFERENCES
var firebaseRef = new Firebase("https://amber-fire-55.firebaseio.com/timetable3/");

var chosenLanguage = localStorage.getItem('language');

if (chosenLanguage == "en"){
    var offline_timetables = "Using offline timetables";
    var no_ferries_today_note = "There are no more ferries today!";
    var all_ferries_cancelled = "There are no ferries running today, for more information please give us a call";
    var departing_arranmore = "Departing Arranmore";
    var departing_burtonport = "Departing Burtonport";
    var no_previous_sync_message = "No previous sync";
    var note_message = "Note:";
    var latest_sync_message = "Last Sync:";
    var internet_notification_message = "No internet connection!";
    var weekday_message = "Monday to Saturday";
    var weekend_message = "Sunday";
    var language_settings_title = "Language";
    var language_settings_option_english = "English";
    var language_settings_option_irish = "Irish";
    var time_settings_option_label = "Display Arranmore Local Time";
} else {
    var offline_timetables = "Ag baint úsáide as hamchláir is offline";
    var no_ferries_today_note = "Níl aon níos báid farantóireachta inniu!";
    var all_ferries_cancelled = "Níl aon báid farantóireachta ag rith inniu, le haghaidh tuilleadh eolais tabhair dúinn glaoch";
    var departing_arranmore = "Fágáil Árainn Mhór";
    var departing_burtonport = "Fágáil Ailt an Chorráin";
    var no_previous_sync_message = "Níl info roimhe";
    var note_message = "Nóta:";
    var latest_sync_message = "Info Last";
    var internet_notification_message = "Aon nasc idirlín!";
    var weekday_message = "Luan go Satharn";
    var weekend_message = "Dé Domhnaigh";
    var language_settings_title = "Teanga";
    var language_settings_option_english = "Béarla";
    var language_settings_option_irish = "Gaeilge";
    var time_settings_option_label = "Taispeáin Árainn Mhór Am Áitiúil";
}

// CHECK INTERNET CONNECTION
document.addEventListener("deviceready", onDeviceReady, false);

// // device APIs are available - CHECK CSS IS COMMENTED OUT

function onDeviceReady() {
    var connectionType = checkConnection();
    displayNoInternet(connectionType);
    
    if ( connectionType == 'No network connection') {

        var timetableObj = {};
        // FOR INDEX.HTML ONLY
        $.ajax({
            // URL IS RELATIVE TO THE PAGE CALLING IT
            url: 'assets/js/static_timetable.json',
            async: false,
            dataType: 'json',
            success: function (response) {
                // console.log(response);
                var timetableObj = response;
                // console.log(timetableObj);
                localStorage.setItem('latestDateTime', offline_timetables);

                // var htmlRES = testingDiv("Testing, offline: " + timetableObj);
                // document.getElementById("testing").innerHTML = htmlRES;

                // NEXT FERRY
                nextFerry(timetableObj);
                // FERRY TIMETABLES
                var tdate = new Date();
                todaysTimetables(timetableObj, tdate);
            }
        });

    } else {
            // console.log("testing");
            // FIREBASE REF
            var timetableObj = {};
            // var timetableObj = pullFirebase();
            firebaseRef.on("value", function(snapshot) {
                timetableObj = snapshot.val();

                localStorage.setItem('firebaseObj', timetableObj);
                
                var latestDateTime = getPrettyDateTime();
                localStorage.setItem('latestDateTime', latestDateTime);

                // var htmlRES = testingDiv("Testing online: " + timetableObj);
                // document.getElementById("testing").innerHTML = htmlRES;
                // CALL FUNCTIONS
                // NEXT FERRY
                nextFerry(timetableObj);

                // FERRY TIMETABLES
                var tdate = new Date();
                todaysTimetables(timetableObj, tdate);

            });
    };

    // TIME LABEL FOR SYNC
    syncTimeDisplay();
};


// =============
// ============= CALLED FUNCTIONS ===================
// =============


function pullFirebase(){
    firebaseRef.on("value", function(snapshot) {
    timetableObj = snapshot.val();
    return timetableObj;

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
};


// ============= NEXT FERRY FUNCTIONS ===================

function nextFerry(timetableObj) {
    var date = new Date();
    
    var timetables = getDateTimetables(timetableObj, date);
    var ctime = getPrettyTime(date);

    var array_da = timetables.da;
    var array_db = timetables.db;
    // console.log(array_da);
    // console.log(array_db);

    var result_da = checkForNextFerry(array_da, ctime);
    var result_db = checkForNextFerry(array_db, ctime);
    document.getElementById("nextFerry_da").innerHTML = result_da;
    document.getElementById("nextFerry_db").innerHTML = result_db;    
};

function checkForNextFerry(array, time){
    for ( var i = 0; i < array.length; i++){
        if (time < array[i]) {
            var nextFerry = array[i];
            break;
        } else {
            var nextFerry = no_ferries_today_note;
        }
    };
    return nextFerry;
};

// ============= TABLES FUNCTIONS ===================

function todaysTimetables(timetableObj, date){

    var timetables = getDateTimetables(timetableObj, date);

    var array_da = timetables.da;
    var array_db = timetables.db;

    console.log(array_da);
    console.log(array_db);    


    var table_da = oneDayTableConstructor(array_da, "da");
    var table_db = oneDayTableConstructor(array_db, "db");

    document.getElementById("today_timetable_da").innerHTML = table_da; 
    document.getElementById("today_timetable_db").innerHTML = table_db; 
};


function oneDayTableConstructor(array, journey){

    if (array.length == 0 ) {
        // console.log("All ferries are cancelled...");
        // CREATE HTML FOR NO FERRIES
        var tableHTML = all_ferries_cancelled;
    } else {
        // CREATE TABLE
        if (journey == "da") {
            var cssColor = "blue";
            var journey = departing_arranmore;
        } else {
            var cssColor = "orange";
            var journey = departing_burtonport;
        };

        var tableHTML = "<table class='" + cssColor + " align-center' border='1'> <thead> <tr> <th class='"+cssColor+"' colspan='"+array.length+"'>"+journey+"</th> </tr> <tbody>";

        // LOGIC FOR TIMES
        // CHECK HOW MANY TIMES ARE IN THE ARRAY
        tableHTML += "<tr>";
        for (var i = 0; i < array.length; i++) {
            tableHTML += "<td>" + array[i] + "</td>";
        };
        tableHTML += "</tr>";
        // BODY OF TABLE COMPLETE

        tableHTML += "</tbody> </table>";
        // INCOMPLETE
    };
    return tableHTML;
};


// =============  GENERAL FUNCTIONS ===================

// RETURNS AN OBJECT WITH DA / DB ARRAYs
function getDateTimetables(timetableObj, date) {

    // console.log(date);
    var dateTimetables = getDateFerries(timetableObj, date);
    // console.log(dateTimetables);
    var extrasTimetables = getExtraFerries(timetableObj, date);
    // console.log(extrasTimetables);
    var cancelTimetables = getCancelFerries(timetableObj, date);
    // console.log(cancelTimetables);

    var timetables = collateTimes(dateTimetables, extrasTimetables, cancelTimetables);
    // timetables format should be: {da:[1900, 2000, 2200], db:[1900, 2000, 2200]};
    // EXAMPLE OBJECTS IN ARRAYS
    // var times = {da:[1900, 2000, 2200], db:[1900, 2000, 2200]};
    // console.log(times.da[0]);
    
    // console.log(timetables);
    return timetables;
};

// OUTPUTS DATES FERRIES (NO EXTRAS OR CANCELLATIONS)- RETURNS OBJECT WITH TWO ARRAYS
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
};

// FIND EXTRA FERRIES - RETURNS OBJECT WITH ONE ARRAY
function getExtraFerries(timetableObj, date) {
    // console.log(timetableObj + date)
    // GET EXTRA FERRY OBJECT
    var extraFerryObj_da = timetableObj.extra_ferry.da;
    var extraFerryObj_db = timetableObj.extra_ferry.db;
    // console.log(extraFerryObj_da);
    // console.log(extraFerryObj_db);
    var checkDate = getInputDate(date);
    // console.log(checkDate);

    var extraFerryArray_da = checkChangesFerrys(extraFerryObj_da, checkDate);
    var extraFerryArray_db = checkChangesFerrys(extraFerryObj_db, checkDate);

    // console.log(timetableObj.extra_ferry);
    var times = {da:extraFerryArray_da, db:extraFerryArray_db};
    // console.log(times);
    return times;
};

// FIND CANCELLED FERRIES - RETURNS OBJECT WITH ONE ARRAY
function getCancelFerries(timetableObj, date) {
    // console.log(timetableObj + date);

    // GET EXTRA FERRY OBJECT
    var cancelFerryObj_da = timetableObj.cancel_ferry.da;
    var cancelFerryObj_db = timetableObj.cancel_ferry.db;

    var checkDate = getInputDate(date);

    var cancelFerryArray_da = checkChangesFerrys(cancelFerryObj_da, checkDate);
    var cancelFerryArray_db = checkChangesFerrys(cancelFerryObj_db, checkDate);

    var times = {da:cancelFerryArray_da, db:cancelFerryArray_db};
    // console.log(times);
    return times;
};

// CREATE ARRAYS FOR THE EXTRA / CANCELLED FERRIES
function checkChangesFerrys(timetableObj, date){
    var array = [];
    for (key in timetableObj) {
        if (timetableObj[key].date == date){
            array.push(timetableObj[key].time);
        };
    };
    // console.log(array);
    return array;
};

// COLLATES ALL TIMESTABLES
function collateTimes(dateTimetables, extrasTimetables, cancelTimetables) {
    // console.log("TESTING");
    // console.log(dateTimetables.da + extrasTimetables.da + cancelTimetables.da);
    var dateArray_da = collateArrays(dateTimetables.da, extrasTimetables.da, cancelTimetables.da);
    var dateArray_db = collateArrays(dateTimetables.db, extrasTimetables.db, cancelTimetables.db);

    var finalTimes = {da:dateArray_da, db:dateArray_db};
    // console.log(finalTimes);
    return finalTimes;
};

function collateArrays(dateTimetables, extrasTimetables, cancelTimetables){
    var array = [];

    // CREATE THE ARRAY
    if (dateTimetables.length != 0){
        for (var i = dateTimetables.length - 1; i >= 0; i--) {
            array.push(dateTimetables[i]);
        };
    };
    // ADD IN EXTRAS
    if (extrasTimetables.length != 0){
        for (var i = extrasTimetables.length - 1; i >= 0; i--) {
            array.push(extrasTimetables[i]);
        };
    };

    // REMOVE THE EXTRAS
    if (cancelTimetables.length != 0){
        for ( var i = 0; i < cancelTimetables.length; i++ ){
            for ( var j = 0; j < array.length; j++ ){
                if (array[j] == cancelTimetables[i]){
                    array.splice(j, 1);
                }
            }
        };
    };

    // SORT ARRAY
    array.sort(function (a, b) {
        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
    });

    return array;
};

// TIME LABEL FOR SYNC
function syncTimeDisplay() {
    // CHECK SYNC DATE AND DISPLAY IT
    var latestDateTime = localStorage.getItem('latestDateTime');
    if ( latestDateTime == null ) {
        var latestDateTime = no_previous_sync_message;
    } 
    if (latestDateTime == no_previous_sync_message){
        var dateDiv = "<div class='grid padded'> <div class='unit whole align-right'> <span class='date_text'> <span>" + latestDateTime +" </span> </div> </div>";
    } else if (latestDateTime == offline_timetables) {
        var dateDiv = "<div class='grid padded'> <div class='unit whole align-right'> <span class='date_text'> <span> " + note_message + " " + latestDateTime +" </span> </div> </div>";
    } else {
        var dateDiv = "<div class='grid padded'> <div class='unit whole align-right'> <span class='date_text'> <span> "+ latest_sync_message +" " + latestDateTime +" </span> </div> </div>";
    }
    document.getElementById("lastest_sync_date").innerHTML = dateDiv;  
};

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
        var result = "<div class='grid padded'> <div class='unit whole card shadow1 red align-center'> <span class='tferry_table_title'><i class='mdi-alert-warning pull-left'></i><span>"+ internet_notification_message +"</span><i class='mdi-navigation-close dismiss_internet_notification pull-right'></i></span> </div> </div>";
        document.getElementById("internet_notification").innerHTML = result;
    }
};

// DISMISS THE INTERNET NOTIFICATION
$(function() { 
    jQuery('body').on('click', 'i', function () {
    if ( $(this).hasClass("dismiss_internet_notification") ) {
            document.getElementById('internet_notification').style.display = 'none';
        }; 
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

function getPrettyTime(date){ 
    var rawDate = new Date(date);

    var hours = lessThanTen(rawDate.getHours());
    var minutes = lessThanTen(rawDate.getMinutes());
    var seconds = lessThanTen(rawDate.getSeconds());

    var time = "" + hours + ":"  
                + minutes + "";
    return time; 
}

function getInputDate(date){
    // CREATE THE CHECK DATE IN CORRECT FORMAT
    var cdate = new Date(date);
    // console.log(cdate);
    var yearToCheck = cdate.getYear();
    var monthToCheck = cdate.getMonth()+1;
    var dateToCheck = cdate.getDate();

    if (yearToCheck < 1000) { yearToCheck += 1900 };
    if (monthToCheck < 9) { monthToCheck = "0"+monthToCheck };
    if (dateToCheck < 9) { dateToCheck = "0"+dateToCheck };

    // CHECK THE DATE AGAINST THE TIMETABLE OBJ
    var checkDate = yearToCheck+"-"+monthToCheck+"-"+dateToCheck;
    return checkDate;
}

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
    for (key in object) {
        array.push(object[key].time);
    };
    // SORT THE ARRAY
    array.sort(function (a, b) {
        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
    });
    // return the array
    return array;
    // console.log("This happens");
};

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
};

// RUNNING FUNCTION REMOVE THE LOCAL STORAGE
$(function() { 
    jQuery('body').on('click', 'a', function () {
    if ( $(this).hasClass("remove_storage") ) {
            localStorage.removeItem('language');
            localStorage.removeItem('displayTime');
            localStorage.removeItem('count');
            console.log("cleared")
        }
    });
});

// EMPTY RUNNING FUNCTION
// $(function() {

//     // ERROR FUNCTION
//     }, function (errorObject) {
//         console.log("The read failed: " + errorObject.code);
// });


