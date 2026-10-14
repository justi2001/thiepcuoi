/**
 * GIAO DIỆN BUSTLE - GÓI VIP (MEHAPPY)
 * Complete Client-side Logic & Interactive Features
 */

// ==========================================
// 1. ALBUM IMAGES DATASET
// ==========================================
const ALBUMS = {
  main: [
    // === ẢNH ĐÔI (18 ẢNH) XẾP TRƯỚC ===
    'images/wedding/PQD06107.jpg',
    'images/wedding/PQD06286.jpg',
    'images/wedding/PQD06385.jpg',
    'images/wedding/PQD06764.jpg',
    'images/wedding/PQD06779.jpg',
    'images/wedding/PQD06793.jpg',
    'images/wedding/PQD06812.jpg',
    'images/wedding/PQD06861.jpg',
    'images/wedding/PQD06867.jpg',
    'images/wedding/PQD06886.jpg',
    'images/wedding/PQD06888.jpg',
    'images/wedding/PQD06929.jpg',
    'images/wedding/PQD07012.jpg',
    'images/wedding/PQD07034.jpg',
    'images/wedding/PQD07040.jpg',
    'images/wedding/PQD07057.jpg',
    'images/wedding/PQD07109.jpg',
    'images/wedding/PQD07139.jpg',
    // === ẢNH ĐƠN (13 ẢNH) XẾP SAU ===
    // Album Chú rể: 6872, 6805, 6817, 6879
    'images/wedding/PQD06872.jpg',
    'images/wedding/PQD06805.jpg',
    'images/wedding/PQD06817.jpg',
    'images/wedding/PQD06879.jpg',
    'images/wedding/PQD06734.jpg',
    'images/wedding/PQD07161.jpg',
    'images/wedding/PQD07174.jpg',
    // Album Cô dâu: 6342, 7117, 6986, 6917
    'images/wedding/PQD06342.jpg',
    'images/wedding/PQD07117.jpg',
    'images/wedding/PQD06986.jpg',
    'images/wedding/PQD06917.jpg',
    'images/wedding/PQD06742.jpg',
    'images/wedding/PQD07266.jpg'
  ],
  groom: [
    'images/wedding/PQD06817.jpg',
    'images/wedding/PQD06805.jpg',
    'images/wedding/PQD06872.jpg',
    'images/wedding/PQD06879.jpg'
  ],
  bride: [
    'images/wedding/PQD06342.jpg',
    'images/wedding/PQD07117.jpg',
    'images/wedding/PQD06986.jpg',
    'images/wedding/PQD06917.jpg'
  ]
};

// Đổi ảnh chân dung chính khi click thumbnail
function setPortraitImage(gender, src, element) {
  const imgEl = document.getElementById(gender + '-portrait-img');
  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = src;
      imgEl.style.opacity = '1';
    }, 120);
  }
  if (element && element.parentElement) {
    element.parentElement.querySelectorAll('.portrait-thumb').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }
}

// ==========================================
// 2. AUDIO & ENVELOPE OPENING EFFECT
// ==========================================
const audio = document.getElementById('wedding-audio');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const dockMusicBtn = document.getElementById('dock-music-btn');
const envelopeOverlay = document.getElementById('envelope-overlay');
const openEnvelopeBtn = document.getElementById('open-envelope-btn');

let isAudioPlaying = false;
let envelopeOpened = false;

function updateAudioUI(playing) {
  isAudioPlaying = playing;
  if (audioToggleBtn) {
    if (playing) {
      audioToggleBtn.classList.add('spinning');
      audioToggleBtn.classList.remove('paused');
    } else {
      audioToggleBtn.classList.remove('spinning');
      audioToggleBtn.classList.add('paused');
    }
  }
  if (dockMusicBtn) {
    if (playing) {
      dockMusicBtn.classList.add('active');
    } else {
      dockMusicBtn.classList.remove('active');
    }
  }
}

// Native audio events to ensure UI stays perfectly synced
if (audio) {
  audio.addEventListener('play', () => updateAudioUI(true));
  audio.addEventListener('pause', () => updateAudioUI(false));
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

function playAudio() {
  if (!audio) return;
  audio.muted = false;

  // If audio is not yet loaded, trigger load
  if (audio.readyState === 0) {
    audio.load();
  }

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateAudioUI(true);
    }).catch(err => {
      console.log('Audio autoplay blocked or deferred, waiting for user gesture:', err);
      // Fallback: unlock immediately on the very next user gesture anywhere
      const fallbackUnlock = () => {
        if (!isAudioPlaying && audio) {
          audio.muted = false;
          audio.play().then(() => updateAudioUI(true)).catch(() => {});
        }
        ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(ev => {
          document.removeEventListener(ev, fallbackUnlock);
        });
      };
      ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(ev => {
        document.addEventListener(ev, fallbackUnlock, { once: true, passive: true });
      });
    });
  }
}

function pauseAudio() {
  if (!audio) return;
  audio.pause();
  updateAudioUI(false);
}

function toggleAudio() {
  if (isAudioPlaying) {
    pauseAudio();
    showToast('Đã tạm dừng nhạc nền');
  } else {
    playAudio();
    showToast('Đang phát nhạc nền');
  }
}

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', toggleAudio);
}

// ==========================================
// 2. ENVELOPE OPENING & SMOOTH SCROLL UNLOCK
// ==========================================
function openWeddingEnvelope() {
  if (envelopeOpened) return;
  const overlay = document.getElementById('envelope-overlay');
  if (!overlay || overlay.classList.contains('opened')) return;

  envelopeOpened = true;

  // 1. Play background music immediately inside user event
  playAudio();

  // 2. Add opened class for smooth double-door opening
  overlay.classList.add('opened');

  // 3. Unlock scroll after doors begin parting (450ms)
  setTimeout(() => {
    document.body.classList.remove('envelope-locked');
    document.documentElement.classList.remove('envelope-locked');
    
    // Smooth scroll to top of invitation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 450);

  // 4. Hide overlay completely after animation finishes
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 1300);
}

// Bind center seal button and overlay click/touch
if (openEnvelopeBtn) {
  ['click', 'touchend'].forEach(evtType => {
    openEnvelopeBtn.addEventListener(evtType, (e) => {
      e.preventDefault();
      e.stopPropagation();
      openWeddingEnvelope();
    }, { passive: false });
  });
}

if (envelopeOverlay) {
  ['click', 'touchend'].forEach(evtType => {
    envelopeOverlay.addEventListener(evtType, (e) => {
      if (envelopeOpened) return;
      openWeddingEnvelope();
    }, { passive: true });
  });
}

// ==========================================
// 3. FALLING PARTICLES EFFECT
// ==========================================
function initFallingParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const count = 22;
  const svgCircle = `<svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#ffffff" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.25))"/></svg>`;
  const svgHeart = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#965D5D"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.innerHTML = Math.random() > 0.4 ? svgHeart : svgCircle;

    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 9;
    const delay = Math.random() * 8;
    const size = 0.7 + Math.random() * 0.7;

    p.style.left = `${left}%`;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${delay}s`;
    p.style.transform = `scale(${size})`;

    container.appendChild(p);
  }
}

// ==========================================
// 4. TAB CONTROLS (PORTRAIT & SCHEDULE)
// ==========================================
function switchPortraitTab(tab) {
  const groomTabBtn = document.getElementById('tab-btn-groom');
  const brideTabBtn = document.getElementById('tab-btn-bride');
  const groomSection = document.getElementById('section-groom');
  const brideSection = document.getElementById('section-bride');

  if (tab === 'groom') {
    groomTabBtn.classList.add('active');
    brideTabBtn.classList.remove('active');
    groomSection.style.display = 'block';
    brideSection.style.display = 'none';
  } else {
    brideTabBtn.classList.add('active');
    groomTabBtn.classList.remove('active');
    brideSection.style.display = 'block';
    groomSection.style.display = 'none';
  }
}

function switchScheduleTab(tab) {
  const groomTabBtn = document.getElementById('tab-btn-groom-sched');
  const brideTabBtn = document.getElementById('tab-btn-bride-sched');
  const groomCountdown = document.getElementById('section-countdown-groom');
  const brideCountdown = document.getElementById('section-countdown-bride');

  if (tab === 'groom') {
    groomTabBtn.classList.add('active');
    brideTabBtn.classList.remove('active');
    groomCountdown.style.display = 'block';
    brideCountdown.style.display = 'none';
  } else {
    brideTabBtn.classList.add('active');
    groomTabBtn.classList.remove('active');
    brideCountdown.style.display = 'block';
    groomCountdown.style.display = 'none';
  }
}

// ==========================================
// 5. LIVE COUNTDOWN TIMERS
// ==========================================
function initCountdownTimers() {
  // Groom wedding: 15:30 on 13/11/2026
  const targetGroom = new Date(2026, 10, 13, 15, 30, 0).getTime();
  // Bride wedding: 11:00 on 17/11/2026
  const targetBride = new Date(2026, 10, 17, 11, 0, 0).getTime();

  function update() {
    const now = new Date().getTime();

    // Update Groom Clock
    const diffG = targetGroom - now;
    if (diffG > 0) {
      const d = Math.floor(diffG / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffG % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diffG % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffG % (1000 * 60)) / 1000);

      document.getElementById('g-days').textContent = String(d).padStart(2, '0');
      document.getElementById('g-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('g-mins').textContent = String(m).padStart(2, '0');
      document.getElementById('g-secs').textContent = String(s).padStart(2, '0');
    }

    // Update Bride Clock
    const diffB = targetBride - now;
    if (diffB > 0) {
      const d = Math.floor(diffB / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffB % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diffB % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffB % (1000 * 60)) / 1000);

      document.getElementById('b-days').textContent = String(d).padStart(2, '0');
      document.getElementById('b-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('b-mins').textContent = String(m).padStart(2, '0');
      document.getElementById('b-secs').textContent = String(s).padStart(2, '0');
    }
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 6. LIGHTBOX & ALBUMS
// ==========================================
let currentAlbumKey = 'main';
let currentImageIndex = 0;

function openLightbox(index = 0, albumKey = 'main') {
  currentAlbumKey = albumKey;
  currentImageIndex = Math.max(0, Math.min(index, ALBUMS[albumKey].length - 1));

  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-active-img');
  const currEl = document.getElementById('lightbox-current-idx');
  const totalEl = document.getElementById('lightbox-total-idx');

  imgEl.src = ALBUMS[currentAlbumKey][currentImageIndex];
  currEl.textContent = currentImageIndex + 1;
  totalEl.textContent = ALBUMS[currentAlbumKey].length;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightboxImage(step) {
  const list = ALBUMS[currentAlbumKey];
  currentImageIndex = (currentImageIndex + step + list.length) % list.length;

  const imgEl = document.getElementById('lightbox-active-img');
  const currEl = document.getElementById('lightbox-current-idx');

  imgEl.src = list[currentImageIndex];
  currEl.textContent = currentImageIndex + 1;
}

function openAlbumModal(albumKey) {
  openLightbox(0, albumKey);
}

function openLightboxBySrc(src) {
  if (!src) return;
  // Clean relative path if absolute URL passed
  let cleanSrc = src;
  try {
    const url = new URL(src, window.location.href);
    cleanSrc = url.pathname.replace(/^\//, '');
  } catch (e) {}

  let foundAlbum = 'main';
  let foundIndex = 0;
  for (const [key, list] of Object.entries(ALBUMS)) {
    const idx = list.findIndex(item => item === cleanSrc || src.includes(item) || item.includes(cleanSrc));
    if (idx !== -1) {
      foundAlbum = key;
      foundIndex = idx;
      break;
    }
  }
  openLightbox(foundIndex, foundAlbum);
}

// Lightbox keyboard controls
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox-modal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  if (e.key === 'ArrowRight') changeLightboxImage(1);
});

// Touch swipe support for lightbox
let touchStartX = 0;
const lightboxModal = document.getElementById('lightbox-modal');
if (lightboxModal) {
  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 45) {
      changeLightboxImage(1); // Swipe left -> next
    } else if (touchEndX > touchStartX + 45) {
      changeLightboxImage(-1); // Swipe right -> prev
    }
  }, { passive: true });
}

// ==========================================
// 7. MODAL POPUPS (BANK, VIDEO)
// ==========================================
function openPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  popup.classList.remove('active');
  document.body.style.overflow = '';
}

// Close popup on backdrop click
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePopup(modal.id);
    }
  });
});

// ==========================================
// 8. CLIPBOARD & DOWNLOAD UTILITIES
// ==========================================
function copyToClipboard(text, successMsg = 'Đã sao chép vào bộ nhớ tạm!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Lỗi khi sao chép: ' + text);
  }
  document.body.removeChild(textArea);
}

function downloadQR(imgUrl, fileName) {
  const a = document.createElement('a');
  a.href = imgUrl;
  a.download = fileName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Đang tải mã QR...');
}

// ==========================================
// 9. CALENDAR & MAP ACTIONS
// ==========================================
function addToGoogleCalendar(title, startIso, endIso, location) {
  const formatTime = (iso) => iso.replace(/[-:]/g, '');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(startIso)}/${formatTime(endIso)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
  window.open(url, '_blank');
}

function openMapUrl(location) {
  if (typeof location === 'string' && (location.startsWith('http://') || location.startsWith('https://'))) {
    window.open(location, '_blank');
    return;
  }
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  window.open(url, '_blank');
}

function shareInvitation() {
  if (navigator.share) {
    navigator.share({
      title: 'Lễ Cưới Phú Cường & Thuỳ Linh',
      text: 'Trân trọng kính mời bạn và người thương đến tham dự lễ cưới của chúng tôi!',
      url: window.location.href
    }).catch(err => console.log('Share canceled:', err));
  } else {
    copyToClipboard(window.location.href, 'Đã sao chép link thiệp cưới!');
  }
}

// ==========================================
// 10. GUESTBOOK (SỔ LƯU BÚT) - REALTIME SYNC
// ==========================================
const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Long',
    message: 'Chúc mừng hạnh phúc hai bạn! Trăm năm hạnh phúc, đầu bạc răng long và luôn rạng ngời nụ cười như ngày hôm nay nhé 🎉',
    time: '2 ngày trước',
    createdAt: '2026-10-09T14:30:00.000Z',
    likes: 12
  },
  {
    id: 2,
    name: 'Trần Phương Thảo',
    message: 'Chúc hai bạn một đời an yên, luôn yêu thương, nhường nhịn và đồng hành cùng nhau trên mọi nẻo đường đời 🥰',
    time: '3 ngày trước',
    createdAt: '2026-10-08T10:15:00.000Z',
    likes: 9
  }
];

let wishesList = [];

function formatRelativeTime(iso) {
  if (!iso) return 'Vừa xong';
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return 'Vừa xong';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} ngày trước`;
  return `${Math.floor(diffSec / 604800)} tuần trước`;
}

async function loadWishes() {
  try {
    const res = await fetch('/api/wishes');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        wishesList = json.data;
        localStorage.setItem('wedding_bustle_wishes', JSON.stringify(wishesList));
        renderWishes();
        return;
      }
    }
  } catch (err) {
    console.warn('API /api/wishes unavailable, loading from local cache:', err);
  }
  // Fallback to local cache
  try {
    const saved = localStorage.getItem('wedding_bustle_wishes');
    wishesList = saved ? JSON.parse(saved) : DEFAULT_WISHES;
  } catch (e) {
    wishesList = DEFAULT_WISHES;
  }
  renderWishes();
}

function renderWishes() {
  const listEl = document.getElementById('wishes-feed-list');
  const countEl = document.getElementById('wishes-count');
  if (!listEl) return;

  if (countEl) countEl.textContent = wishesList.length;

  if (wishesList.length === 0) {
    listEl.innerHTML = '<div style="text-align:center; padding:24px; color:#888; font-size:14px;">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc phúc nhé! ❤️</div>';
    return;
  }

  const likedMap = JSON.parse(localStorage.getItem('wedding_liked_wishes') || '{}');

  listEl.innerHTML = '';
  wishesList.forEach(w => {
    const isLiked = likedMap[w.id] || w.liked || false;
    const item = document.createElement('div');
    item.className = 'wish-card-item';
    item.innerHTML = `
      <div class="wish-card-header">
        <span class="wish-sender-name">${escapeHTML(w.name)}</span>
        <span class="wish-card-time">${escapeHTML(w.time || formatRelativeTime(w.createdAt))}</span>
      </div>
      <p class="wish-card-text">${escapeHTML(w.message)}</p>
      <div class="wish-card-footer">
        <div class="wish-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeWish(${w.id}, this)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="${isLiked ? '#e74c3c' : 'currentColor'}">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="like-num">${w.likes || 0}</span>
        </div>
      </div>
    `;
    listEl.appendChild(item);
  });
}

async function toggleLikeWish(id, btnEl) {
  const likedMap = JSON.parse(localStorage.getItem('wedding_liked_wishes') || '{}');
  const wasLiked = likedMap[id] || false;
  
  likedMap[id] = !wasLiked;
  localStorage.setItem('wedding_liked_wishes', JSON.stringify(likedMap));

  const item = wishesList.find(w => w.id === id);
  if (item) {
    item.likes = Math.max(0, (item.likes || 0) + (likedMap[id] ? 1 : -1));
    item.liked = likedMap[id];
  }

  // Update UI immediately
  if (btnEl) {
    btnEl.classList.toggle('liked', likedMap[id]);
    const numEl = btnEl.querySelector('.like-num');
    if (numEl && item) numEl.textContent = item.likes;
    const svgEl = btnEl.querySelector('svg');
    if (svgEl) svgEl.setAttribute('fill', likedMap[id] ? '#e74c3c' : 'currentColor');
  }

  // Sync to server if liked
  if (likedMap[id]) {
    try {
      await fetch(`/api/wishes/${id}/like`, { method: 'POST' });
    } catch (e) {}
  }
}

function applyWishChip(btn) {
  document.querySelectorAll('.wish-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const textarea = document.getElementById('wish-message');
  if (textarea) {
    const rawText = btn.innerText || btn.textContent;
    textarea.value = rawText.trim();
    textarea.classList.add('pulse-focus');
    textarea.focus();
    setTimeout(() => textarea.classList.remove('pulse-focus'), 1000);
  }
}

async function handleWishSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wish-name');
  const msgInput = document.getElementById('wish-message');
  const submitBtn = document.getElementById('wish-submit-btn');

  const name = nameInput ? nameInput.value.trim() : '';
  const message = msgInput ? msgInput.value.trim() : '';

  if (!name || !message) {
    showToast('Vui lòng nhập đầy đủ họ tên và lời chúc!');
    return;
  }

  // Lưu tên vào bộ nhớ
  localStorage.setItem('wedding_guest_name', name);

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
  }

  // Lấy thông tin RSVP đã gửi gần nhất (nếu có)
  let lastRsvp = {};
  try {
    lastRsvp = JSON.parse(localStorage.getItem('wedding_last_rsvp') || '{}');
  } catch (err) {}

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timeFormatted = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Payload đồng bộ về Google Sheets theo đúng các cột trong bảng:
  // A: Thời gian | B: Họ và tên | C: Trạng thái tham dự | D: Phân loại khách | E: Số lượng | F: Sự kiện tham gia | G: lời chúc phúc
  const googleSheetWishPayload = {
    // Cột A: Thời gian
    "Thời gian": timeFormatted,
    time: timeFormatted,
    date: timeFormatted,
    submittedAt: timeFormatted,

    // Cột B: Họ và tên
    "Họ và tên": name,
    name: name,
    hoVaTen: name,
    fullName: name,

    // Cột C: Trạng thái tham dự
    "Trạng thái tham dự": lastRsvp.attendance || 'Có, tôi sẽ tham dự',
    attendance: lastRsvp.attendance || 'Có, tôi sẽ tham dự',
    trangThaiThamDu: lastRsvp.attendance || 'Có, tôi sẽ tham dự',

    // Cột D: Phân loại khách
    "Phân loại khách": lastRsvp.guestOf || 'Khách mời của cả hai',
    guestOf: lastRsvp.guestOf || 'Khách mời của cả hai',
    guest_of: lastRsvp.guestOf || 'Khách mời của cả hai',
    phanLoaiKhach: lastRsvp.guestOf || 'Khách mời của cả hai',
    phanLoai: lastRsvp.guestOf || 'Khách mời của cả hai',

    // Cột E: Số lượng
    "Số lượng": lastRsvp.guestCount || '1',
    guestCount: lastRsvp.guestCount || '1',
    guest_count: lastRsvp.guestCount || '1',
    soLuong: lastRsvp.guestCount || '1',
    count: lastRsvp.guestCount || '1',

    // Cột F: Sự kiện tham gia
    "Sự kiện tham gia": lastRsvp.eventTarget || 'Tất cả Sự kiện nhà Trai',
    eventTarget: lastRsvp.eventTarget || 'Tất cả Sự kiện nhà Trai',
    event_target: lastRsvp.eventTarget || 'Tất cả Sự kiện nhà Trai',
    suKienThamGia: lastRsvp.eventTarget || 'Tất cả Sự kiện nhà Trai',
    suKien: lastRsvp.eventTarget || 'Tất cả Sự kiện nhà Trai',

    // Cột G: lời chúc phúc
    "lời chúc phúc": message,
    "loi chuc phuc": message,
    loiChucPhuc: message,
    loiChuc: message,
    loi_chuc: message,
    loi_chuc_phuc: message,
    message: message,
    wish: message,
    content: message
  };

  // 1. Gửi trực tiếp về Google Sheets (Google Apps Script Web App)
  try {
    await fetch(GOOGLE_SCRIPT_RSVP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(googleSheetWishPayload)
    });
  } catch (err) {
    console.warn('Google Sheets sync notice:', err);
  }

  // 2. Gửi đến server API nội bộ (nếu có)
  const newWish = {
    id: Date.now(),
    name: name,
    message: message,
    time: 'Vừa xong',
    createdAt: new Date().toISOString(),
    likes: 1,
    liked: true
  };

  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.wish) {
        newWish.id = data.wish.id;
      }
    }
  } catch (err) {
    console.warn('API error, saving locally:', err);
  }

  // Lưu cục bộ
  wishesList.unshift(newWish);
  const likedMap = JSON.parse(localStorage.getItem('wedding_liked_wishes') || '{}');
  likedMap[newWish.id] = true;
  localStorage.setItem('wedding_liked_wishes', JSON.stringify(likedMap));
  localStorage.setItem('wedding_bustle_wishes', JSON.stringify(wishesList));
  renderWishes();

  // Giữ nguyên tên người dùng, chỉ xóa nội dung lời chúc đã gửi
  msgInput.value = '';
  document.querySelectorAll('.wish-chip').forEach(b => b.classList.remove('active'));

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi lời chúc';
  }

  showToast('Cảm ơn bạn đã gửi lời chúc phúc ý nghĩa! ❤️');
}

// ==========================================
// 11. RSVP FORM SUBMISSION & GOOGLE SHEETS SYNC
// ==========================================
const GOOGLE_SCRIPT_RSVP_URL = 'https://script.google.com/macros/s/AKfycbxVDiRcTBWRAM9k6VNq1Q_eBA-jjpworYfGkE9ytwdV42N-PdyeHqRewcbngO2VS95E/exec';

function handleAttendanceChange(val) {
  const detailsRow = document.getElementById('rsvp-details-row');
  const eventRow = document.getElementById('rsvp-event-row');
  if (val.includes('bận')) {
    if (detailsRow) detailsRow.style.opacity = '0.4';
    if (eventRow) eventRow.style.opacity = '0.4';
  } else {
    if (detailsRow) detailsRow.style.opacity = '1';
    if (eventRow) eventRow.style.opacity = '1';
  }
}

function prefillRSVP(eventName) {
  const select = document.getElementById('rsvp-event-target');
  if (select) {
    for (let opt of select.options) {
      if (opt.value.includes(eventName) || eventName.includes(opt.value)) {
        select.value = opt.value;
        break;
      }
    }
  }
  focusRSVP();
}

async function handleRSVPSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const nameEl = document.getElementById('rsvp-name');
  const name = nameEl ? nameEl.value.trim() : '';
  const emailEl = document.getElementById('rsvp-email');
  const email = emailEl ? emailEl.value.trim() : '';
  const attendance = document.getElementById('rsvp-attendance')?.value || 'Có, tôi sẽ tham dự';
  const guestOf = document.getElementById('rsvp-guest-of')?.value || 'Khách mời của cả hai';
  const guestCount = document.getElementById('rsvp-guest-count')?.value || '1';
  const eventTarget = document.getElementById('rsvp-event-target')?.value || 'Tất cả Sự kiện nhà Trai';

  if (!name) {
    showToast('Vui lòng nhập họ và tên của bạn!');
    if (nameEl) nameEl.focus();
    return;
  }

  // Tự động lưu tên và hiển thị ngay ở form Sổ lưu bút
  localStorage.setItem('wedding_guest_name', name);
  const wishNameInput = document.getElementById('wish-name');
  if (wishNameInput) {
    wishNameInput.value = name;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
  }

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timeFormatted = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const rsvpData = {
    id: Date.now(),
    name, email, attendance, guestOf, guestCount, eventTarget,
    submittedAt: timeFormatted,
    // Các cột chính xác theo Google Sheet
    "Thời gian": timeFormatted,
    "Họ và tên": name,
    "Trạng thái tham dự": attendance,
    "Phân loại khách": guestOf,
    "Số lượng": guestCount,
    "Sự kiện tham gia": eventTarget,
    "lời chúc phúc": "",
    // Aliases to match Google Apps Script variables
    time: timeFormatted,
    date: timeFormatted,
    guest_of: guestOf,
    guest: guestOf,
    phanLoaiKhach: guestOf,
    phanLoai: guestOf,
    guest_count: guestCount,
    count: guestCount,
    soLuong: guestCount,
    people: guestCount,
    event_target: eventTarget,
    event: eventTarget,
    suKienThamGia: eventTarget,
    suKien: eventTarget
  };

  // 1. Send directly to Google Sheets (Google Apps Script Web App)
  try {
    await fetch(GOOGLE_SCRIPT_RSVP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(rsvpData)
    });
  } catch (err) {
    console.warn('Google Sheets sync notice:', err);
  }

  // 2. Send to server API if available (Node.js server)
  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.total) updateRSVPCount(data.total);
    }
  } catch (err) {}

  // 3. Always persist to localStorage
  try {
    const list = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
    list.unshift(rsvpData);
    localStorage.setItem('wedding_rsvp_entries', JSON.stringify(list));
    localStorage.setItem('wedding_rsvp_submitted', 'true');
    localStorage.setItem('wedding_last_rsvp', JSON.stringify(rsvpData));
    updateRSVPCount(list.length);
  } catch (e) {}

  // 4. Permanently dismiss and hide the floating prompt "Bạn sẽ tham gia chứ ?"
  dismissPromptPermanently();

  // 5. Render inline success confirmation right inside section-rsvp
  renderRSVPInlineSuccess(rsvpData);

  // 6. Open celebratory modal popup
  openRSVPSuccessModal(rsvpData);

  // 7. Show friendly notification toast & reset form
  showToast('Xác nhận tham dự thành công! Cảm ơn bạn ❤️');
  document.getElementById('rsvp-form')?.reset();

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Xác nhận';
  }

  // 8. Tự động chuyển mượt đến form Sổ Lưu Bút và focus vào ô lời chúc
  setTimeout(() => {
    closePopup('popup-rsvp-success');
    scrollToSection('section-guestbook');
    const wishMsgEl = document.getElementById('wish-message');
    if (wishMsgEl) {
      wishMsgEl.focus();
    }
  }, 1200);
}

function renderRSVPInlineSuccess(data) {
  const form = document.getElementById('rsvp-form');
  const box = document.getElementById('rsvp-success-inline-box');
  const guestNameEl = document.getElementById('inline-guest-name');
  const detailsEl = document.getElementById('inline-success-details');

  if (form) form.style.display = 'none';
  if (guestNameEl) guestNameEl.textContent = data.name;

  if (detailsEl) {
    const isAttending = (data.attendance || '').includes('Có');
    detailsEl.innerHTML = `
      <div class="summary-line">
        <span class="lbl">Trạng thái:</span>
        <span class="val ${isAttending ? 'attending' : 'declined'}">${escapeHTML(data.attendance)}</span>
      </div>
      ${isAttending ? `
        <div class="summary-line">
          <span class="lbl">Khách mời của:</span>
          <span class="val">${escapeHTML(data.guestOf || 'Cả hai')}</span>
        </div>
        <div class="summary-line">
          <span class="lbl">Số người:</span>
          <span class="val">${escapeHTML(data.guestCount === '1' ? 'Đi 1 mình' : (data.guestCount === '2' ? 'Đi 2 người (+1)' : data.guestCount + ' người'))}</span>
        </div>
        <div class="summary-line">
          <span class="lbl">Sự kiện:</span>
          <span class="val">${escapeHTML(data.eventTarget)}</span>
        </div>
      ` : `
        <div class="summary-line">
          <span class="lbl">Ghi chú:</span>
          <span class="val">Rất tiếc vì bạn bận. Hẹn gặp lại bạn vào dịp gần nhất!</span>
        </div>
      `}
    `;
  }

  if (box) box.style.display = 'block';
}

function editRSVPResponse() {
  const form = document.getElementById('rsvp-form');
  const box = document.getElementById('rsvp-success-inline-box');
  if (box) box.style.display = 'none';
  if (form) form.style.display = 'flex';
  
  try {
    const last = JSON.parse(localStorage.getItem('wedding_last_rsvp') || '{}');
    if (last.name) {
      const nameInput = document.getElementById('rsvp-name');
      if (nameInput) nameInput.value = last.name;
    }
  } catch (e) {}
}

function openRSVPSuccessModal(data) {
  const summaryBox = document.getElementById('rsvp-summary-box');
  const successMsg = document.getElementById('rsvp-success-msg');
  if (successMsg) {
    successMsg.innerHTML = `Cảm ơn <strong>${escapeHTML(data.name)}</strong> đã gửi phản hồi cho Phú Cường &amp; Thuỳ Linh!`;
  }
  if (summaryBox) {
    const isAttending = data.attendance.includes('Có');
    summaryBox.innerHTML = `
      <div class="summary-line">
        <span class="lbl">Trạng thái:</span>
        <span class="val ${isAttending ? 'attending' : 'declined'}">${escapeHTML(data.attendance)}</span>
      </div>
      ${isAttending ? `
        <div class="summary-line">
          <span class="lbl">Khách mời của:</span>
          <span class="val">${escapeHTML(data.guestOf)}</span>
        </div>
        <div class="summary-line">
          <span class="lbl">Số người:</span>
          <span class="val">${escapeHTML(data.guestCount === '1' ? 'Đi 1 mình' : (data.guestCount === '2' ? 'Đi 2 người (+1)' : data.guestCount + ' người'))}</span>
        </div>
        <div class="summary-line">
          <span class="lbl">Sự kiện tham gia:</span>
          <span class="val">${escapeHTML(data.eventTarget)}</span>
        </div>
      ` : `
        <div class="summary-line">
          <span class="lbl">Ghi chú:</span>
          <span class="val">Rất tiếc vì bạn bận. Vợ chồng rất mong nhận được lời chúc phúc từ bạn ở Sổ lưu bút!</span>
        </div>
      `}
    `;
  }
  openPopup('popup-rsvp-success');
}

async function openAdminModal() {
  await fetchRSVPList();
  openPopup('popup-admin-rsvp');
}

async function fetchRSVPList() {
  let list = [];
  try {
    const res = await fetch('/api/rsvp');
    if (res.ok) {
      const data = await res.json();
      if (data.data) list = data.data;
    }
  } catch (e) {
    list = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
  }

  updateRSVPCount(list.length);

  // Compute stats
  let totalGuests = 0;
  let attending = 0;
  let declined = 0;

  list.forEach(r => {
    if ((r.attendance || '').includes('Có')) {
      attending++;
      const count = parseInt(r.guestCount, 10);
      totalGuests += isNaN(count) ? 1 : count;
    } else {
      declined++;
    }
  });

  const elTotal = document.getElementById('stat-total-guests');
  const elAttending = document.getElementById('stat-attending-count');
  const elDeclined = document.getElementById('stat-declined-count');
  if (elTotal) elTotal.textContent = totalGuests;
  if (elAttending) elAttending.textContent = attending;
  if (elDeclined) elDeclined.textContent = declined;

  // Render Table
  const tbody = document.getElementById('admin-rsvp-tbody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#999;">Chưa có khách mời nào xác nhận tham dự.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHTML(r.name)}</strong>${r.email ? `<br><small style="color:#888;">${escapeHTML(r.email)}</small>` : ''}</td>
      <td><span class="badge ${r.attendance.includes('Có') ? 'badge-success' : 'badge-danger'}">${r.attendance.includes('Có') ? 'Tham dự' : 'Bận'}</span></td>
      <td>${escapeHTML(r.guestOf || '-')}</td>
      <td>${escapeHTML(r.guestCount || '1')}</td>
      <td>${escapeHTML(r.eventTarget || '-')}</td>
      <td><small style="color:#888;">${formatRelativeTime(r.submittedAt)}</small></td>
    </tr>
  `).join('');
}

function updateRSVPCount(count) {
  const el = document.getElementById('rsvp-total-count');
  if (el) el.textContent = count;
}

function copyRSVPList() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
  } catch (e) {}

  if (list.length === 0) {
    showToast('Chưa có dữ liệu khách mời để copy!');
    return;
  }

  let text = 'DANH SÁCH KHÁCH MỜI XÁC NHẬN (RSVP) - PHÚ CƯỜNG & THUỲ LINH\n\n';
  list.forEach((r, i) => {
    text += `${i + 1}. ${r.name} - ${r.attendance} - ${r.guestOf} - Số người: ${r.guestCount} - Sự kiện: ${r.eventTarget} - ${r.submittedAt ? r.submittedAt.slice(0, 10) : ''}\n`;
  });

  copyToClipboard(text, 'Đã copy danh sách khách mời vào bộ nhớ tạm!');
}

function exportRSVPCsv(e) {
  if (e) e.preventDefault();
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
  } catch (err) {}

  if (!list.length) {
    showToast('Chưa có dữ liệu khách mời để xuất file!');
    return;
  }

  let csv = '\uFEFFHọ và tên,Tham dự,Khách của ai,Số người,Sự kiện,Thời gian gửi\n';
  list.forEach(r => {
    csv += `"${(r.name || '').replace(/"/g, '""')}","${r.attendance || ''}","${r.guestOf || ''}","${r.guestCount || ''}","${r.eventTarget || ''}","${r.submittedAt || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Danh_sach_RSVP_Dam_cuoi.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Đã tải xuống file danh sách khách mời (Excel/CSV)!');
}

// ==========================================
// 12. FLOATING PROMPT & SCROLL UTILITIES
// ==========================================
function focusRSVP() {
  scrollToSection('section-rsvp');
  setTimeout(() => {
    const nameInput = document.getElementById('rsvp-name');
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add('pulse-focus');
      setTimeout(() => nameInput.classList.remove('pulse-focus'), 1500);
    }
  }, 450);
}

function dismissPrompt(e) {
  if (e) e.stopPropagation();
  sessionStorage.setItem('wedding_prompt_dismissed', 'true');
  const prompt = document.getElementById('floating-rsvp-prompt');
  if (prompt) {
    prompt.classList.remove('show');
    prompt.style.opacity = '0';
    prompt.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => {
      prompt.style.display = 'none';
    }, 300);
  }
}

function dismissPromptPermanently() {
  sessionStorage.setItem('wedding_prompt_dismissed', 'true');
  const prompt = document.getElementById('floating-rsvp-prompt');
  if (prompt) {
    prompt.classList.remove('show');
    prompt.style.display = 'none';
  }
}

function handleScrollPrompt() {
  const prompt = document.getElementById('floating-rsvp-prompt');
  if (!prompt) return;

  // 1. If already confirmed RSVP or dismissed this session, never show
  if (localStorage.getItem('wedding_rsvp_submitted') === 'true' || sessionStorage.getItem('wedding_prompt_dismissed') === 'true') {
    prompt.classList.remove('show');
    prompt.style.display = 'none';
    return;
  }

  // 2. Hide when user is viewing section-rsvp so it doesn't obstruct the form
  const rsvpSection = document.getElementById('section-rsvp');
  if (rsvpSection) {
    const rect = rsvpSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60 && rect.bottom > 60) {
      prompt.classList.remove('show');
      return;
    }
  }

  // 3. Show after scrolling down 400px
  if (window.scrollY > 400) {
    prompt.classList.add('show');
  } else {
    prompt.classList.remove('show');
  }
}

window.addEventListener('scroll', handleScrollPrompt, { passive: true });

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const offset = 10;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = el.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// ==========================================
// 13. TOAST NOTIFICATION UTILITY
// ==========================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-message');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================
// 14. PERSONALIZED GUEST NAME UTILITY
// ==========================================
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guestNameParam = params.get('to') || params.get('guest') || params.get('ten') || params.get('name') || params.get('u');
  let savedGuestName = '';
  try {
    savedGuestName = localStorage.getItem('wedding_guest_name') || '';
    if (!savedGuestName) {
      const lastRsvp = JSON.parse(localStorage.getItem('wedding_last_rsvp') || '{}');
      if (lastRsvp.name) savedGuestName = lastRsvp.name;
    }
  } catch (e) {}

  const activeName = (guestNameParam && guestNameParam.trim()) || (savedGuestName && savedGuestName.trim()) || '';

  const labelEl = document.getElementById('invite-guest-label');
  if (labelEl && activeName) {
    labelEl.innerHTML = `<span style="font-size:14px; opacity:0.85;">Kính mời:</span> <strong style="color: #987289; font-size:17px; font-weight:700;">${escapeHTML(activeName)}</strong>`;
  }

  const rsvpInput = document.getElementById('rsvp-name');
  const wishInput = document.getElementById('wish-name');

  if (activeName) {
    if (rsvpInput && !rsvpInput.value) {
      rsvpInput.value = activeName;
    }
    if (wishInput && !wishInput.value) {
      wishInput.value = activeName;
    }
  }

  // Tự động đồng bộ tên hai chiều: khi gõ ở form RSVP thì form Sổ lưu bút tự động hiển thị tên
  if (rsvpInput && wishInput) {
    rsvpInput.addEventListener('input', (e) => {
      const val = e.target.value;
      wishInput.value = val;
      if (val.trim()) {
        localStorage.setItem('wedding_guest_name', val.trim());
      }
    });

    wishInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.trim()) {
        localStorage.setItem('wedding_guest_name', val.trim());
      }
    });
  }
}

// ==========================================
// 15. INITIALIZATION
// ==========================================
function initRSVPState() {
  try {
    if (localStorage.getItem('wedding_rsvp_submitted') === 'true') {
      const last = JSON.parse(localStorage.getItem('wedding_last_rsvp') || '{}');
      if (last.name) {
        renderRSVPInlineSuccess(last);
        dismissPromptPermanently();
      }
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initFallingParticles();
  initCountdownTimers();
  loadWishes();
  fetchRSVPList();
  initGuestName();
  initRSVPState();
});
