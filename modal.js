// TODO add feature detecetion http://diveintohtml5.info/detect.html#history
// TODO add IE6 fallback http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery

// TODO add global vars/config object to set regex keyword, no. images to display. anything else? toggle 'gallery' function?

// TODO. if using as gallery, rather than requesting an html file, what about getting the img src and rendering directly?

// TODO? add transition effect?

function fetchContent(link) {
	var xhr = new XMLHttpRequest();
	// NB using async xhr (sync is deprecated) with up-to-date event triggers
	var modal = document.getElementById('modal');

	// add event listeners before calling #open. alerts on fail for development
	xhr.addEventListener('error', function(){ alert('xhr error'); });
	xhr.addEventListener('abort', function(){ alert('xhr abort'); });
	xhr.addEventListener('load', function(){
		console.log(xhr.responseText);
		modal.innerHTML = xhr.responseText;
	});

	xhr.open('GET', link);
	xhr.send();
}



// function for gallery use - finds eligble img links on main page
// adds thumbnails to bottom of modal
// assumes
function populateThumbnails() {
	// get eligible thumbnail links. by class?  src/href regex
	// pare down to max display num. 5? Alphabetical sort? page order sort?
	// if over 5, add/enable scroll buttons
	// add img srcs to thumbnail elements
	
	// for now:
	return false;
}

// need to make this function in context of forward/back gallery clicks
function swapContent(link) {
	var modal = document.getElementById('modal');

	// check if link is to modal content e.g. gallery
	if (link.match(/gallery/) ) {
		// check if modal element needs adding
		if (!modal) {
			console.log('Modal NOT in place. Populate.');
			var modalDiv = document.createElement('div');
			modalDiv.id = 'modal';
			modalDiv.style.zIndex = '10';
			modalDiv.style.width = '50%'; //make outer div 100% in final
			modalDiv.style.height = '50%';
			document.body.appendChild(modalDiv);
			fetchContent(link);
			populateThumbnails();
			addAllClickHandlers();
		}
		else {
			console.log('Modal already in place. Populate.');
			fetchContent(link);
			populateThumbnails();
			addAllClickHandlers();
		}
	}

	// ??? Currently removeModal fires but no alert in !modal

	// else, link is to ordinary page
	else {
		// if modal, remove. Is this reliable? 
		// Find a way to confirm that we have moved back to historyState just before first modal load
		if (modal) {
			alert('Remove modal fired');
			console.log('Removing modal');
			modal.parentNode.removeChild(modal);
		}
		// else we must be navigating between normal pages (which may still contain this script!)
		// so, load as normal
		else {
			alert('Normal page else fired');
			console.log('Load page normally');
			window.location = window.location.href;
		}
	}
}

// NB!! popstate only fires if history has been manually manipluated

// popstate fires on back button press (and, forwward?)
// when event fires, address bar location has already changed 
window.addEventListener('popstate', function(e) {
	console.log('POP!');
	console.log(e);
	swapContent(window.location.href);
});


// need to use a NAMED FUNCTION when adding event listeners
// otherwise, you can add multiples of the same func. JS looks for func name to check for dupes.
function linkGrabber(event) {
	swapContent(event.target.href);
	history.pushState(null, null, event.target.href);
	event.preventDefault();
}


function addAllClickHandlers() {
	console.log('Click handlers set');
	var linkList = document.querySelectorAll('a.gallery'); //NB return node list, not an array
	var linkArray = Array.prototype.slice.call(linkList); // now it's an array!
	console.log(linkArray);
	linkArray.forEach(function(linkElement){
		linkElement.addEventListener('click', linkGrabber);
	});
}

// equivalent to $(document).ready
// click handlers set when page loads
document.addEventListener('DOMContentLoaded', function() {
	addAllClickHandlers();
});

// <IE8 fallback
// document.attachEvent("onreadystatechange", function(){
//   if (document.readyState === "complete"){
//     document.detachEvent( "onreadystatechange", arguments.callee );
//     // code ...
//   }
// });