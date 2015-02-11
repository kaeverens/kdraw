$(function() {
	$('#signature').kDraw({
		'rotate':function() {
			return +$('#rotate').val();
		}
	});
});
