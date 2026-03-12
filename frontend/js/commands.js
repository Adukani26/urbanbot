import { API } from './config.js';
import { socket } from './socket.js';
import { addLog } from './ui.js';

export async function sendCommand(action) {
  addLog(`Command sent: ${action.toUpperCase()}`, 'ok');
  if (socket && socket.connected) {
    socket.emit('command', { action, timestamp: new Date().toISOString() });
    return;
  }
  try {
    await fetch(`${API}/robot/command`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action })
    });
  } catch(e) {
    addLog('API unreachable (demo mode)', 'warn');
  }
}

export async function emergencyStop() {
  document.getElementById('statStatus').textContent   = 'E-STOP';
  document.getElementById('statStatus').style.color   = 'var(--danger)';
  addLog('⚠ EMERGENCY STOP TRIGGERED', 'err');
  if (socket && socket.connected) {
    socket.emit('command', { action: 'EMERGENCY_STOP' });
  }
  try {
    await fetch(`${API}/robot/emergency-stop`, { method: 'POST' });
  } catch(e) {}
}