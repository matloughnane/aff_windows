
var displayTime = localStorage.getItem('displayTime');

var chosenLanguage = localStorage.getItem('language');

if (chosenLanguage == "en"){
	tday= new Array("Sun","Mon","Tue","Wed","Thur","Fri","Sat");
	tmonth= new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var title = "Arranmore Local Time: "
} else {
	tday= new Array("Sun","Mon","Tue","Wed","Thur","Fri","Sat");
	tmonth= new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var title = "Árainn Mhór Am Áitiúil: "	
}


if (displayTime == "true"){

	var displayTimeHTML = "<div class='unit whole card shadow1 orange plain'> <span id='clockbox'></span> </div>";
	document.getElementById('localTime').innerHTML = displayTimeHTML;

	document.getElementById('localTime').style.display = 'block';
	// RUN DISPLAY CLOCK + INCLUDE OFFSET
	window.onload=function(){
	GetClock();
	// refreshes the count every 1 second
	setInterval(GetClock,1000);}
	} else {
	document.getElementById('localTime').style.display = 'none';
};

function GetClock(){
	var cdate = new Date();
	var localTime = cdate.getTime();
	// console.log(localTime);
	var localOffset = cdate.getTimezoneOffset() * 60000;
	// console.log(localOffset);
	var utcTime = localTime + localOffset;

	var arranmoreDateTime = new Date(utcTime);

	var nday=arranmoreDateTime.getDay(),nmonth=arranmoreDateTime.getMonth(),ndate=arranmoreDateTime.getDate(),nyear=arranmoreDateTime.getYear(),nhour=arranmoreDateTime.getHours(),nmin=arranmoreDateTime.getMinutes(),nsec=arranmoreDateTime.getSeconds(),ap;

	// if(nhour==0){ap=" AM";nhour=12;}
	// else if(nhour<12){ap=" AM";}
	// else if(nhour==12){ap=" PM";}
	// else if(nhour>12){ap=" PM";nhour-=12;}

	if(nyear<1000) nyear+=1900;
	if(nmin<=9) nmin="0"+nmin;
	if(nsec<=9) nsec="0"+nsec;

	document.getElementById('clockbox').innerHTML=title+" "+ndate+" "+tmonth[nmonth]+" "+nyear+", "+nhour+":"+nmin+":"+nsec+"";
};
