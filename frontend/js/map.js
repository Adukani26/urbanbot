import { KONZA_BOUNDS, DEMO } from './config.js';
import { updateTelemetry } from './telemetry.js';
import { addLog } from './ui.js';
import { renderDemoCamera } from './camera.js';

let demoBattery = DEMO.initialBattery;
let demoLat     = DEMO.initialLat;
let demoLng     = DEMO.initialLng;

export function moveRobotDot(lat, lng) {
  const { latMin, latMax, lngMin, lngMax } = KONZA_BOUNDS;
  const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
  const y = ((lat - latMin) / (latMax - latMin)) * 100;

  const dot = document.getElementById('robotDot');
  dot.style.left = `${Math.max(2, Math.min(95, x))}%`;
  dot.style.top  = `${Math.max(2, Math.min(95, y))}%`;
}

export function runDemo() {
  demoBattery = Math.max(10, demoBattery - Math.random() * 0.3);
  demoLat    += (Math.random() - 0.5) * 0.0003;
  demoLng    += (Math.random() - 0.5) * 0.0003;

  updateTelemetry({
    battery: Math.round(demoBattery),
    speed:   (Math.random() * 1.2).toFixed(1),
    lat:     demoLat,
    lng:     demoLng,
    status:  'patrolling'
  });

  addLog(`Telemetry · bat:${Math.round(demoBattery)}% · spd:${(Math.random()*1.2).toFixed(1)}m/s`, 'info');
  renderDemoCamera();
}

export function initZoneHighlight() {
  const zoneMap = { A: 'za', B: 'zb', C: 'zc', D: 'zd' };

  document.querySelectorAll('.zone-item').forEach(item => {
    item.addEventListener('click', () => {
      const zoneId = item.dataset.zone;

      // Sidebar active state
      document.querySelectorAll('.zone-item').forEach(z => z.classList.remove('active'));
      item.classList.add('active');

      // Map zone highlight
      document.querySelectorAll('.map-zone').forEach(z => {
        z.classList.remove('focused', 'dimmed');
        z.classList.add('dimmed');
      });

      const target = document.querySelector(`.${zoneMap[zoneId]}`);
      if (target) {
        target.classList.remove('dimmed');
        target.classList.add('focused');
      }
    });
  });

  // Set Zone A as default focused on load
  document.querySelector('.za')?.classList.add('focused');
  document.querySelectorAll('.map-zone:not(.za)').forEach(z => z.classList.add('dimmed'));
}