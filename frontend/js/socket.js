import { API } from './config.js';
import { updateTelemetry } from './telemetry.js';
import { renderCameraFrame } from './camera.js';
import { addLog } from './ui.js';

export let socket = null;

export function connectSocket() {
  try {
    socket = io(API, { transports: ['websocket'], reconnectionDelay: 3000 });

    socket.on('connect', () => {
      document.getElementById('connDot').classList.add('live');
      document.getElementById('connLabel').textContent = 'LIVE';
      addLog('WebSocket connected', 'ok');
    });

    socket.on('disconnect', () => {
      document.getElementById('connDot').classList.remove('live');
      document.getElementById('connLabel').textContent = 'DISCONNECTED';
      addLog('WebSocket disconnected', 'warn');
    });

    socket.on('telemetry', (data) => updateTelemetry(data));

    socket.on('robot:status', (data) => addLog(`Robot status: ${data.status}`, 'info'));

    socket.on('camera:frame', (data) => renderCameraFrame(data.frame));

  } catch(e) {
    addLog('Could not connect to API (demo mode active)', 'warn');
  }
}