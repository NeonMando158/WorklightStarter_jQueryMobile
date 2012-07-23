/*
*  Licensed Materials - Property of IBM
*  5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
*  US Government Users Restricted Rights - Use, duplication or
*  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

function getEngadgetFeeds() {

	var response = WL.Server.invokeHttp({
		method : 'get',
		returnedContentType : 'xml',
		path : 'rss.xml',
		transformation : {
			type : 'xslFile',
			xslFile : 'Items.xsl'
		}
	});

	return response;
}