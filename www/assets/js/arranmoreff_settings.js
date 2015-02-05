
var chosenLanguage = localStorage.getItem('language');

// INITIAL CHOICE
if (chosenLanguage == "default") {
	localStorage.setItem('language', "en");
}

var language_setting = localStorage.getItem('language');
var time_setting = localStorage.getItem('displayTime');

// console.log(language_setting + " " + time_setting);

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

loadPage(language_setting, time_setting);

function loadPage(language_setting, time_setting){
	var language_settingsHTML = "<span class='settings_title blue_text'>"+language_settings_title+"</span> <div class='input'>"
	if (language_setting == "en") {
		language_settingsHTML += "<input type='radio' id='radio1' name='language' checked> <label for='radio1'>"+language_settings_option_english+"</label> </div>";
		language_settingsHTML += "<div class='input'> <input type='radio' id='radio2' name='language'> <label for='radio2'>"+language_settings_option_irish+"</label> </div>"
	} else {
		language_settingsHTML += "<input type='radio' id='radio1' name='language'> <label for='radio1'>"+language_settings_option_english+"</label> </div>";
		language_settingsHTML += "<div class='input'> <input type='radio' id='radio2' name='language' checked> <label for='radio2'>"+language_settings_option_irish+"</label> </div>"
	}

	document.getElementById("language_settings").innerHTML = language_settingsHTML; 

	var time_settingsHTML = "<span class='settings_title blue_text'>Time</span>"
	if (time_setting == "true"){
		time_settingsHTML += "<div class='input'> <input type='checkbox' id='displayDate' checked> <label for='displayDate'>"+time_settings_option_label+"</label> </div>";
	} else {
		time_settingsHTML += "<div class='input'> <input type='checkbox' id='displayDate'> <label for='displayDate'>"+time_settings_option_label+"</label> </div>";
	}

	document.getElementById("time_settings").innerHTML = time_settingsHTML; 
};


$(function() { 
	// CHECK SAVE BUTTON
    jQuery('body').on('click', 'a', function () {
    	var displayDateVal = $("#displayDate").is(':checked');
    	// var languageSettingsVal = $('input[id="radio1"]:checked').val();
    	var languageSettingsVal =  $("#radio1").is(':checked');
    	// console.log(languageSettingsVal);
    	// console.log(displayDateVal);
    	if (displayDateVal == true){
    		localStorage.setItem('displayTime', "true");
    	} else {
			localStorage.setItem('displayTime', "false");	
    	}
    	if (languageSettingsVal == true){
    		localStorage.setItem('language', "en");
    	} else {
			localStorage.setItem('language', "ire");	
    	}
        location.reload(true);
    });
});