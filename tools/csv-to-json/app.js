// CSV to JSON Converter - PoGO Tools
// Converts Poke Genie and Calcy IV CSV exports to JSON format
// Uses shared pokemon-parser.js for format detection and normalization

(function() {
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const outputEl = document.getElementById('output');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyBtn = document.getElementById('copyBtn');

  let currentFilename = '';
  let currentJson = null;

  fileInput.addEventListener('change', handleFileSelect);
  downloadBtn.addEventListener('click', handleDownload);
  copyBtn.addEventListener('click', handleCopy);

  // Format display names
  const FORMAT_NAMES = {
    'pokegenie': 'Poke Genie',
    'calcyiv': 'Calcy IV',
    'unknown': 'Unknown'
  };

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFilename = file.name;
    setStatus('Parsing...', '');

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const csvText = e.target.result;
        const result = PogoParser.parseCollection(csvText, currentFilename);

        // Check for critical errors
        if (result.format === 'unknown') {
          throw new Error(result.errors.join('\n'));
        }

        // Build output object
        currentJson = {
          meta: {
            source: 'PoGO Tools CSV to JSON Converter',
            filename: currentFilename,
            exportedAt: new Date().toISOString(),
            detectedFormat: result.format,
            rowCount: result.pokemon.length,
            warnings: result.warnings.length > 0 ? result.warnings : undefined,
            errors: result.errors.length > 0 ? result.errors : undefined
          },
          pokemon: result.pokemon
        };

        const jsonString = JSON.stringify(currentJson, null, 2);
        outputEl.value = jsonString;

        // Build status message
        const formatName = FORMAT_NAMES[result.format];
        let statusMessage = `Detected format: ${formatName} | Loaded ${result.pokemon.length} rows`;

        if (result.warnings.length > 0) {
          statusMessage += ` | ${result.warnings.length} warning(s)`;
        }
        if (result.errors.length > 0) {
          statusMessage += ` | ${result.errors.length} error(s)`;
        }

        setStatus(statusMessage, 'success');
        downloadBtn.disabled = false;
        copyBtn.disabled = false;
      } catch (err) {
        setStatus(`Error: ${err.message}`, 'error');
        outputEl.value = '';
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
      }
    };
    reader.onerror = function() {
      setStatus('Error reading file', 'error');
    };
    reader.readAsText(file);
  }

  function handleDownload() {
    if (!currentJson) return;

    const jsonString = JSON.stringify(currentJson, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Replace .csv extension with .json
    const jsonFilename = currentFilename.replace(/\.csv$/i, '.json');

    const a = document.createElement('a');
    a.href = url;
    a.download = jsonFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    if (!outputEl.value) return;

    navigator.clipboard.writeText(outputEl.value).then(function() {
      const originalText = statusEl.textContent;
      const originalClass = statusEl.className;
      setStatus('Copied!', 'success');

      // Restore original status after 1.5 seconds
      setTimeout(function() {
        statusEl.textContent = originalText;
        statusEl.className = originalClass;
      }, 1500);
    }).catch(function(err) {
      setStatus('Failed to copy to clipboard', 'error');
    });
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status' + (type ? ' ' + type : '');
  }
})();
