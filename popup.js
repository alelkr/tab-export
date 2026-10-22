const status = document.getElementById("status");

async function getTabs(currentWindowOnly) {
  const query = currentWindowOnly ? { currentWindow: true } : {};
  return chrome.tabs.query(query);
}

async function copyMarkdown(currentWindowOnly) {
  const tabs = await getTabs(currentWindowOnly);
  const text = tabs.map(t => `- [${t.title}](${t.url})`).join("\n");
  await navigator.clipboard.writeText(text);
  status.textContent = `${tabs.length} Tabs kopiert.`;
}

async function downloadCsv(currentWindowOnly) {
  const tabs = await getTabs(currentWindowOnly);
  const esc = s => `"${(s || "").replace(/"/g, '""')}"`;
  const csv = "title,url,window\n" +
    tabs.map(t => `${esc(t.title)},${esc(t.url)},${esc(String(t.windowId))}`).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `tabs_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  status.textContent = `${tabs.length} Tabs exportiert.`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function importCsvAndOpen(file) {
  const text = await file.text();
  const rows = parseCsv(text).filter(r => r.length > 1 || (r[0] && r[0].length));
  if (rows.length === 0) {
    status.textContent = "CSV ist leer oder ungültig.";
    return;
  }

  const looksLikeHeader = /^title$/i.test((rows[0][0] || "").trim());
  const dataRows = looksLikeHeader ? rows.slice(1) : rows;

  // Gruppiert Tabs nach der "window"-Spalte, falls vorhanden, damit beim
  // Wiederherstellen mehrere Fenster statt eines einzigen entstehen.
  const groups = new Map();
  for (const r of dataRows) {
    const url = (r[1] || "").trim();
    if (!/^https?:\/\//i.test(url)) continue;
    const key = r[2] && r[2].trim() ? r[2].trim() : "_default";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(url);
  }

  if (groups.size === 0) {
    status.textContent = "Keine gültigen URLs in der CSV gefunden.";
    return;
  }

  let totalTabs = 0;
  for (const urls of groups.values()) {
    await chrome.windows.create({ url: urls });
    totalTabs += urls.length;
  }
  status.textContent = `${totalTabs} Tabs in ${groups.size} Fenster wiederhergestellt.`;
}

document.getElementById("all").onclick = () => copyMarkdown(false);
document.getElementById("current").onclick = () => copyMarkdown(true);
document.getElementById("csv").onclick = () => downloadCsv(false);
document.getElementById("csvCurrent").onclick = () => downloadCsv(true);

const importInput = document.getElementById("importCsv");
document.getElementById("importCsvBtn").onclick = () => importInput.click();
importInput.onchange = () => {
  const file = importInput.files[0];
  if (!file) return;
  importCsvAndOpen(file).catch(err => {
    status.textContent = `Fehler beim Import: ${err.message}`;
  });
  importInput.value = "";
};