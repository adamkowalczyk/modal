// use state object to allow same handler for clicks and popstate events
// NB state is for CURRENT page


function fetchContent(link) {
	var xhr = new XMLHttpRequest();
	// NB using async xhr (sync is deprecated) with up-to-date event triggers
	var modal = document.getElementById('modalInner');

	// add event listeners before calling #open. alerts on fail for development
	xhr.addEventListener('error', function(){ alert('xhr error'); });
	xhr.addEventListener('abort', function(){ alert('xhr abort'); });
	xhr.addEventListener('load', function(){
		console.log(xhr.responseText);
		modal.innerHTML = xhr.responseText;
		addAllClickHandlers();
	});

	xhr.open('GET', link);
	xhr.send();
}

function renderModal() {
	var modalOuter = document.createElement('div');
	modalOuter.id = 'modalOuter';
	var modalInner = document.createElement('div');
	modalInner.id = 'modalInner';
	document.body.appendChild(modalOuter);
	modalOuter.appendChild(modalInner);
}

function loadModal(state) {
	var extantModal = document.getElementById('modalOuter');

	// TODO account for multiple classes, indexOf
	if (state.class === 'modal-link') {
		// does link contain img tag as first child?
		if (state.firstChild.nodeName === 'IMG') {
			// use img src to populate modal
			if (!extantModal) {
				// add modal to DOM
				renderModal();  // <- render a different modal for gallery? Or use 2nd func to add gal elems
				// CREATE + APPEND IMG ELEM
				// SET IMG SRC state.firstChild.src
				addAllClickHandlers();
			}
			else {
				// populate modal
			}
		}
		else {
			// use href to populate modal with html fragment
			if (!extantModal) {
				// add modal to DOM
				renderModal(); 
				// populate modal
				fetchContent(state.href);
			}
			else {
				// populate modal
				fetchContent(state.href);
			}
		}
	}
	// if !state.class, click back to original page
	else {
		if (extantModal) {
			console.log('Removing modal');
			extantModal.parentNode.removeChild(extantModal);
		}
		//? This should never be called, as popstate event only triggered where history state has been manually altered
		// else we must be navigating between normal page links
		// so, load as normal
		else {
			alert('Normal page else fired - this never happens!!!!');
			console.log('Load page normally');
			window.location = window.location.href;
		}
	}
}


////////////
// Popstate listener
////////////

window.addEventListener('popstate', function(event) {
	console.log('POP!');
	console.log(event);
	if (window.history.state) {
		loadModal(window.history.state);
	}
	else {
		var fakeState = {class: null, firstChild: null, href: window.location.href};
		loadModal(fakeState);
	}
	
});

/////////////////
// Click Handlers
//////////////////

function linkGrabber(event) {
	// NB don't try and put a node object in state, it breaks.
	var stateObject = {
					firstChild:  {
									nodeName: event.target.firstChild.nodeName, 
									src: event.target.firstChild.src
								},
					class: event.target.className,
					href: event.target.href
				};
	console.log(stateObject);
	loadModal(stateObject);
	history.pushState(stateObject, null, event.target.href);
	event.preventDefault();
}


function addAllClickHandlers() {
	console.log('Click handlers set');
	var linkList = document.querySelectorAll('a.modal-link'); //NB return node list, not an array
	var linkArray = Array.prototype.slice.call(linkList); // now it's an array!
	console.log(linkArray);
	linkArray.forEach(function(linkElement){
		linkElement.addEventListener('click', linkGrabber);
	});
}

// equivalent to $(document).ready, click handlers set when page loads
document.addEventListener('DOMContentLoaded', function() {
	addAllClickHandlers();
});