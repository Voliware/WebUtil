$(document).ready(function(){
	var $body = $('body');

	// addToSelect
	// note: loose form is for backwards compat
	$('#select')
		.addToSelect({
			a : 'option a - key/value pair in single object, loose form'
		})
		.addToSelect({
			b : 'option b - key/value pair in single object with multiple entries, loose form',
			c : 'option c - key/value pair in single object with multiple entries, loose form'
		})
		.addToSelect('d', 'option d - string option')
		.addToSelect(5, 'option e - numeric option (5), disabled', true)
		.addToSelect({
			value : 'f',
			text : 'option f - single object, well formed, disabled',
			disabled : true
		})
		.addToSelect({
			value : 'g',
			text : 'option g - single object, well formed, enabled',
			disabled : false
		})
		.addToSelect([
			{
				value : 'h',
				text : 'option h - array of objects, well formed, disabled',
				disabled : true
			},
			{
				value : 'i',
				text : 'option i - array of objects, well formed, enabled',
				disabled : false
			}
		])
		.addToSelect({
			j: {
				value: 'j',
				text: 'option j - object of named objects, well formed, disabled',
				disabled: true
			},
			k: {
				value: 'k',
				text: 'option k - object of named objects, well formed, enabled'
			}
		})
		.addToSelect(
			{
				value: 'l',
				text: 'option l - comma seperated objects, well formed, disabled',
				disabled: true
			},
			{
				value: 'm',
				text: 'option m - comma seperated objects, well formed, enabled'
			}
		);
	});