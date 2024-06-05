//	DATABASE.JS
//
//	There will not be a database during early stages of development.  Instead, the application will use a JSON
//	formatted onject saved in localStorage.  This module attempts to replicate typical database operations for
//	those early development cycvles.

function openDatabase ()
{

}

function getLocalStorage ()
{
	//	Get the datastore from localStorage...

	const d = localStorage.getItem ("movies.datastore");

	try
	{
		data = JSON.parse (d);
	}
	catch (_)
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

function saveTitle (t)
{
	//	Save the data to the datastore.

	if (t.key == undefined) t.key = createUniqueKey();
	data.titles.push (t);
	setLocalStorage()
}

function setLocalStorage ()
{
	//	Write the datastore to localStorage.  Always sort the datastore first...

	sortDataTitles();
	localStorage.setItem ("movies.datastore", data);
}

function sortTitles ()
{
	data.titles.sort ((t1, t2) =>
	{
		t1 = tweakTitle (t1);
		t2 = tweakTitle (t1);

		if (t1 > t2) return 1;
		if (t1 < t2) return -1;

		return 0;
	})
}

function tweakTitle (t)
{
	//	Modify the title for purposes of sorting the title list.  This is a temporary value and will not be
	//	saved in the datastore.

	t = t.toUpperCase();
	
	 
}