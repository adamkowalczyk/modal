# Modal

### Description

A stand alone vanilla JS script for modal popups.

Using the History API to create the illusion of full page loads (back/forward button goodness) but in fact just loading the modal content by AJAX, or in the case of an image, by grabbing the image src link.

### Instructions

1. Set class of link to 'modal-link' (mulitple classes are supported)
2. If link contains an img, the img will load in the modal. The img tag should be only child of the link.
3. In this case, the links href should link to file containing the modal js and css html links.
4. If link contains anything else, e.g. text, the actual link href will be fetched and loaded in the modal.
5. In this case, the links href MUST point to the required resource. The HTML fragment should include tags linking to modal js and css at the top.


*NB*

You must include tags linking to the modal js and css files in each HTML fragment / resource linked to by an img link

This is clunky, but currently the only way to prevent broken behaviour on browser refresh/re-open
If tags are omitted, the resource in window.location is loaded as normal - this is bad.

### Run demo

1. Clone this repo.
2. `npm install -g http-server` (or similar simple server)
3. `http-server`
4. Open browser!

