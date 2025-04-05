document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const xmlText = e.target.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const output = [];

    // Preset properties
    const presetName = xmlDoc.querySelector('name')?.textContent || '';
    const description = xmlDoc.querySelector('description')?.textContent || '';
    const version = xmlDoc.querySelector('preset')?.getAttribute('version') || '';

    output.push(`--> Dante Controller Preset Properties <--`);
    output.push(`@version : ${version}`);
    output.push(`name     : ${presetName}`);
    output.push(`description : ${description}`);
    output.push('');

    // Device attributes
    const device = xmlDoc.querySelector('device');
    if (device) {
      output.push(`--> Device ATTRIBUTES <--`);
      output.push(`name             : ${device.querySelector('name')?.textContent}`);
      output.push(`manufacturer     : ${device.querySelector('manufacturer_name')?.textContent}`);
      output.push(`model            : ${device.querySelector('model_name')?.textContent}`);
      output.push(`model_version    : ${device.querySelector('model_version')?.textContent}`);
      output.push(`device_type_str  : ${device.querySelector('device_type_string')?.textContent}`);
      output.push(`samplerate       : ${device.querySelector('samplerate')?.textContent}`);
      output.push(`encoding         : ${device.querySelector('encoding')?.textContent}`);
      output.push(`unicast_latency  : ${device.querySelector('unicast_latency')?.textContent}`);
      output.push('');
    }

    // Rx Channels
    const rxChannels = xmlDoc.querySelectorAll('rxchannel');
    output.push(`--> Device RxChannels <--`);
    output.push('| danteId | mediaType | name | subscribed_channel | subscribed_device |');
    output.push('|---------|------------|------|---------------------|--------------------|');

    rxChannels.forEach(rx => {
      const id = rx.getAttribute('danteId') || '';
      const mediaType = rx.getAttribute('mediaType') || '';
      const name = rx.querySelector('name')?.textContent || '';
      const channel = rx.querySelector('subscribed_channel')?.textContent || '';
      const device = rx.querySelector('subscribed_device')?.textContent || '';
      output.push(`| ${id.padEnd(7)} | ${mediaType.padEnd(10)} | ${name.padEnd(4)} | ${channel.padEnd(19)} | ${device.padEnd(18)} |`);
    });

    // Tx Channels
    const txChannels = xmlDoc.querySelectorAll('txchannel');
    output.push('');
    output.push(`--> Device TxChannels <--`);
    if (txChannels.length === 0) {
      output.push(`!!! There's no tx channels !!!`);
    } else {
      output.push('| danteId | name |');
      output.push('|---------|------|');
      txChannels.forEach(tx => {
        const id = tx.getAttribute('danteId') || '';
        const name = tx.querySelector('name')?.textContent || '';
        output.push(`| ${id.padEnd(7)} | ${name.padEnd(4)} |`);
      });
    }

    // Display the result
    document.getElementById('output').textContent = output.join('\n');

    // Enable and show the download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'inline-block';
    
    // Set up the click event to download the content as a .txt file
    downloadBtn.onclick = function() {
      const blob = new Blob([output.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dante-output.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  reader.readAsText(file);
});
