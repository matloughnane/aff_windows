
// DEFAULT VALUES
var language = "default";
var displayTime = "default";

// SET INITIAL SETTINGS
localStorage.setItem('language', "default");
localStorage.setItem('displayTime', "default");

// SET TIME OFFSET
$(function() { 
	// TESTING ONLY
	// DISPLAY LANGUAGES
	// displayLanguage(language);
	// // DISPLAY TIMES
	displayLanguage();
	checkTimeOffset();
	displayTimeOffset();

	// CHECK FOR LANGUAGE CHANGE
    jQuery('body').on('click', 'input', function () {
		if ( $(this).hasClass("english_radio") ) {
			language = "en";
			localStorage.setItem('language', "en");
			displayLanguage();
		} else if ( $(this).hasClass("irish_radio") ) {
			language = "ire";
			localStorage.setItem('language', "ire");
			displayLanguage();
		} else if ($(this).hasClass("checkbox")) {
			var displayTime = $(this).is(':checked');
			// console.log("value is: " + displayTime);
			if (displayTime == "default") {
				localStorage.setItem('displayTime', "true");
			} else if (displayTime == true) {
				localStorage.setItem('displayTime', "true");
			} else {
				localStorage.setItem('displayTime', "false");
			}
			// TESTING ONLY
			displayTimeOption();
		}
    });
});

// TESTING DIV ID
// testing_settings_values

function displayLanguage() {
	var language = localStorage.getItem('language');
	var testingSettingsValues = "Chosen language is:" + language;
	document.getElementById("testing_settings_lang_values").innerHTML = testingSettingsValues; 
};

function displayTimeOffset() {
	var timeOffset = localStorage.getItem('localTime');
	var testingSettingsValues = "Choice time offset is:" + timeOffset;
	document.getElementById("testing_settings_time_values").innerHTML = testingSettingsValues; 
};

function checkTimeOffset(){
	var offsetMinutes = new Date().getTimezoneOffset();
	var offsetHours = offsetMinutes/60;
	localStorage.setItem('localTime', offsetHours);
};

function displayTimeOption() {
	var timeOption = localStorage.getItem('displayTime');
	var testingTimeOption = "Choice time display is:" + timeOption;
	document.getElementById("testing_settings_time_option").innerHTML = testingTimeOption; 
};