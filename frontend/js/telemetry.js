import { moveRobotDot } from './map.js';
import { drawTelemChart } from './ui.js';

export const batteryHistory = [];

export function updateTelemetry(data) {
  document.getElementById('statBattery').textContent = `${data.battery ?? '--'}%`;
  document.getElementById('statSpeed').textContent   = `${data.speed ?? '--'} m/s`;
  document.getElementById('statLat').textContent     = data.lat?.toFixed(4) ?? '--';
  document.getElementById('statLng').textContent     = data.lng?.toFixed(4) ?? '--';
  document.getElementById('statStatus').textContent  = (data.status ?? 'IDLE').toUpperCase();
  document.getElementById('batteryFill').style.width = `${data.battery ?? 0}%`;

  batteryHistory.push(data.battery ?? 0);
  if (batteryHistory.length > 50) batteryHistory.shift();
  drawTelemChart(batteryHistory);

  if (data.lat && data.lng) moveRobotDot(data.lat, data.lng);
}