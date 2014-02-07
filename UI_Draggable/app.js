/******************************************************************************/

// Configuration

var myView = new ImageView({
	width:320, height:480, scale:0.3,
	image: "tile.png",
	x: 15, y: -40
});

var states = [
	{x: 15, y: -40,  scale: 0.3, 	rotation: 0},
	{x: 102, y: 105,  scale: 1.1, rotation: 0}
];


var spring = "spring(500, 15, 0)"

var rotationFreedom = [-60, 30];				// Maximum angle the view should get rotated
var xRotationRange = 400;				// Pixels to the left/right of state
var scaleOvershoot = 0.1;				// How much should we overshoot on scale.
var scaleUndershoot = 0;				// How much should we underShoot on scale.

/******************************************************************************/

// Some utility functions

// Returns function that rescales value from (min,max) to (0,1).
// Setting "constrain" to TRUE guarantees returned value is within (0,1).
function progressFunction(min, max, constrain){
	return function(value){
		var scaled = (value - min)/(max-min);
		if (constrain){
			scaled = (scaled < 0)? 0 : scaled;
			scaled = (scaled > 1)? 1 : scaled;
		}
		return scaled;
	};
}

// Maps value "progress" from (0,1) to (min, max).
function rescale(progress, min, max){
	return progress*(max-min) + min;
}

/******************************************************************************/

// Given an event, pick which state we should animate to.
var pickState = function(event){
	var threshold = (states[1].y - states[0].y)/2 + states[0].y + myView.height - 100;
	return (event.y < threshold) ? states[0] : states[1];
}

var xPos = progressFunction(states[0].x - xRotationRange, states[1].x + xRotationRange, true);
var yPos = progressFunction(states[0].y + myView.height*states[0].scale, states[1].y + myView.height*states[1].scale , true);

// Given an event, update the position and properties of the view
var updatePosition = function(event) {
	myView.midX = event.x;
	myView.midY = event.y;

	myView.rotation = rescale( xPos(event.x), rotationFreedom[0], rotationFreedom[1]);

	myView.scale = rescale(
		yPos(event.y),
		states[0].scale-scaleUndershoot,
		states[1].scale+scaleOvershoot
	);
}

/******************************************************************************/

// Handle clicking/dragging
myView.on("mousedown", function(event) {

	myView.animateStop();
	document.addEventListener("mousemove", updatePosition);

	// Stop udating on click release
	document.addEventListener("mouseup", function(event) {
		document.removeEventListener("mousemove", updatePosition)
        myView.animate({
		    		properties: pickState(event),
						curve: spring
				});
	});

});

