import { API } from './config.js';
import { addLog } from './ui.js';

export async function scheduleJob() {
  const zone_id   = document.getElementById('jobZone').value;
  const type      = document.getElementById('jobType').value;
  const scheduled = document.getElementById('jobTime').value;
  const notes     = document.getElementById('jobNotes').value;

  addLog(`Scheduling job: ${type} → Zone ${zone_id}`, 'ok');

  try {
    const res = await fetch(`${API}/jobs`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ zone_id: parseInt(zone_id), type, scheduled_at: scheduled || null, notes })
    });
    if (res.ok) showScheduleMsg();
    else addLog('Job scheduling failed', 'err');
  } catch(e) {
    showScheduleMsg();
  }
}

export function showScheduleMsg() {
  const msg = document.getElementById('scheduleMsg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 3000);
}