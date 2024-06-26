//	TITLE.JS
//
//	This module collects the funvtions specific to title maintenanve (title.html).

let mode = undefined;

window.addEventListener ("load", event =>
	{	event.preventDefault();

		initializeGUI();

		//	And add some event listeners

		document.getElementsByTagName ("main")[0].addEventListener ("input", event => { handleInputEvents (event); } );
		document.getElementsByTagName ("main")[0].addEventListener ("click", event => { handleMainClicks (event); } );
		document.getElementsByTagName ("nav")[0].addEventListener ("click", event => { handleNavClicks (event); } );
		document.getElementById ("title").addEventListener ("change", event => { handleTitleChange (event); } );
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
		//	All editable elements are readonly by default, but it makes no sense to require the user to click the
		//	"edit" button when entering a new title.  Traverse the DOM and remove the readonly attribute.  Then, hide
		//	the "edit" button.

		initGUI (newTitle());
		editMode (true);
	}
	else
	{
		mode = "UPDATE TITLE";
		initGUI (getTitleData (key));

		//	sessionStorage is no longer needed and may cause problems later if it is allowed to persist to multiple
		//	page loads.  So remove it now...

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

	return d;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for input events.  Input events are triggered when something is input into
//	an editable element, whether that is an input, textarea or a div with the contenteditable attribute.  It differs from
//	a change event in two major ways...
//		1)	The event is triggered as soon as the input occurs, where a change event is triggered when an element loses
//			focus.  Each and every keystroke will trigger an input event.
//		2)	The input event is supported on divs with the contanteditable attribute.  Change is not.

function handleInputEvents (event)
{	event.preventDefault();

	//	Something in the page has been changed...enable the reset and save buttons

	document.getElementById ("reset-page").classList.remove ("hidden");
	document.getElementById ("save-this-title").classList.remove ("hidden");
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in main

function handleMainClicks (event)
{	event.preventDefault();

	switch (event.target.getAttribute ("id"))
	{
		case "propercase":
			{
				const elem = document.getElementById ("title");
//					elem.value = elem.getAttribute ("override");
elem.value = toProperCase (elem.value);
				break;
			}
//			case "undo-propercase":
//				{
//					const elem = document.getElementById ("title");
//					elem.value = elem.getAttribute ("override");
//					break;
//				}
		default:
			{
//	alert ("handleMainClicks");
				break;
			}
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
		case "edit-page":
			{
				editMode (true);
				break;
			}
		case "reset-page":
			{
				resetPage();
				break;
			}
		case "save-this-title":
			{
				saveThisTitle();
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
	resetElement (document.querySelectorAll (".editable"));

	document.getElementById ("reset-page").classList.add ("hidden");
	document.getElementById ("save-this-title").classList.add ("hidden");
}

function resetElement (list, _)
{
	//	reset the values of all editable fields to whatever value they had when the page was loaded.

	for (i=0; i<list.length; i++)
	{
		//	There are editable div, input and textarea elements.  Some of the input elements may be checkboxes.  Eventually,
		//	there will be star ratings and favorites (although I don't know how I;m going to handle those just yet.  They all
		//	need to be handled a little differently. 

		if (list[i].tagName == "DIV")
		{
			list[i].innerHTML = list[i].getAttribute ("reset");
			continue;
		}
//
//	Any other "special cases" elements go here; checkboxec, radio buttons, star ratings, etc...
//
		//	And finally...the default behavior.  Assign the value of reset to the value attribute of the element

		list[i].value = list[i].getAttribute ("reset");
	}
}

function saveThisTitle ()
{
	//	Save the data to the datastore...

	//	Get everythong out of the COM and into a JSON object that can be added to the datastore.

	saveTitle (
		{
			key:		document.getElementById ("key").value,
			title:		document.getElementById ("title").value,
			release:	document.getElementById ("release").value,
			about:		document.getElementById ("about").innerHTML
		})
	.then (_ =>
		{
			//	I don;t actually care what the response is, it's enough to know that the operation was successful.
			//	But I do need to clean up after it.
			//
			//	If this was a new title, initialize the DOM for another new title.  That's as close to a batch
			//	operation as I care to make it.  If this was an update, close this window and return to the list
			//	page

			if (mode == "NEW TITLE") initializeGUI();
			else history.back();
		})
	.catch (error => { alert (error); } );
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Handle change events to input#title

function handleTitleChange (event)
{	event.preventDefault();

	//	So far the only thing I want to do here is enable a button to allow the user to format the title in 'proper'
	//	case.  This was an automatic function but required overriding for the minority of titles that should not be
	//	proper case.  It's now strictly optional.

	document.getElementById ("propercase").classList.remove ("hidden"); 
}

function toProperCase (string)
{
	//	Change the value of element to "proper" case.  For a movie title, that means all words should be capitalized
	//	except for articles ("a", "an" and "the") and prepositions ("in", "on", "with", etc.).  The first word in the
	//	title should be capitalized regardless.

	//	Although the vast majority of titles should be proper case, a small minority should not be.  Compare the
	//	value of #title to the previously entered version (ignoring case).  If they dont't match change the title to
	//	proper case.  Note that this saved attribute won't exist until this function creates it.  That means that
	//	#title will default to proper case.  If that is incorrect for this title, the user will have to change it.

	//	There are no hard and fast rules, and all style guides do not agree on all details.  In general, the first and
	//	last word in a title should always be capitalized.  Subtittles should be treated like titles,  Nouns, verbs,
	//	adjectives and averbs should always be capitalized.  All other parts of speech (articles, conjunctions,
	//	prepositionsm etc) should be in lower case.  The Chicago rule book says conjuctions and prepositions more than
	//	four letters in length should be capitalized.

	const except = [ "a", "an", "and", "at", "but", "by", "for", "from", "in", "nor", "not", "of", "on", "or", "the", "to", "with" ]

	const subtitleArray = string.trim().toLowerCase().split (":");

	subtitleArray.forEach ((a1, i) =>
		{
			//	create an array of woeds
			const wordArray = a1.trim().toLowerCase().split (" ");		
			wordArray.forEach ((a2, i) =>
				{
					if ((i == 0) || (except.indexOf (a2) == -1) || (i == (wordArray.length - 1)))
					{
						const array3 = a2.split ("");
						array3[0] = array3[0].toUpperCase();
						wordArray[i] = array3.join ("");
					}
				})

			subtitleArray[i] = wordArray.join (" ");
		})

	string = subtitleArray.join (": ").trim();

	document.getElementById ("propercase").classList.add ("hidden"); 

	return string;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Various functions used throughout the page

function editMode (_)
{
	//	Remove the "readonly" attribute from editable elements (inbox, textarea, etc) so that they can, in fact, be
	//	edited.

//	This function does not take a parameter just yet -- maybe never.  The function is set up with an argument as a
//	reminder to me, because I may want to toggle edit mode (say after saving) someday.

	toggleReadonly (document.getElementsByTagName ("input", true));
	toggleReadonly (document.getElementsByTagName ("textarea", true));

	//	There are also editable div elements (can't use textarea because I want allow some HTML tags for formatting).  They
	//	also need to become editable, but that's slightly different.

	const div = document.querySelectorAll (".editable");
	for (i=0; i<div.length; i++)
	{
		div[i].setAttribute ("contenteditable", true)
	}

	//	Put the curdor in input#title

	giveElementFocus ("title");

	//	configure nav icons

	document.getElementById ("edit-page").classList.add ("hidden");
}

function giveElementFocus (id)
{
	document.getElementById (id).focus();
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
