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
//		if (key == null) initGUI (newTitle());
if (key == null)
{
//	It makes no sense for the input elements to be readonly when this is a new title...traverse the DOM and remove the
//	readonly attribute.  Then, hide the edit button.  This is exactly the same thing that has to be done when the
//	edit button is clicked, so put that code in a function where I can get at it from the click event handler and from
//	here
	initGUI (newTitle());
	editMode (true);
}
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
editMode (true);
				break;
			}
		case "reset-page":
			{
				resetPage();
				break;
			}
		default:
			{
				alert ("handleNavClicks ()");
				break;
			}
	}
}

function resetPage ()
{
	//	Reset the page to initial values.  The initial value of each DOM element was assigned to a custom attribute
	//	called 'reset'.

	resetElement (document.getElementsByTagName ("input"));
	resetElement (document.getElementsByTagName ("textarea"));

	//	There are also editable div elements (can't use textarea because I want allow some HTML tags for formatting).  They
	//	also need to become editable, but that's slightly different.

//		const div = document.querySelectorAll (".editable");
//		for (i=0; i<div.length; i++)
//		{
//			div[i].setAttribute ("contenteditable", true)
//		}
resetElement (document.querySelectorAll (".editable"));
}

function resetElement (list, _)
{
	//	reset the values of all editable fields to whatever value they had when the page was loaded.

//		Array.from (list).forEach (l =>
	for (i=0; i<list.length; i++)
		{
			//	There are editable div, input and textarea elements.  Some of the input elements may be checkboxes.  Eventually,
			//	there will be star ratings and favorites (although I don't know how I;m going to handle those just yet.  They all
			//	need to be handled a little differently. 

//				if (l.tagName == "div")
			if (list[i].tagName == "DIV")
			{
//					l.innerHTML = l.getAttribute ("reset");
				list[i].innerHTML = list[i].getAttribute ("reset");
				continue;
			}
//
//	Any other "special cases" elements go here; checkbosec, radio buttons, star ratings, etc...
//
			//	And finally...the default behavior.  Assign the value of reset to the value attribute of the element

//				l.innerHTML = l.getAttribute ("reset");
			list[i].value = list[i].getAttribute ("reset");
		}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Various functions used throughout the page

function editMode (_)
{
//	This function does not take a parameter just yet -- maybe never.  The function is set up with an argument as a
//	reminder to me, because I may want to toggle edit mode (say after saving) someday.

//	Use .getElementsByTagName to retrieve a reference to all input elements.  Iterate that list and remove the attribute
//	'readonly' from each.  Do the same for textarea elements.  There are a few div elements that need to be made editable
//	as well.  Assign a value of true to property 'contenteditable'

	toggleReadonly (document.getElementsByTagName ("input", true));
	toggleReadonly (document.getElementsByTagName ("textarea", true));

	//	There are also editable div elements (can't use textarea because I want allow some HTML tags for formatting).  They
	//	also need to become editable, but that's slightly different.

	// const main = document.getElementsByTagName ("main")[0];
	// const div = main.querySelector (".editable");
	const div = document.querySelectorAll (".editable");
	for (i=0; i<div.length; i++)
	{
		div[i].setAttribute ("contenteditable", true)
	}

	//	configure nav icons

	document.getElementById ("edit-page").classList.add ("hidden");
	document.getElementById ("reset-page").classList.remove ("hidden");
	document.getElementById ("save-this-title").classList.remove ("hidden");
}

function toggleReadonly (list, _)
{
	//	Toggle the readonly attribute on GUI input elements.

	//	Some day I may really want to use this function to toggle readonly, but for now I'm just removing it.  So for the
	//	time being, I'm just ignoring the second parameter.  I've included it as a placeholder/reminder.

	Array.from (list).forEach (l =>
		{
			l.removeAttribute ("readonly");
		})
}
