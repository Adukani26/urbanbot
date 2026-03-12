export function updateClock() {
  document.getElementById('clock').textContent =
    new Date().toTimeString().slice(0, 8);
}

export function drawTelemChart(batteryHistory) {
  const canvas = document.getElementById('telemChart');
  const parent = canvas.parentElement;
  canvas.width  = parent.clientWidth;
  canvas.height = parent.clientHeight;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (batteryHistory.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = '#00e5a0';
  ctx.lineWidth   = 1.5;
  batteryHistory.forEach((v, i) => {
    const x = (i / (batteryHistory.length - 1)) * w;
    const y = h - (v / 100) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = 'rgba(0,229,160,0.05)';
  ctx.fill();
}

export function addLog(msg, level = 'info') {
  const stream = document.getElementById('logStream');
  const ts     = new Date().toTimeString().slice(0, 8);
  const line   = document.createElement('div');
  line.className = `log-line ${level}`;
  line.innerHTML = `<span class="ts">${ts}</span><span class="msg">${msg}</span>`;
  stream.appendChild(line);
  stream.scrollTop = stream.scrollHeight;
  while (stream.children.length > 80) stream.removeChild(stream.firstChild);
}

export function switchTab(name, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
}

export function initZoneSelection() {
  document.querySelectorAll('.zone-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.zone-item').forEach(z => z.classList.remove('active'));
      item.classList.add('active');
    });
  });
}