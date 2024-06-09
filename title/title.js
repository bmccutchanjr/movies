//	TITLE.JS
//
//	This module collects the funvtions specific to title maintenanve (title.html).

let mode = undefined;

window.addEventListener ("load", event =>
	{	event.preventDefault();

alert ("title.js");

		//	And add some event listeners

		document.getElementsByTagName ("nav")[0].addEventListener ("click", event => { handleNavClicks (event); } );
	})


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