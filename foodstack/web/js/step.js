var getData = function getStep(url, callback) {
	// Get JSON Data from UrbanDictionary API 
	$$.getJSON(url, function(json) {
		// Insert rendered template
		callback(json);
	});
}
var stackStep = {
	data : null,
	id : null,
	title : null,
	baseUrl : '../index.php/api/Menu/stack',
	load : function(id) {
		getData(this.baseUrl + '/id/' + id, function(json) {
			mainView.router.load({
				url : 'stackStep.html',
				context : json,
			});
		});
	}
};
var materialDetail = {
	data : null,
	link : null,
	name : null,
	baseUrl : '../index.php/api/Markets/material',
	load : function(id) {
		getData(this.baseUrl + '/link/' + id, function(json) {
			mainView.router.load({
				url : 'material.html',
				context : json,
			});
		});
	}
};