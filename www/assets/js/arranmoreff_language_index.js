
var chosenLanguage = localStorage.getItem('language');

// INITIAL CHOICE
if (chosenLanguage == "default") {
	// console.log("chosenLanguage is default");
	// SETTING DEFAULT TO EN
	localStorage.setItem('language', "en");
	// CHANGE VALUE TO DEFAUL LANGUAGE
} else if (chosenLanguage == "en") {
	// ENGLISH
	// console.log("chosenLanguage is english");
} else if (chosenLanguage == "ire") {
	// IRISH
	// console.log("chosenLanguage is irish");
}

var chosenLanguage = localStorage.getItem('language');
// console.log(chosenLanguage);

$.ajax({
	// URL IS RELATIVE TO THE PAGE CALLING IT
	url: 'assets/js/localisation.json',
	async: false,
	dataType: 'json',
	success: function (response) {
		// do stuff with response.
	 	console.log(response);
		generateLocalisedText(response);
	}
});



function generateLocalisedText(languageObj){
	
	if (chosenLanguage == "en") {
		var chosenLanguageObj = languageObj.en;
		for (key in chosenLanguageObj) {
			var divid = "#"+key;
			// console.log(divid);
			if ($(divid).length){
	    		// console.log(chosenLanguageObj[key]);
	    		document.getElementById(key).innerHTML = chosenLanguageObj[key];
			} else {
				// console.log("No div html place for " + key);
			};
		};
		// console.log("All output in console in English");
	} else {
		var chosenLanguageObj = languageObj.ire;
		for (key in chosenLanguageObj) {
			var divid = "#"+key;
			// console.log(divid);
			if ($(divid).length){
	    		// console.log(chosenLanguageObj[key]);
	    		document.getElementById(key).innerHTML = chosenLanguageObj[key];
			} else {
				// console.log("No div html place for " + key);
			};
		};
		// console.log("All output in console is Irish");	
	}
};

