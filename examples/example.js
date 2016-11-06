$(document).ready(function(){
	var $body = $('body');

	// addToSelect
	$('#select').addToSelect({
		a : 'option a',
		b : 'option b',
		c : 'option c'
	}).addToSelect('d', 'option d');

});