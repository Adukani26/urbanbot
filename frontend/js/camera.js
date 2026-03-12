let camFrame = 0;

export function renderDemoCamera() {
  const canvas = document.getElementById('camCanvas');
  const ctx    = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  camFrame++;

  ctx.fillStyle = '#0a1208';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#111a10';
  ctx.fillRect(0, h * 0.55, w, h);

  for (let i = 0; i < 8; i++) {
    const x = (i / 8) * w + Math.sin(camFrame * 0.05 + i) * 5;
    const y = h * 0.5 + Math.cos(camFrame * 0.03 + i) * 4;
    const r = 12 + Math.sin(i + camFrame * 0.02) * 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(20, ${60 + i * 10}, 15, 0.8)`;
    ctx.fill();
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.strokeStyle = 'rgba(80,80,70,0.4)';
      ctx.lineWidth   = 0.5;
      ctx.strokeRect(col * 40 + (row % 2 ? 20 : 0), h * 0.7 + row * 12, 38, 10);
    }
  }

  const scanY = camFrame % h;
  ctx.fillStyle = 'rgba(0,229,160,0.08)';
  ctx.fillRect(0, scanY, w, 2);

  const cx = w / 2 + Math.sin(camFrame * 0.04) * 20;
  const cy = h * 0.55;
  ctx.strokeStyle = 'rgba(240,165,0,0.7)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
  ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
  ctx.stroke();
  ctx.strokeRect(cx - 15, cy - 15, 30, 30);
}

export function renderCameraFrame(base64) {
  const img    = new Image();
  img.onload   = () => {
    const canvas = document.getElementById('camCanvas');
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/jpeg;base64,' + base64;
}