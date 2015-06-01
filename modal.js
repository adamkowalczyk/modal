// INSTRUCTIONS //
//////////////////

// 1) set class of link to 'modal-link' (mulitple classes okay)
// 2) if link contains an img - img will load in modal. <img> should be only child of <a>
// 3) in this case, links href is arbitrary, will be displayed in browser bar
// 4) if link contains anything else, e.g. text, actual href will be fetched and loaded in modal
// 5) in this case, links href MUST point to resource

// img link functionailty is for gallery style thumbnail pop-up use case.

// TODO close modal click handlers on outer-click/close click
// ??? How to track orignal page - e.g. when mulitple modals used?
// 1) check for modal on clickEvent/check state object ( window.history.state)
// 2) add a special prop to stateObj 'originalHref',propage, reload on close etc.


function fetchContent(link) {
	var xhr = new XMLHttpRequest();
	// NB using async xhr (sync is deprecated) with up-to-date event triggers
	var modal = document.getElementById('modalInner');

	// add event listeners before calling #open. alerts on fail for development
	// TODO on fail, remove modal. Better, keep modal hidden until content loaded
	xhr.addEventListener('error', function(){ alert('xhr error'); });
	xhr.addEventListener('abort', function(){ alert('xhr abort'); });
	xhr.addEventListener('load', function(){
		console.log(xhr.responseText);
		modal.innerHTML = xhr.responseText;
		// update click handlers to allow modals to link to each other.
		addAllClickHandlers();
	});
	// trigger xhr
	xhr.open('GET', link);
	xhr.send();
}

function renderModal() {
	var extantModal = document.getElementById('modalOuter');

	if (!extantModal) {
		var modalOuter = document.createElement('div');
		modalOuter.id = 'modalOuter';
		var modalInner = document.createElement('div');
		modalInner.id = 'modalInner';
		document.body.appendChild(modalOuter);
		modalOuter.appendChild(modalInner);
	}
	else {
		return false;
	}
	
}

function renderModalImg(src) {
	var extantImgae = document.getElementById('modaImage');

	if (!extantImgae) {
		var modalInner = document.getElementById('modalInner');
		var modalImage = document.createElement('img');
		modalImage.id = 'modalImage';
		modalImage.src = src;
		modalInner.appendChild(modalImage);
	}
	else {
		imgElement.src = src;
	}
}

function loadModal(state) {
	// checking state object, as works for back/forward as well as link click
	if (state.class === 'modal-link') {
		// was event.target an img?
		if (state.tagName === 'IMG') {
			console.log('IMG detected');
			// use img src to populate modal
			// add modal to DOM
			renderModal();  // <- render a different modal for gallery? Or use 2nd func to add gal elems
			// add img element, set image src
			renderModalImg(state.src);
			addAllClickHandlers();
		}
		else {
			// use href to populate modal with html fragment
			// add modal to DOM
			renderModal(); 
			// populate modal
			fetchContent(state.href);
			// NB click handlers set in fetchContent()
		}
	}
	// if !state.class, click back to original page
	else {
		var extantModal = document.getElementById('modalOuter');
		if (extantModal) {
			console.log('Removing modal');
			extantModal.parentNode.removeChild(extantModal);
		}
		//?? This never (normally) triggers. popstate only when pushState has happened? docs seem to say should happen anyway
		// else we must be navigating between normal page links
		else {
			alert('Normal page else fired - loadModal() failed');
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

// !!! On img click, event.target is IMAGE, bubbles up to <a>

function linkGrabber(event) {
	// NB don't try and put a node object in state, it breaks.
	
	// className/href - accouting for possibility of target being link, or image -> checking parentNode
	var className;
	if (event.target.className.indexOf('modal-link') !== -1) {
		className = 'modal-link';
	}
	else if (event.target.parentNode.className.indexOf('modal-link') !== -1) {
		className = 'modal-link';
	}
	
	var href;
	if (event.target.href) {
		href = event.target.href;
	}
	else if (event.target.parentNode.href) {
		href = event.target.parentNode.href;
	}

	var stateObject = {
					tagName: event.target.tagName,
					class: className,
					href: href,
					src: event.target.src
				};
	
	console.log(stateObject);
	loadModal(stateObject);
	history.pushState(stateObject, null, href);
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