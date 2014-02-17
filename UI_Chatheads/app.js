/******************************************************************************/

// Configuration

var x_margin = 50;

var mainView = new View({
	width:2000, height:1200, scale: 1,
	x: 0, y: 0
});

var images = [
	"head.png", "head.png", "head.png"
];

var imageViews = $.map(images, function(src, i){

	return new ImageView({
		width: 100,
		height: 100,
		image: src,
		x: x_margin,
		y: 100,
		superView: mainView
	});

});

var spring = "spring(500, 50, 0)"


/******************************************************************************/


var overEveryImage = function( operation ){
	$.map(imageViews, function(view, i){
		operation(view, i);
	});
};

var moveRestTo = utils.throttle( 200, function(x, y){
	$.map(imageViews, function(view, i){
		if (i != imageViews.length - 1){
			view.animate({
				properties: {
					x: x - 50,
					y: y - 50
				},
				curve: "spring(" + [200 + 200*i, 40, 0].join(",") + ")",
			});
		}
	});
});

// Given an event, update the position and properties of the view
var updatePosition = function(event) {

	var topview = imageViews[imageViews.length - 1];
	topview.midX = event.x;
	topview.midY = event.y;

	moveRestTo(event.x, event.y);
}

var releasedProperties = function(event) {
	var x_righthand = window.innerWidth - 100 - x_margin;
	var x = (event.x < window.innerWidth / 2) ? x_margin : x_righthand;
	return {
		x: x,
		y: event.y
	}
}

/******************************************************************************/

// Handle clicking/dragging
mainView.on("mousedown", function(event) {

	mainView.animateStop();
	document.addEventListener("mousemove", updatePosition);

	// Stop udating on click release
	document.addEventListener("mouseup", function(event) {
		document.removeEventListener("mousemove", updatePosition);
		var animateTo = releasedProperties(event);
		overEveryImage(function(view, i){
			view.animate({
				properties: animateTo,
				curve: "spring(" + [200 + 20*i, 10, 0].join(",") + ")"
			});
		});
	});

});

