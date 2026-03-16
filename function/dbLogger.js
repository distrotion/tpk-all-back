const fs   = require('fs');
const path = require('path');

const LOG_DIR    = path.join(__dirname, '..', 'logs');
const CSV_HEADER = 'datetime,server,function,query_preview,duration_ms,rows,status,error\n';

function csvEsc(val) {
  const s = String(val ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

/**
 * บันทึก log เฉพาะ INSERT / UPDATE ลง logs/YYYY-MM-DD.csv
 */
function writeLog(server, fn, query, durationMs, rows, status, errMsg = '') {
  // log เฉพาะ INSERT และ UPDATE
  if (!/^\s*(INSERT|UPDATE)\s/i.test(query)) return;

  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

    const now      = new Date();
    const dateStr  = now.toISOString().slice(0, 10);
    const datetime = now.toISOString().replace('T', ' ').slice(0, 23);
    const filePath = path.join(LOG_DIR, `${dateStr}.csv`);

    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, CSV_HEADER, 'utf8');

    const preview = query.replace(/\s+/g, ' ').slice(0, 120);
    const line = [
      csvEsc(datetime), csvEsc(server),    csvEsc(fn),
      csvEsc(preview),  csvEsc(durationMs), csvEsc(rows ?? ''),
      csvEsc(status),   csvEsc(errMsg),
    ].join(',') + '\n';

    fs.appendFileSync(filePath, line, 'utf8');
  } catch (e) {
    console.error('dbLogger writeLog error:', e.message);
  }
}

module.exports = { writeLog };
