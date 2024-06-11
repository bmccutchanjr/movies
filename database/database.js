//	DATABASE.JS
//
//	There will not be a database during early stages of development.  Instead, the application will use a JSON
//	formatted onject written to localStorage.  This module attempts to replicate typical database operations for
//	those early development cycvles.

//	I could more accurately emulate a database if I make this a class and take advantage of encapsulation...

let data = {};
getDatastore();

function getDatastore ()
{
	//	Get the datastore from localStorage...

	const d = localStorage.getItem ("movies.datastore");

	if (d != null) data = JSON.parse (d);
	else
	{
		//	There was an error attempting to parse the data retrieved from localStorage.  That akmost certainly
		//	means there was no data stored there yet.  This is expected, and we need to make some initial data

		data.titles = [];

		saveTitle ( { "title": "District 9" } );
		saveTitle ( { "title": "The Getaway" } );
		saveTitle ( { "title": "Citizen Kane" } );
		saveTitle ( { "title": "Casablanca" } );
		saveTitle ( { "title": "Appolo 13" } );
	}
}

function saveDatastore ()
{
	//	Write the datastore to localStorage.  Always sort the datastore first...

	sortTitles();
	localStorage.setItem ("movies.datastore", JSON.stringify (data));
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//	Functins associated with retrieving and saving individual titles

function createUniqueKey ()
{
	//	Create a unique key for each element in the datastore.
	//
	//	This key is a randomly generated 10 character alphnumeric string.  10 characters is overkill, but I'm
	//	not going to verify the new key is in fact unigue and so the longer the key the less likely there will
	//	be any duplicates.

	let key = "";

	for (let i=0; i<10; i++)
	{
		const k = Math.floor (Math.random() * 62);

		if (k < 10) key += String.fromCharCode (k + 48);		//	48 is the ASCII code for '0'
		else
			if (k < 36) key += String.fromCharCode (k + 55);	//	65 is the ASCII code for 'A'
			else
				key += String.fromCharCode (k + 61);			//	97 is the ASCII code for 'a'
	} 

	return key;
}

function getListOfTitles ()
{
	return new Promise ((response, reject) =>
		{
			//	In the real world (where this application will one day live), this function would execute a
			//	database query -- and that would be an async operation.  Emulate that...

			let d = [];
			data.titles.forEach (t =>
				{
					d.push (
						{
							"key": t.key,
							"title": t.title
						})
				})

			response (d);

			//	Since there is no chance of an error occuring here, we'll just ignore reject()
		})
}

function getTitleData (key)
{
	//	Find the element in data.title[] with property key equal to the parameter passed to this function.

	return data.titles.find (t =>
	{
		return (t.key == key);
	})
}

function saveTitle (t)
{
	//	Save the title data in the datastore.

	return new Promise ((response, reject) =>
		{
			//	Okay, I know this isn;t really a database operation and not likely to fail.  But it is an
			//	asynchronous operation (I believe writing to localStorage is async) though, and writing this
			//	as a Promise helps lay the groundwork for the day it necomes a databse operation...

			if ((t.key) && (t.key != ""))
				updateTitle (t)
			else
			{
				t.key = createUniqueKey();
				data.titles.push (t);
			}
		
			saveDatastore();

			response ("OK");
		})
}

function updateTitle (t)
{
	//	Update an existing title.  I need to identify the element of data.titles[] to update...that;s the element
	//	whose property "key" matches the parameter's property "key".

	let index = undefined;

	for (let i=0; i<data.titles.length; i++)
	{
		if (data.titles[i].key == t.key)
		{
			index = i;
			break;
		}
	}

data.titles[index] = t;

	//	This function is modifying a global variable.  There's nothing to return
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//	Functins associated with sorting the datastore

function sortTitles ()
{
	data.titles.sort ((t1, t2) =>
	{
		const tA = tweakTitle (t1.title);
		const tB = tweakTitle (t2.title);

		if (tA > tB) return 1;
		if (tA < tB) return -1;

		return 0;
	})
}

function tweakTitle (t)
{
	//	Modify the title for purposes of sorting the title list.  This is a temporary value and will not be
	//	saved in the datastore.

	t = t.toUpperCase();

	//	Ignore leading articles (or anyway, "the").  This will become an optional setting eventually.  I amy
	//	also wany yo ignore "a" amd "an", but I'm not so sure.

	if (t.substring (0, t.indexOf (" ")) == "THE") t = t.substring (t.indexOf (" ") + 1); 

	return t;
}