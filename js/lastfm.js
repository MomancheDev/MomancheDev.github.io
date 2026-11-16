const LASTFM_USER = 'Momanche';
const LASTFM_KEY = '5080b38600b04b2a03fa5c94814b2609';

async function cargarCancion() {
  const box = document.getElementById('np');
  if (!box) return;
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}&api_key=${LASTFM_KEY}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    const track = data.recenttracks && data.recenttracks.track && data.recenttracks.track[0];
    if (!track) return;

    const sonando = track['@attr'] && track['@attr'].nowplaying === 'true';
    const img = (track.image || []).find(i => i.size === 'large');
    const tieneImg = img && img['#text'];

    box.innerHTML = `
      <div class="np-label"></div>
      <div class="np-row">
        ${tieneImg ? '<img alt="">' : '<div class="np-art"></div>'}
        <div style="min-width:0">
          <div class="np-track"></div>
          <div class="np-artist"></div>
        </div>
      </div>`;
    box.querySelector('.np-label').textContent = sonando ? 'Escuchando ahora' : 'Última canción';
    if (tieneImg) box.querySelector('img').src = img['#text'];
    box.querySelector('.np-track').textContent = track.name;
    box.querySelector('.np-artist').textContent = track.artist['#text'];
  } catch (e) {
    box.innerHTML = '<div class="np-label">Last.fm</div><div class="np-artist">Sin datos por ahora</div>';
  }
}

function copiarEmail(btn) {
  const email = document.getElementById('email-addr').textContent;
  navigator.clipboard.writeText(email).then(() => {
    btn.textContent = 'copiado ✓';
    setTimeout(() => { btn.textContent = 'copiar email'; }, 2000);
  });
}

cargarCancion();
setInterval(cargarCancion, 30000);
