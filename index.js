//	INDEX.JS
//
//	This module is primarilly used to manipulate DOM elements associated with the list of titles and nav functions
//	associated with the list.

window.addEventListener ("load", event =>
	{	event.preventDefault();

		loadTitles();

		//	And add some event listeners

		document.getElementsByTagName ("nav")[0].addEventListener ("click", event => { handleNavClicks (event); } );
	})

function loadTitles ()
{
	const list = document.createElement ("div");
	list.setAttribute ("id", "title-list");

	getListOfTitles ()
	.then (data =>
		{
			data.forEach ((d, i) =>
			{
				const wrapper = document.createElement ("div");
				wrapper.classList.add ("title-wrapper");
				wrapper.setAttribute ("key", d.key);

				let e = document.createElement ("input");

				e = document.createElement ("input");
				e.setAttribute ("id", "watch");
				e.setAttribute ("title", "Place " + d.title + " on the 'watch list'");
				e.setAttribute ("type", "checkbox");
				wrapper.append (e);

				e = document.createElement ("input");
				e.setAttribute ("id", "seen");
				e.setAttribute ("title", "Have seen " + d.title);
				e.setAttribute ("type", "checkbox");
				wrapper.append (e);

				e = document.createElement ("a");				//	Semantically, this element should be a link
				e.classList.add ("title");
				e.innerText = d.title;
				e.setAttribute ("id", "title");
				e.setAttribute ("title", "Click here to see more detailed information");
				wrapper.append (e);

				e = document.createElement ("button");
				e.classList.add ("delete");
				e.setAttribute ("id", "delete");
				e.setAttribute ("title", "Delete " + d.title + " from the database");
				wrapper.append (e);

				list.append (wrapper);
			})
		})
	.catch (error =>
		{
			//	This shouldn't happen...
			alert (error);
		})

	//	...and put the list into the DOM

	const main = document.getElementsByTagName ("main")[0];
	main.removeChild (main.firstChild);							//	First, remove anything already displayed in the list
	main.append (list);											//	and append #title-list

	//	JavaScript will remove this event listener when the #title-list element is removed from the DOM.  It's needed,
	//	so it has to be added again.

	document.getElementById ("title-list").addEventListener ("click", event => { handleListClicks (event); } );
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the list of titles

function handleListClicks (event)
{	event.preventDefault();

	switch (event.target.getAttribute ("id"))
	{
		case "delete":
			{
				const element = getAncestorByAttribute (event.target, "key");
				deleteTitle (element.getAttribute ("key"));
				//	If I reload the data, I's be 100% absolutely without-a-doubt guaranteed that the what is on screen os exactly
				//	what is in the datastore...but as long as there isn't an error simply removing the deleted element from the
				//	DOM will do the trick
				document.getElementById ("title-list").removeChild	(element);
				break;
			}
		case "title":
			{
				sessionStorage.setItem ("movie.key", getAncestorAttribute (event.target, "key"));
				window.open ("title/title.html", "_self");
				break;
			}
		case "seen":
			{
				alert ("seen it");
				break;
			}
		case "watch":
			{
				alert ("watch this");
				break;
			}
		default:
			{
				alert ("handleListClicks ()");
				break;
			}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the nav

function handleNavClicks (event)
{	event.preventDefault();
//		let target = event.target;

	//	The id for each icon is actually in the button element and there's a very good chance that that won't be the element
	//	identified in event.target.  If not, traverse event.target's ancestors until one of them has an id attribute.

	switch (getAncestorAttribute (event.target, "id"))
	{
		case "add-a-title":
			{
				window.open ("title/title.html", "_self");
				break;
			}
		default:
			{
				alert ("handleNavClicks ()");
				break;
			}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	various utility functions used throughout this module

function getAncestorAttribute (element, attribute)
{
	//	Begining with "element", traverse the DOM to find the first ancestor element (parent, grandparent, etc) with the
	//	specified attribute.  Return the value of the attribute.

	//	Many of the clickable elements on this page are wrapped in container elemets where the container has an attribute
	//	I need.  For instance, the clickboxes and delete buttons in the list of titles do not have an attribute of "key".
	//	But I need "key" to identify the correct entry in the datastore.  That attribute belongs to the container div whicg
	//	is the parent of the checkbox or button.  There's a similar issue with nav buttons.

	return getAncestorByAttribute (element, attribute).getAttribute (attribute);
}

function getAncestorByAttribute (element, attribute)
{
	//	Begining with "element", traverse the DOM to find the first ancestor element (parent, grandparent, etc) with the
	//	specified attribute.  Return the value of the attribute.

	//	Many of the clickable elements on this page are wrapped in container elemets where the container has an attribute
	//	I need.  For instance, the clickboxes and delete buttons in the list of titles do not have an attribute of "key".
	//	But I need "key" to identify the correct entry in the datastore.  That attribute belongs to the container div whicg
	//	is the parent of the checkbox or button.  There's a similar issue with nav buttons.

	while (element.getAttribute (attribute) == undefined)
	{
		element = element.parentElement;
	}

	return element;
}