document.addEventListener('DOMContentLoaded', () => {
	const colorTable = document.getElementById('color-table');
	const colorTableBody = colorTable.getElementsByTagName('tbody')[0];
	const searchInput = document.getElementById('search-input');

	// Step 1: Generiere eine colors.JSON Datei mit 10 Beispieldaten
	const colors = [
		{ Farbname: 'Rot', 'Hex-Code': '#FF0000' },
		{ Farbname: 'Grün', 'Hex-Code': '#00FF00' },
		{ Farbname: 'Blau', 'Hex-Code': '#0000FF' },
		{ Farbname: 'Gelb', 'Hex-Code': '#FFFF00' },
		{ Farbname: 'Orange', 'Hex-Code': '#FFA500' },
		{ Farbname: 'Violett', 'Hex-Code': '#EE82EE' },
		{ Farbname: 'Schwarz', 'Hex-Code': '#000000' },
		{ Farbname: 'Weiß', 'Hex-Code': '#FFFFFF' },
		{ Farbname: 'Grau', 'Hex-Code': '#808080' },
		{ Farbname: 'Braun', 'Hex-Code': '#A52A2A' },
	];

	// Step 2: Fülle die Tabelle dynamisch aus der JSON-Datei colors.json
	function fillTable(data) {
		colorTableBody.innerHTML = '';
		data.forEach((color) => {
			const row = document.createElement('tr');
			row.innerHTML = `
                <td>${color['Farbname']}</td>
                <td>
                    <div class="fa-button">
                        <i class="far fa-copy"></i>
                        ${color['Hex-Code']}
                    </div>
                </td>
            `;
			colorTableBody.appendChild(row);
		});
	}

	fillTable(colors);

	// Step 5: Funktion zum Kopieren des Hex-Codes bei Klick auf den Font Awesome Button
	colorTable.addEventListener('click', (event) => {
		const target = event.target;
		if (target.classList.contains('fa-copy')) {
			const hexCode = target.parentNode.textContent.trim();
			copyToClipboard(hexCode);
			showCopiedMessage(target.parentNode);
		}
	});

	// Funktion zum Kopieren des Textes in die Zwischenablage
	function copyToClipboard(text) {
		const element = document.createElement('textarea');
		element.value = text;
		element.setAttribute('readonly', '');
		element.style.position = 'absolute';
		element.style.left = '-9999px';
		document.body.appendChild(element);
		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
	}

	// Funktion zur Anzeige der Kopiert-Nachricht
	function showCopiedMessage(element) {
		const message = document.createElement('span');
		message.classList.add('copied-message');
		message.textContent = 'Kopiert!';
		element.appendChild(message);
		message.classList.add('fade-in');
		setTimeout(() => {
			message.classList.remove('fade-in');
			message.classList.add('fade-out');
			setTimeout(() => {
				element.removeChild(message);
			}, 1000);
		}, 1500);
	}

	// Step 9: Anzeige des aktuellen Hex-Codes beim Hovern über den Tablerows
	colorTable.addEventListener('mouseover', (event) => {
		const target = event.target;
		if (target.nodeName === 'TD') {
			const row = target.parentNode;
			const hexCode = target.textContent.trim();
			row.style.backgroundColor = hexCode;
			if (isDarkColor(hexCode)) {
				invertFontColor(row);
			}
		}
	});

	colorTable.addEventListener('mouseout', (event) => {
		const target = event.target;
		if (target.nodeName === 'TD') {
			const row = target.parentNode;
			row.style.backgroundColor = '';
			invertFontColor(row, true);
		}
	});

	// Funktion zur Überprüfung, ob eine Farbe dunkel ist
	function isDarkColor(color) {
		const hex = color.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness < 128;
	}

	// Funktion zum Invertieren der Schriftfarbe
	function invertFontColor(element, reset = false) {
		const tds = element.getElementsByTagName('td');
		for (let i = 0; i < tds.length; i++) {
			const td = tds[i];
			if (reset) {
				td.style.color = ''; // Zurücksetzen der Schriftfarbe auf die Standardfarbe
			} else {
				const currentColor = getComputedStyle(td).color;
				const rgb = currentColor.match(/\d+/g);
				const invertedColor = `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${
					255 - rgb[2]
				})`;
				td.style.color = invertedColor;
			}
		}
	}

	// Step 10: Filtere die Tabelle nach Farben
	searchInput.addEventListener('input', (event) => {
		const searchTerm = event.target.value.toLowerCase();
		const filteredColors = colors.filter((color) =>
			color['Farbname'].toLowerCase().includes(searchTerm)
		);
		fillTable(filteredColors);
	});
});
