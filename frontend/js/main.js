import { connectSocket } from './socket.js';
import { runDemo } from './map.js';
import { batteryHistory } from './telemetry.js';
import { drawTelemChart, updateClock, initZoneSelection } from './ui.js';
import { sendCommand, emergencyStop } from './commands.js';
import { scheduleJob } from './jobs.js';

// Expose to HTML onclick handlers
window.sendCommand   = sendCommand;
window.emergencyStop = emergencyStop;
window.scheduleJob   = scheduleJob;
window.switchTab     = (name, el) => {
  import('./ui.js').then(({ switchTab }) => switchTab(name, el));
};

// Clock
setInterval(updateClock, 1000);
updateClock();

// Zone selection
initZoneSelection();

// Boot
setTimeout(() => {
  connectSocket();
  setInterval(runDemo, 2500);
  setInterval(() => drawTelemChart(batteryHistory), 2000);
}, 500);