/******************************************************************************/

// Configuration

var mainView = new View({
	width:2000, height:1200, scale: 1,
	x: 0, y: 0
});

var images = [
	"images/stack1.png", "images/stack2.png", "images/stack3.png", "images/stack4.png"
];

var imageCount = images.length;
var visibleImageCount = imageCount;

var imageViews = $.map(images, function(src, i){

	return new ImageView({
		width: 400,
		height: 300,
		image: src,
		x: 200,
		y: 200,
		opacity: 1,
		rotation: (imageCount*10 - 10*i) * ((i%2 == 0)? 1: -0.5) / 5,
		superView: mainView
	});

});


var spring = "spring(200, 15, 0)";
var stackspring = "spring(100, 15, 0)"

/******************************************************************************/

// Some utility functions

// Maps value "progress" from (0,1) to (min, max).
function rescale(progress, min, max){
	return progress*(max-min) + min;
}


var overEveryImage = function( operation ){
	$.map(imageViews, function(view, i){
		operation(view, i);
	});
};

function updatePosition(event) {
	overEveryImage(function(view, i){

		if (i + 1 == visibleImageCount){
			view.x = event.x - 200;
			view.y = event.y - 200;
			view.rotation = rescale((event.x - 300)/400, -10, 10);
		}
		else if (i + 1 < visibleImageCount){
			view.x = rescale(i/imageCount, 200 - 10*i, 250);
			view.y = rescale(i/imageCount, 200 - 10*i, 250);
		}

	});
}

function animateToNormal(view, i){
	view.animate({
  		properties: {
  			x: 200,
  			y: 200,
  			rotation: (imageCount*10 - 10*i) * ((i%2 == 0)? 1: -0.5) / 5,
  		},
			curve: spring
	});
}

function removeView(view, i){

	console.log("Removed + " + visibleImageCount);
	visibleImageCount = visibleImageCount - 1;
	view.animate({
  		properties: {
  			x: 500,
				y: -400
			},
			curve: stackspring
	});
}


/******************************************************************************/

// Handle clicking/dragging
mainView.on("mousedown", function(event) {

	mainView.animateStop();

	overEveryImage(function(view, i){
			if (i + 1 < visibleImageCount){
				view.animate({
					properties: {
						x: rescale(i/imageCount, 200 - 10*i, 250),
						y: rescale(i/imageCount, 200 - 10*i, 250),
					},
					curve: spring
				});
			}

		});

	document.addEventListener("mousemove", updatePosition);

	// Stop updating on click release
	document.addEventListener("mouseup", function(event){

		document.removeEventListener("mousemove", updatePosition);

		overEveryImage(function(view, i){

			console.log(visibleImageCount);

			if (i + 1 > visibleImageCount){
				// do nothing
			}else if (i + 1 == visibleImageCount){
				var range = Math.pow(350 - view.x, 2) + Math.pow(350 - view.y, 2);
				console.log(range);
				if (range > 80000){
					removeView(view, i);
				}else{
					animateToNormal(view, i);
				}
			}else{
				animateToNormal(view, i);
			}

		});

	});

});

