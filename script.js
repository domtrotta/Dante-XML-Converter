let parsedData = null;

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const xmlText = e.target.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    parsedData = xmlDoc;

    console.log("XML loaded");
    document.getElementById('generateBtn').style.display = 'inline-block';
  };

  reader.readAsText(file);
});

document.getElementById('generateBtn').addEventListener('click', function() {
  console.log("Button clicked");
  if (!parsedData) return;

  const xmlDoc = parsedData;
  const device = xmlDoc.querySelector('device');
  const rxDeviceName = device?.querySelector('name')?.textContent || '(unknown)';
  const rxChannels = xmlDoc.querySelectorAll('rxchannel');

  // 1. Build TX headers
  const txSet = new Set();
  rxChannels.forEach(rx => {
    const txDevice = rx.querySelector('subscribed_device')?.textContent || '';
    const txChannel = rx.querySelector('subscribed_channel')?.textContent || '';
    if (txDevice && txChannel) {
      txSet.add(`${txDevice}/${txChannel}`);
    }
  });
  const txHeaders = Array.from(txSet).sort();

  // 2. Build header rows
  const row1 = ['','', ...Array(txHeaders.length).fill('TX')];
  const row2 = ['Rx Device', 'Rx Channel'];
  const row3 = ['',''];
  const merges = [];

  let currentDev = '';
  let devStartCol = 2;

  txHeaders.forEach((entry, i) => {
    const [dev, ch] = entry.split('/');
    row2.push(dev);
    row3.push(ch);

    if (dev !== currentDev) {
      if (currentDev !== '') {
        const end = i + 1;
        merges.push({ s: { r: 1, c: devStartCol }, e: { r: 1, c: end } });
        devStartCol = end + 1;
      }
      currentDev = dev;
    }
  });
  if (currentDev && devStartCol <= txHeaders.length + 1) {
    merges.push({ s: { r: 1, c: devStartCol }, e: { r: 1, c: txHeaders.length + 1 } });
  }

  const matrixRows = [row1, row2, row3];

  // 3. Fill data rows
  rxChannels.forEach(rx => {
    const rxName = rx.querySelector('name')?.textContent || '';
    const txDevice = rx.querySelector('subscribed_device')?.textContent || '';
    const txChannel = rx.querySelector('subscribed_channel')?.textContent || '';
    const match = `${txDevice}/${txChannel}`;
    const row = [rxDeviceName, rxName];

    txHeaders.forEach(header => {
      row.push(header === match ? '●' : '');
    });

    matrixRows.push(row);
  });

  // 4. Write to sheet
  const ws = XLSX.utils.aoa_to_sheet(matrixRows);
  ws['!merges'] = merges;

  const boldCenter = {
    font: { bold: true },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'DDDDDD' } }
  };
  const centerDot = {
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  for (let R = 0; R < matrixRows.length; R++) {
    for (let C = 0; C < matrixRows[R].length; C++) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      if (!cell) continue;

      if (R < 3 || C < 2) {
        cell.s = boldCenter;
      } else if (matrixRows[R][C] === '●') {
        cell.s = centerDot;
      }
    }
  }

  // 5. Force all columns to ~19 pixels wide (wch ~2.5)
  ws['!cols'] = matrixRows[0].map(() => ({ wch: 2.5 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Routing Matrix');
  XLSX.writeFile(wb, 'dante-matrix.xlsx');
});
