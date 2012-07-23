/*
*  Licensed Materials - Property of IBM
*  5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
*  US Government Users Restricted Rights - Use, duplication or
*  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//Create SQL query
var getAccountsTransactionsStatement = WL.Server.createSQLStatement( 
	"SELECT transactionId, fromAccount, toAccount, transactionDate, transactionAmount, transactionType " + 
	"FROM accounttransactions " + 
	"WHERE accounttransactions.fromAccount = ? OR accounttransactions.toAccount = ? " +
	"ORDER BY transactionDate DESC " + 
	"LIMIT 20;"
);

//Invoke prepared SQL query and return invocation result	
function getAccountTransactions1(accountId){
	return WL.Server.invokeSQLStatement({
		preparedStatement : getAccountsTransactionsStatement,
		parameters : [accountId, accountId]
	});
}


//Invoke stored SQL procedure and return invocation result
function getAccountTransactions2(accountId){
	return WL.Server.invokeSQLStoredProcedure({
		procedure : "getAccountTransactions",
		parameters : [accountId]
		
	});
}

/*var getItemsToInspectStatement = WL.Server.createSQLStatement(
		"SELECT inspection_question, alarm, notes, done " + 
		"FROM inspections_workflow;"
);*/

//statement and function to get info for one item to modify it
var getItemInfoStatement = getItemsToInspectStatement = WL.Server.createSQLStatement(
		"SELECT ID, PDU, kva_size, volt_a, volt_b, volt_c, curr_a, curr_b, curr_c, kva_load, " +
		"neutral_current, ground_current, alarm, notes, done " +
		"FROM inspections_questions " +
		"WHERE inspections_questions.ID = ?;"
);

function getItemInfo(itemID){
	return WL.Server.invokeSQLStatement({
		preparedStatement : getItemInfoStatement,
		parameters : [itemID]
	});
}

//statement and function to pull down all items in one inspection
var getItemsInInspectStatement = getItemsToInspectStatement = WL.Server.createSQLStatement(
		"SELECT ID, PDU, alarm, notes, done " +
		"FROM inspections_questions " +
		"WHERE inspection_id = ?;"
);

function getItemsInInspecion(inspectionID){
	return WL.Server.invokeSQLStatement({
		preparedStatement : getItemsInInspectStatement,
		parameters : [inspectionID]
	});
}

//statement and function to pull down all inspections to the main loading page
var getInspectionsStatement = WL.Server.createSQLStatement(
		"SELECT ID, inspection_title, DATE_FORMAT(due_date, '%m-%d-%Y') AS due_date, owner_name, owner_email " +
		"FROM inspections_overview;"
		);

function getInspections() {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getInspectionsStatement,
		parameters : []
	});
}

//statement and function to submit changes to an item
var putItemStatement = WL.Server.createSQLStatement(
		"UPDATE inspections_questions " +
		"Set kva_size = ?, volt_a = ?, volt_b = ?, volt_c = ?, curr_a = ?, curr_b = ?, curr_c = ?, kva_load = ?, neutral_current = ?, ground_current = ?, alarm = ?, notes = ?, done = true " +
		"WHERE ID = ?;"
		);

function putItem(kva_size, volt_a, volt_b, volt_c, curr_a, curr_b, curr_c, kva_load, neutral_current, ground_current, alarm, notes, id) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : putItemStatement,
		parameters : [kva_size, volt_a, volt_b, volt_c, curr_a, curr_b, curr_c, kva_load, neutral_current, ground_current, alarm, notes, id]
	});
}

