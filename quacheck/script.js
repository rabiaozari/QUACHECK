function sayfaGoster(sayfa) {
  // Sayfaları sırayla kapat
  const sayfalar = document.querySelectorAll('.sayfa-icerigi');
  sayfalar.forEach(s => s.classList.remove('active'));

  // İstenen sayfayı aç
  const aktifSayfa = document.getElementById(sayfa + '-sayfasi');
  if (aktifSayfa) aktifSayfa.classList.add('active');

  // Menüde aktifliği güncelle
  const navlar = document.querySelectorAll('.nav-links a');
  navlar.forEach(nav => nav.classList.remove('active'));
  const aktifNav = document.getElementById('nav-' + sayfa);
  if (aktifNav) aktifNav.classList.add('active');

  // 3D model sayfasıysa
  if (sayfa === 'galeri') {
    // Önce varsa eski script ve canvas'ı temizle
    const eskiScript = document.getElementById('threejs-loader');
    if (eskiScript) eskiScript.remove();
    const eskiCanvas = document.querySelector('#model-container canvas');
    if (eskiCanvas) eskiCanvas.remove();

    // Yükleme ekranı görünür olsun
    const progress = document.getElementById('progress-container');
    if (progress) progress.style.display = 'block';

    // Yeni script yükle
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './main.js?t=' + new Date().getTime(); // önbelleği kır
    script.id = 'threejs-loader';
    document.body.appendChild(script);
  } else {
    // Diğer sayfalarda modeli ve scripti kaldır
    const modelScript = document.getElementById('threejs-loader');
    if (modelScript) modelScript.remove();
    const canvas = document.querySelector('#model-container canvas');
    if (canvas) canvas.remove();

    const progress = document.getElementById('progress-container');
    if (progress) progress.style.display = 'block';
  }
}
