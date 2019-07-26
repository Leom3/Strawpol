/**
 * index.js
 * Created by Charles Aubert.
 * Packet factory for server responses.
 */

var states = {
	sucess: "success",
	failure: "failure"
};

var types = {
	success: "success",
	warning: "warning",
	error: "error"
};

module.exports = {
	create_response(message, type, data) {
		var response = {
			"message": message,
			"type": type,
			"data": data
		};

		return response;
	},
	states,
	types
};