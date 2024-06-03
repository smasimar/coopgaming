document.addEventListener('DOMContentLoaded', function() {
	fetch('data.csv')
	/*  CSV should look like this:
		GameName,GameID,p1Owned,p2Owned,finished
		Game 1,123456,true,true,false
		Game 2,456789,true,false,false
		Game 3,789123,false,false,true  */
	.then(response => response.text())
	.then(csvData => {
		console.log("CSV file fetched successfully:", csvData);
		var parsedData = parseCSV(csvData);
		console.log("Parsed CSV data:", parsedData);

		// Sort data by GameName
		parsedData.sort((a, b) => a.GameName.localeCompare(b.GameName));

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
		var unfinishedContent = document.getElementById('unfinished').querySelector('tbody');
		var finishedContent = document.getElementById('finished').querySelector('tbody');
		unfinishedContent.innerHTML = ''; // Clear previous content
		finishedContent.innerHTML = ''; // Clear previous content

		// Iterate over data to create table rows
		data.forEach(function(item) {
			var p1Owned = `<span class="owned">${item.p1Owned === 'true' ? '✔️' : '⭕'}</span>`;
			var p2Owned = `<span class="owned">${item.p2Owned === 'true' ? '✔️' : '⭕'}</span>`;
			var rowHTML = `<tr><td><iframe src="https://store.steampowered.com/widget/${item.GameID}/" frameborder="0" width="650" height="190" title="${item.GameName}"></iframe></td><td>${p1Owned}</td><td>${p2Owned}</td></tr>`;

			if (item.finished === 'true') {
				finishedContent.innerHTML += rowHTML;
			} else {
				unfinishedContent.innerHTML += rowHTML;
			}
		});

		// Initialize Tablesort for both tables
		new Tablesort(document.querySelector('#unfinished'));
		new Tablesort(document.querySelector('#finished'));
	}
});
