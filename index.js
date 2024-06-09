//	INDEX.JX
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

				let e = document.createElement ("input");

				e = document.createElement ("input");
				e.setAttribute ("title", "Place " + d.title + " on the 'watch list'");
				e.setAttribute ("type", "checkbox");
				wrapper.append (e);

				e = document.createElement ("input");
				e.setAttribute ("title", "Have seen " + d.title);
				e.setAttribute ("type", "checkbox");
				wrapper.append (e);

				e = document.createElement ("a");				//	Semantically, this element should be a link
				e.classList.add ("title");
				e.innerText = d.title;
				e.setAttribute ("title", "Click here to see more detailed information");
				wrapper.append (e);

				e = document.createElement ("button");
				e.classList.add ("delete");
//					e.innerText = "X";
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

	//	...put the list in the DOM

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

alert ("handleListClicks ()");
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	The event handler and associated functions for click events in the nav

function handleNavClicks (event)
{	event.preventDefault();

alert ("handleNavClicks ()");
}