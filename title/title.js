//	TITLE.JS
//
//	This module collects the funvtions specific to title maintenanve (title.html).

let mode = undefined;

window.addEventListener ("load", event =>
	{	event.preventDefault();

		initializeGUI();

		//	And add some event listeners

		document.getElementsByTagName ("nav")[0].addEventListener ("click", event => { handleNavClicks (event); } );
	})

function initializeGUI ()
{
	//	Initial the GUI with data from the indicated title into the DOM.  If no title is indicated, assume this is a new
	//	title and initialze fields with default values (usually empty strings).

	//	If this page is displaying or editing data from an existing title, the unique key to identify that title will be
	//	passed in sessionStorage.

	mode = "NEW TITLE";

	const key = sessionStorage.getItem ("movie.key");
	if (key == null)
	{
		newTitle();
		initGUI();
	}
	else
	{
		mode = "UPDATE TITLE";
		retrieveTitle (key);
		initGUI();

		//	sessionStorage is no longer needed and may cause problems later if it is allowed to persist to multiple page
		//	loads.  So remove it now...

		sessionStorage.removeItem ("movie.key");
	}
}

let resetValues = {};

function initGUI (data)
{
alert ("initValues()");
alert (JSON.stringify (resetValues, " ", 2) );
}

function newTitle ()
{
	//	Assign default values to the global variable resetValues.  These values are used to initialize the page when it
	//	is first loaded.  They may also be used later to undo any changes made (similar to what could be accomplished by
	//	reloading the page.  As such, resetValues must persist and be available throughout the session.

alert ("newTitle ()");

resetValues =
	{
		key:		null,
		title:		null,
		release:	null,
		about:		null
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the nav

function handleNavClicks (event)
{	event.preventDefault();
	let target = event.target;

	//	The id for each icon is actually in the button element and there's a very good chance that that won't be the element
	//	identified in event.target.  If not, traverse event.target's ancestors until one of them has an id attribute.

	let id = undefined;
	while (target.getAttribute ("id") == undefined)
	{
		target = target.parentElement;
	}

	switch (target.getAttribute ("id"))
	{
		case "go-back":
			{
				history.back();
				break;
			}
		default:
			{
				alert ("handleNavClicks ()");
				break;
			}
	}
}