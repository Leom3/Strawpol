/**
 * index.js
 * Created by Charles Aubert.
 * Request tool functions.
 */

module.exports = {
	check_request_informations(informations) {
		for (key in informations) {
			if (informations[key] == null ||
				informations[key] == undefined || 
				informations[key] == "") {
				return false;
			}
		}
		return true;
	}
};