<h1>Pok&eacute;dex</h1>
<p>This is an attempt to recreate Ash's Pok&eacute;dex from Season 1 of the Pok&eacute;mon anime series. As the Pok&eacute;dex (pictured below) from the anime didn't provide detailed instructions, most of the functionality is just based off of things I would like to see.</p>
<img src="/src/assets/images/ash-pokedex-anime.png" style="width: 100%;" />
<p>All Pok&eacute;mon up to and including Generation 7 are included. There are some limitations based on the availability and format of data from Pok&eacute;API. As of the release of v1.0.6, Generation 8 is not included and therefore the max Pok&eacute;dex number is set to 807.</p>
<h2>Instructions</h2>
<img src="/src/assets/images/annotated-pokedex.jpg" style="width: 100%;" />
<ol>
	<li>Toggle the walkthrough at any time using this button</li>
	<li>Go to the previous Pok&eacute;mon (if applicable)</li>
	<li>Go to the next Pok&eacute;mon (if applicable)</li>
	<li>Go to the previous sprite (if applicable)</li>
	<li>Go to the next sprite (if applicable)</li>
	<li>Play the Pok&eacute;mon's cry</li>
	<li>Go to the first sprite</li>
	<li>Go to the last sprite</li>
	<li>Search for a Pok&eacute;mon using their name or Pok&eacute;dex number</li>
	<li>Use the D-pad as an alternative to the arrows on the left display</li>
	<li>Show flavour text (description)</li>
	<li>Show statistics</li>
	<li>Show height and weight</li>
	<li>Show type effectiveness when being attacked</li>
	<li>Show abilities</li>
	<li>Show wild encounter locations</li>
	<li>Show evolution chain</li>
	<li>Show moves</li>
	<li>Show varieties (including mega evolutions)</li>
	<li>Show egg groups</li>
	<li>Scroll the right display up</li>
	<li>Scroll the right display down</li>
	<li>Scroll to the top of the right display</li>
	<li>Scroll to the bottom of the right display</li>
	<li>Go to a random Pok&eacute;mon</li>
</ol>
<h2>Potential Improvements</h2>
<ul>
	<li>Investigate evolution detail requests. Can't process more than one in chain due to overlapping requests.</li>
	<li>Investigate encounter requests. Can't process more than one at once due to overlapping location requests.</li>
	<li>Add ability to change language. Some of this work has been done but translations sometimes not available from API.</li>
	<li>Tidy up processing of encounter and move data. Lots of duplicate code here that probably isn't required.</li>
	<li>Refactor right display component. Currently passing arrays of data to SecondaryDisplay component.</li>
</ul>
<h2>Changelog</h2>
<p>
	<b>v1.0.5</b><br />
	<ul>
		<li>Upversion IndexedDB to make sure settings object store is created for existing users.</li>
	</ul>
</p>
<p>
	<b>v1.0.4</b><br />
	<ul>
		<li>Decrease size of walkthrough buttons on mobile.</li>
		<li>Slight adjustments to diagonal lines.</li>
		<li>Fixed width of screens so they don't adjust width when loading.</li>
	</ul>
</p>
<p>
	<b>v1.0.3</b><br />
	<ul>
		<li>Created some new components to house some of the code from the render method.</li>
		<li>Added fade in effect for sprites.</li>
		<li>Added functions for slim buttons and extra walkthrough steps.</li>
		<li>Added retry mechanism when we get version error on database start.</li>
	</ul>
</p>
<p>
	<b>v1.0.2</b><br />
	<ul>
		<li>Add background image.</li>
		<li>Add walkthrough for user to see what each button does (using intro.js).</li>
		<li>Removed some redundant CSS.</li>
		<li>Changed power button to walkthrough button throughout.</li>
		<li>Added new jsonErrorReplacer function to properly serialise errors in logging.</li>
	</ul>
</p>
<p>
	<b>v1.0.1</b><br />
	<ul>
		<li>Added final 2 secondary display screens: varieties and egg groups.</li>
		<li>Make requests for evolution details for better display.</li>
		<li>Refactored majority of promisified code for robustness, efficiency and error handling.</li>
	</ul>
</p>
<p>
	<b>v0.5.2</b><br />
	<ul>
		<li>Refactored processing of evolution and encounter data to reduce delays waiting for other requests to complete.</li>
		<li>Fixed bug where LeafGreen/FireRed/HeartGold/SoulSilver weren't being recognised in switch statement which meant moves weren't being rendered.</li>
	</ul>
</p>
<p>
	<b>v0.5.1</b><br />
	<ul>
		<li>Add moves screen (8th blue grid button).</li>
		<li>Small improvements to network requests, still needs further work to reduce waiting.</li>
	</ul>
</p>
<p>
	<b>v0.4.5</b><br />
	<ul>
		<li>Fix bug when searching for a Pokemon name.</li>
		<li>We were trying to read from the DB using NaN as a key.</li>
	</ul>
</p>
<p>
	<b>v0.4.4</b><br />
	<ul>
		<li>Simplified encounter data as UI couldn't handle previous amount.</li>
		<li>Return 'No wild encounters' when appropriate.</li>
	</ul>
</p>
<p>
	<b>v0.4.2</b><br />
	<ul>
		<li>Fixes bug where Pokedex number 808 was showing on Pokemon 807 (808 is above max number in API).</li>
	</ul>
</p>
<p>
	<b>v0.4.1</b><br />
	<ul>
		<li>Now using IndexedDB to store API responses offline, should improve performance over time.</li>
		<li>Removed cache variables.</li>
		<li>If Pokemon doesn't have certain sprites, no longer displaying blank images.</li>
		<li>Added error handling for missing Pokemon cries, will correctly default to blank .ogg file now.</li>
		<li>Extracted evolution logic into separate function.</li>
	</ul>
</p>
<p>
	<b>v0.3.2</b><br />
	<ul>
		<li>Add function to validate Pokedex numbers.</li>
		<li>Mainly used for search queries but also used for previous/next buttons.</li>
	</ul>
</p>
<p>
	<b>v0.3.1</b><br />
	<ul>
		<li>First draft of search input, name search not currently working (unknown error)</li>
		<li>Added a try/catch for now to handle these errors</li>
	</ul>
</p>
<p>
	<b>v0.2.1</b><br />
	<ul>
		<li>Added missing Pikachu cry.</li>
		<li>Updated use of cache to make sure we never make exact same request to API in same session.</li>
		<li>Now have 2 caches. One to keep track of data for rendering and one to keep raw API responses.</li>
		<li>WIP evolution chain. Still need to make additional requests and checks in render for UI but data should be correct.</li>
		<li>Added some more processing of encounter data, just need to improve UI now.</li>
	</ul>
</p>
<p>
	<b>Various fixes & enhancements</b><br />
	<ul>
		<li>Added Pokemon cry files in .ogg format and added ability to play using red button on sprite container</li>
		<li>First draft of encounter display, needs layout and data changes</li>
	</ul>
</p>
<p>
	<b>Fix type effectiveness bug</b><br />
	<ul>
		<li>Incorrect inequality meant 1x weakness was being shown as weak to</li>
	</ul>
</p>
<p>
	<b>Fix unnecessary border</b><br />
	<ul>
		<li>Fix border showing even when Pokemon has no abilities affecting type effectiveness</li>
	</ul>
</p>
<p>
	<b>Improved UX & added abilities to type effectiveness</b><br />
	<ul>
		<li>Use loading wave on all screens to improve UX</li>
		<li>General improvements to structure of data, preferring arrays for rendering to objects</li>
		<li>Adding abilities to bottom of type effectiveness screen</li>
	</ul>
</p>
<p>
	<b>Fix for random Pokemon button functionality</b><br />
	<ul>
		<li>Secondary display resets back to flavour text when pressing random Pokemon button</li>
	</ul>
</p>
<p>
	<b>Update title & meta description</b><br />
</p>
<p>
	<b>Various improvements & fixes</b><br />
	<ul>
		<li>Orange button now generates random Pokedex entry</li>
		<li>Removal of capitalisation function, now rely on API entry for selected language (still defaulting to English currently)</li>
		<li>Data on types, encounters, abilities, evolutions and statistics now all brought back in API requests</li>
		<li>Implemented scrolling on secondary display using white buttons to go up or down</li>
		<li>Remove version from state, will default all flavour text to come from latest version</li>
		<li>If no data found in latest version, tries next version down etc.</li>
		<li>New secondary display to show type effectiveness, still need to implement specific messages for abilities</li>
		<li>New secondary display for abilities</li>
	</ul>
</p>
<p>
	<b>Finishing responsive design + general tidy up</b>
</p>
<p>
	<b>Responsive layout</b><br />
	<ul>
		<li>First commit towards making Pokedex responsive</li>
		<li>Further refinements required</li>
	</ul>
</p>
<p>
	<b>v0.1.0</b><br />
	Initial commit of Pokedex app
</p>
<p>
	<b>Initial commit from Create React App</b>
</p>
