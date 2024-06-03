document.addEventListener('DOMContentLoaded', function() {
	fetch('data.csv')
	/*	CSV should look like this:
		GameName,GameID,p1Owned,p2Owned,finished
		Game 1,123456,true,true,true
		Game 2,456789,true,false,false
		Game 3,789123,false,false,false	*/
	.then(response => response.text())
	.then(csvData => {
		console.log("CSV file fetched successfully:", csvData);
		const parsedData = parseCSV(csvData);
		console.log("Parsed CSV data:", parsedData);
		generateTables(parsedData);
	})
	.catch(error => {
		console.error('Error fetching the CSV file:', error);
		document.getElementById('loading').textContent = 'Failed to load data.';
	});

	// Parse CSV data using PapaParse
	function parseCSV(csv) {
		try {
			const result = Papa.parse(csv, {
				header: true,
				skipEmptyLines: true
			});
			if (result.errors.length) {
				console.error('Errors parsing CSV:', result.errors);
				return [];
			}
			return result.data;
		} catch (error) {
			console.error('Error parsing CSV:', error);
			return [];
		}
	}

	// Generate HTML content for tables
	function generateTables(data) {
		const unfinishedTable = document.getElementById('unfinished');
		const finishedTable = document.getElementById('finished');
		const unfinishedContent = unfinishedTable.querySelector('tbody');
		const finishedContent = finishedTable.querySelector('tbody');

		unfinishedContent.innerHTML = ''; // Clear previous content
		finishedContent.innerHTML = ''; // Clear previous content

		// Sort data by GameName
		data.sort((a, b) => a.GameName.localeCompare(b.GameName));

		let unfinishedRows = '';
		let finishedRows = '';

		// Iterate over data to create table rows
		data.forEach(function(item) {
			const p1Owned = `<span class="owned">${item.p1Owned === 'true' ? '✔️' : '⭕'}</span>`;
			const p2Owned = `<span class="owned">${item.p2Owned === 'true' ? '✔️' : '⭕'}</span>`;
			const iframeId = `iframe-${item.GameID}`;
			const rowHTML = `<tr>
				<td>
					<div id="${iframeId}-loader" class="iframe-loader"></div>
					<iframe id="${iframeId}" src="https://store.steampowered.com/widget/${item.GameID}/" frameborder="0" width="650" height="190" title="${item.GameName}" style="display:none;" onload="document.getElementById('${iframeId}-loader').style.display='none'; this.style.display='block';"></iframe>
					<span style="display:none;">${item.GameName}</span>
				</td>
				<td>${p1Owned}</td>
				<td>${p2Owned}</td>
			</tr>`;

			if (item.finished === 'true') {
				finishedRows += rowHTML;
			} else {
				unfinishedRows += rowHTML;
			}
		});

		// Append rows to table bodies
		unfinishedContent.innerHTML = unfinishedRows;
		finishedContent.innerHTML = finishedRows;

		// Initialize Tablesort for both tables
		new Tablesort(unfinishedTable);
		new Tablesort(finishedTable);
	}
});
