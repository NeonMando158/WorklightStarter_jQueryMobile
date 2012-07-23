/*
*  Licensed Materials - Property of IBM
*  5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
*  US Government Users Restricted Rights - Use, duplication or
*  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

window.$ = window.jQuery = WLJQ;

var inspections = null;
var individualInspections = null;
var itemInInspection = null;

//current inspection ID
var currentInspectionID = null;

$(".inspection").live("click", function(){
	console.log("id = " + $(this).attr("id"));
	displayInspection($(this).attr("id"));
});

$(".inspectionItem").live("click", function(){
	displayItem($(this).attr("id"));
});

//pulls down the list of inspections in a database
function loadInspections(){
	$.mobile.showPageLoadingMsg();
	var invocationData = {
			adapter: "SQLAdapter",
			procedure: "getInspections",
			parameters: []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: loadInspectionsOK, 
		onFailure: loadInspectionsFAIL
	});
}

function loadInspectionsOK(data){
	if (!data || !data.invocationResult || !data.invocationResult.resultSet || data.invocationResult.resultSet.length==0)
		showErrorMessage("Could not retrieve feeds");

	inspections = data.invocationResult.resultSet;
	$("#inspectionsList").empty();
	
	for (var i=0; i<inspections.length; i++){
		var dataItem = inspections[i];
		
		var listItem = $("<li class='inspection' id='" + dataItem.ID + "'><a href='#'><h3>" + dataItem.inspection_title + "</h3><p>Owned by: <strong>" + dataItem.owner_name + "</strong></p><p class='ui-li-aside'>Inspection due: <strong>" + dataItem.due_date + "</strong></p></a></li>");
		$("#inspectionsList").append(listItem);
	}
	
	$("#inspectionsList").listview('refresh');
	$.mobile.hidePageLoadingMsg();
}

function loadInspectionsFAIL(data){
	showErrorMessage("Server connectivity error");
}

//pulls down items from an inspection
function loadInsptItems(inspectionID){
	$.mobile.showPageLoadingMsg();
	var invocationData = {
			adapter: "SQLAdapter",
			procedure: "getItemsInInspecion",
			parameters: [inspectionID]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: loadInsptItemsOK, 
		onFailure: loadInsptItemsFAIL
	});
}

function loadInsptItemsOK(data){
	if (!data || !data.invocationResult || !data.invocationResult.resultSet)
		showErrorMessage("Could not retrieve feeds");
	if (data.invocationResult.resultSet.length==0) {
		$("#itemList").empty();
		var listItem = $("<li class='inspectionItem'><h2 style='color: red;'>This inspection has no questions</h2></li>");
		$("#itemList").append(listItem);
		$.mobile.hidePageLoadingMsg();
	} else {
		
		individualInspections = data.invocationResult.resultSet;
		$("#itemList").empty();
		
		
		for (var i=0; i<individualInspections.length; i++){
			var dataItem = individualInspections[i];
			var alarmImage = " ";
			var notes = " ";
			var doneImage = " ";
			if (dataItem.alarm === true){
				alarmImage = "<strong style='color: red;'>Warning</strong>";
			}
			if (dataItem.done === true) {
				doneImage = "<strong style='color: green;'>Completed</strong>";
			}
			if (dataItem.notes != null) {
				notes = dataItem.notes;
			}
		
			var listItem = $("<li class='inspectionItem' id='" + dataItem.ID + "'><a href='#'><h3>" + dataItem.PDU + "&#160;&#160;&#160;&#160;&#160;" + alarmImage + 
							"</h3><p>" + notes + "</p><p class='ui-li-aside'>" + doneImage + "</p></a></li>");
			$("#itemList").append(listItem);
		}
		
		$("#itemList").listview('refresh');
		$.mobile.hidePageLoadingMsg();
	}
}

function loadInsptItemsFAIL(data){
	showErrorMessage("Server connectivity error");
}

//pulls down information on one item
function loadItem(itemId){
	$.mobile.showPageLoadingMsg();
	var invocationData = {
			adapter: "SQLAdapter",
			procedure: "getItemInfo",
			parameters: [itemId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: loadItemOK, 
		onFailure: loadItemFAIL
	});
}

function loadItemOK(data){
	if (!data || !data.invocationResult || !data.invocationResult.resultSet || data.invocationResult.resultSet.length==0)
		showErrorMessage("Could not retrieve feeds");

	itemInInspection = data.invocationResult.resultSet;
	var dataItem = itemInInspection[0];

	//console.log("PDU = " + dataItem.PDU);
	// TODO move style to stylesheet
	$("#itemName").html("<h2 style='color: red;'>" + dataItem.PDU + "<h2>");
	
	if (dataItem.alarm === true) {
		$("#alarm").val('on').slider("refresh");
	} else {
		$("#alarm").val('off').slider("refresh");
	}
	
	$("#volt_a").val(dataItem.volt_a);
	$("#volt_b").val(dataItem.volt_b);
	$("#volt_c").val(dataItem.volt_c);
	
	$("#curr_a").val(dataItem.curr_a);
	$("#curr_b").val(dataItem.curr_b);
	$("#curr_c").val(dataItem.curr_c);
	
	
	$("#kva_size").val(dataItem.kva_size);
	$("#kva_load").val(dataItem.kva_load);
	
	$("#neutral_current").val(dataItem.neutral_current);
	$("#ground_current").val(dataItem.ground_current);
	
	$("#notes").val(dataItem.notes);
	
	
	$.mobile.hidePageLoadingMsg();
}

function loadItemFAIL(data){
	showErrorMessage("Server connectivity error");
}

//Displays the inspection selected
function displayInspection(inspectionID){
	$.mobile.showPageLoadingMsg();
	
	currentInspectionID = inspectionID;
		
	$("#itemList").ready(loadInsptItems(inspectionID));

	setTimeout(function(){
		$.mobile.hidePageLoadingMsg();
		$.mobile.changePage("#InspListPage");
	}, 0);
	
}

//Display items in an inspection
function displayItem(itemId){
	$.mobile.showPageLoadingMsg();
	
	$("#InspItemPage").ready(loadItem(itemId));

	setTimeout(function(){
		$.mobile.hidePageLoadingMsg();
		$.mobile.changePage("#InspItemPage");
	}, 0);
	
}

//Submit item to database
function submitItemInspection() {
	$.mobile.showPageLoadingMsg();
	
	var dataItem = itemInInspection[0];
	var id = dataItem.ID;
	var kva_size = $("#kva_size").val();
	var volt_a = $("#volt_a").val();
	var volt_b = $("#volt_b").val();
	var volt_c = $("#volt_c").val();
	var curr_a = $("#curr_a").val();
	var curr_b = $("#curr_b").val();
	var curr_c = $("#curr_c").val();
	var kva_load = $("#kva_load").val();
	var neutral_current = $("#neutral_current").val();
	var ground_current = $("#ground_current").val();
	console.log("alarm = " + $("#alarm").val());
	if ($("#alarm").val() == "on") {
		var alarm = true;
		//send mail to owner of inspection saying an item was marked as an alarm
		var data = "from=IWM@us.ibm.com&to=" + inspections[currentInspectionID - 1].owner_email + "&subject=Alarm set in " + inspections[currentInspectionID - 1].inspection_title + "&content=Item " +
		dataItem.PDU + " in " + inspections[currentInspectionID - 1].inspection_title + " had its alarm turned on.";
		$.ajax({
			type:"POST",
			url:"http://ralphpina.net/sendMail3.php",
			data: data
		});		
	} else {
		var alarm = false;
	}
	var notes = $("#notes").val();
	
	var invocationData = {
			adapter: "SQLAdapter",
			procedure: "putItem",
			parameters: [kva_size, volt_a, volt_b, volt_c, curr_a, curr_b, curr_c, kva_load, neutral_current, ground_current, alarm, notes, id]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: submitItemInspectionOK, 
		onFailure: submitItemInspectionFAIL
	});
		
}

function submitItemInspectionOK(data){
	
	loadInsptItems(currentInspectionID);
	
	$.mobile.hidePageLoadingMsg();
	
	$("#response").fadeIn("slow");
	$("#response").html("<h3 style='color: green'>Submitted successfully!<h3>");
	setTimeout(function(){
		$("#response").fadeOut("slow");
		$.mobile.changePage("#InspListPage");
	}, 2000);
}

function submitItemInspectionFAIL(data){
	$.mobile.hidePageLoadingMsg();
	
	//showErrorMessage("Server connectivity error");
	$("#response").fadeIn("slow");
	$("#response").html("<h3 style='color: red;'>There was an error submiting the data</h3>");
	setTimeout('$("#response").fadeOut("slow")', 5000);
}

function showErrorMessage(text){
	$.mobile.hidePageLoadingMsg();
	$("#DialogText").html(text);
	$.mobile.changePage("#DialogPage");
}

//populate and change page to contact page
function contactPage() {
	console.log("inspections[currentInspectionID].owner_name = " + inspections[currentInspectionID - 1].owner_name);
	console.log("inspections[currentInspectionID].owner_email = " + inspections[currentInspectionID - 1].owner_email);
	console.log("inspections[currentInspectionID].inspection_title = " + inspections[currentInspectionID -1].inspection_title);
	
	$("#inspectionOwner").html("<h2>Write a message to the owner of this inspection: " + inspections[currentInspectionID -1].owner_name + "</h2>");
	$("#address").val(inspections[currentInspectionID -1].owner_email);
	$("#subject").val("Message regarding " + inspections[currentInspectionID - 1].inspection_title);
	
	$.mobile.changePage("#ContactPage");
	
}

//sent e-mail to PHP via .ajax()
function sendMail() {
	
	var to = inspections[currentInspectionID - 1].owner_email;
	var from = 'IWM@us.ibm.com';
	var subject = $("#subject").val();
	var content = $("#message").val();
	
	var data = "from=" + from + "&to=" + to + "&subject=" + subject + "&content=" + content;
	
	console.log("data = " + data);
	console.log("sendMail entered");
	
	$.ajax({
		type:"POST",
		url:"http://ralphpina.net/sendMail3.php",
		data: data,
		success: function(){
			$("#emailSendResult").fadeIn("slow");
			$("#emailSendResult").html("<h3 style='color: green'>E-mail sent successfully!<h3>");
			setTimeout('$("#emailSendResult").fadeOut("slow")', 4000);
		},
		error: function(){
			$("#emailSendResult").fadeIn("slow");
			$("#emailSendResult").html("<h3 style='color: red'>There was a problem sending e-mail<h3>");
			setTimeout('$("#emailSendResult").fadeOut("slow")', 4000);
		},
   	});
}

function wlCommonInit(){
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	//loadFeeds();
	loadInspections();
	
	//added by Ralph Pina
	//to make default text show up in Messages in contact form
	var standard_message = $('#message').val();
	$('#message').focus(
	    function() {
	        if ($(this).val() == standard_message)
	            $(this).val("");
	    }
	);
	$('#message').blur(
	    function() {
	        if ($(this).val() == "")
	            $(this).val(standard_message);
	    }
	);
	
}

