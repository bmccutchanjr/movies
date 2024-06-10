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
	if (key == null) initGUI (newTitle());
	else
	{
		mode = "UPDATE TITLE";
		initGUI (retrieveTitle (key));

		//	sessionStorage is no longer needed and may cause problems later if it is allowed to persist to multiple page
		//	loads.  So remove it now...

		sessionStorage.removeItem ("movie.key");
	}
}

function initGUI (data)
{
	//	This function populates GUI elements with values from a JSON object.  That object is either actual data
	//	from the datastore or default values used to initialize the page.  The keys of the object coorespond to
	//	the id attribute of the DOM elements.

	Object.entries (data).forEach (datum =>
	{
		const e = document.getElementById (datum[0]);

		if (datum[0] == "about")
			e.innerHTML = datum[1];
		else
			e.value = datum[1];

		e.setAttribute ("reset", datum[1]);
	})
}

function newTitle ()
{
	//	Assign default values to the global variable resetValues.  These values are used to initialize the page when it
	//	is first loaded.  They may also be used later to undo any changes made (similar to what could be accomplished by
	//	reloading the page.  As such, resetValues must persist and be available throughout the session.  To save these
	//	values are assigned to a custiom property in each DOM element...that property will be called 'reset'.

	const d =
		{
			key:		null,
			title:		null,
			release:	null,
			about:		null
		}
//	const d =
//		{
//			key:		null,
//			title:		"Lost in Translation",
//			release:	1937,
//			about:		"Bill <b>Murray</b> and Scarlett <b>Johansson</b> <s>parody</s> meet in Tokyo."
//	}

	return d;
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
		case "edit-page":
			{
//	Use .getElementsByTagName to retrieve a reference to all input elements.  Iterate that list and remove the attribute
//	'readonly' from each.  Do the same for textarea elements.  There are a few div elements that need to be made editable
//	as well.  Assign a value of true to property 'contenteditable'
				break;
			}
		default:
			{
				alert ("handleNavClicks ()");
				break;
			}
	}
}