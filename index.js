//	INDEX.JX
//
//	This module is primarilly used to manipulate DOM elements associated with the list of titles and nav functions
//	associated with the list.

window.addEventListener ("load", event =>
	{	event.preventDefault();

		loadTitles();

		//	And add some event listeners

		document.getElementsByTagName ("nav")[0].addEventListener ("click", event => { handleNavClicks (event); } );
//			document.getElementById ("title-list").addEventListener ("click", event => { handleListClicks (event); } );
	})

function loadTitles ()
{
	const wrapper = document.createElement ("div");

	getListOfTitles ()
	.then (data =>
		{

		})
	.catch (error =>
		{

		})

	//	...add it to the DOM

	const main = document.getElementsByTagName ("main")[0];
	main.removeChild (main.firstChild);
	main.append (wrapper);

	//	JavaScript will remove this event listener when the #title-list element is removed from the DOM.  It;s needed,
	//	it has to be added again.

//		document.getElementById ("title-list").addEventListener ("click", event => handleListClicks () );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the list of titles


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the nav

function handleNavClicks (event)
{	event.preventDefault();

alert ("handleNavClicks ()");
}