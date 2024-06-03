document.addEventListener('DOMContentLoaded', function() {
	fetch('https://smasimar.github.io/coopgaming/data.csv')
	//fetch('data.csv')
	/*  CSV should look like this:
		GameName,GameID,p1Owned,p2Owned,finished
		Game 1,123456,true,true,false,true
		Game 2,456789,true,false,false,false
		Game 3,789123,false,false,true,false  */
	.then(response => response.text())
	.then(csvData => {
		console.log("CSV file fetched successfully:", csvData);
		var parsedData = parseCSV(csvData);
		console.log("Parsed CSV data:", parsedData);
		generateTables(parsedData);
	})
	.catch(error => console.error('Error fetching the CSV file:', error));

	// Parse CSV data using PapaParse
	function parseCSV(csv) {
		var result = Papa.parse(csv, {
			header: true,
			skipEmptyLines: true
		});
		return result.data;
	}

	// Generate HTML content for tables
	function generateTables(data) {
		var unfinishedContent = document.getElementById('unfinished');
		var finishedContent = document.getElementById('finished');
		unfinishedContent.innerHTML = ''; // Clear previous content
		finishedContent.innerHTML = ''; // Clear previous content

		// Create table headers
		var tableHeader = "<tr><th>Game</th><th>Masimar</th><th>McCree</th></tr>";

		// Initialize table contents with headers
		var unfinishedTableHTML = tableHeader;
		var finishedTableHTML = tableHeader;

		// Iterate over data to create table rows
		data.forEach(function(item) {
			var p1Owned = `<span class="owned">${item.p1Owned === 'true' ? '✔️' : '⭕'}</span>`;
			var p2Owned = `<span class="owned">${item.p2Owned === 'true' ? '✔️' : '⭕'}</span>`;
			var rowHTML = `<tr><td><iframe src="https://store.steampowered.com/widget/${item.GameID}/" frameborder="0" width="650" height="190" title="${item.GameName}"></iframe></td><td>${p1Owned}</td><td>${p2Owned}</td></tr>`;

			if (item.finished === 'true') {
				finishedTableHTML += rowHTML;
			} else {
				unfinishedTableHTML += rowHTML;
			}
		});

		// Append tables to content
		unfinishedContent.innerHTML = '<table border="1">' + unfinishedTableHTML + '</table>';
		finishedContent.innerHTML = '<table border="1">' + finishedTableHTML + '</table>';
	}
});
