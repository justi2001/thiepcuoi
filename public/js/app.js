/**
 * GIAO DIỆN BUSTLE - GÓI VIP (MEHAPPY)
 * Complete Client-side Logic & Interactive Features
 */

// ==========================================
// 1. ALBUM IMAGES DATASET
// ==========================================
const ALBUMS = {
  main: [
    'images/wedding/PQD06107.jpg',
    'images/wedding/PQD06286.jpg',
    'images/wedding/PQD06342.jpg',
    'images/wedding/PQD06385.jpg',
    'images/wedding/PQD06734.jpg',
    'images/wedding/PQD06742.jpg',
    'images/wedding/PQD06764.jpg',
    'images/wedding/PQD06779.jpg',
    'images/wedding/PQD06793.jpg',
    'images/wedding/PQD06805.jpg',
    'images/wedding/PQD06812.jpg',
    'images/wedding/PQD06817.jpg',
    'images/wedding/PQD06861.jpg',
    'images/wedding/PQD06867.jpg',
    'images/wedding/PQD06872.jpg',
    'images/wedding/PQD06879.jpg',
    'images/wedding/PQD06886.jpg',
    'images/wedding/PQD06888.jpg',
    'images/wedding/PQD06917.jpg',
    'images/wedding/PQD06929.jpg',
    'images/wedding/PQD06986.jpg',
    'images/wedding/PQD07012.jpg',
    'images/wedding/PQD07034.jpg',
    'images/wedding/PQD07040.jpg',
    'images/wedding/PQD07057.jpg',
    'images/wedding/PQD07109.jpg',
    'images/wedding/PQD07117.jpg',
    'images/wedding/PQD07139.jpg',
    'images/wedding/PQD07161.jpg',
    'images/wedding/PQD07174.jpg',
    'images/wedding/PQD07266.jpg'
  ],
  groom: [
    'images/wedding/PQD06734.jpg',
    'images/wedding/PQD07161.jpg',
    'images/wedding/PQD07174.jpg'
  ],
  bride: [
    'images/wedding/PQD06742.jpg',
    'images/wedding/PQD07266.jpg',
    'images/wedding/PQD06805.jpg'
  ]
};

// ==========================================
// 2. AUDIO & ENVELOPE OPENING EFFECT
// ==========================================
const audio = document.getElementById('wedding-audio');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const envelopeOverlay = document.getElementById('envelope-overlay');
const openEnvelopeBtn = document.getElementById('open-envelope-btn');

let isAudioPlaying = false;

function playAudio() {
  if (!audio) return;
  audio.play().then(() => {
    isAudioPlaying = true;
    audioToggleBtn.classList.add('spinning');
    audioToggleBtn.classList.remove('paused');
  }).catch(err => {
    console.log('Autoplay blocked, waiting for interaction:', err);
  });
}

function pauseAudio() {
  if (!audio) return;
  audio.pause();
  isAudioPlaying = false;
  audioToggleBtn.classList.remove('spinning');
  audioToggleBtn.classList.add('paused');
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

// Envelope Opening
if (openEnvelopeBtn) {
  openEnvelopeBtn.addEventListener('click', () => {
    playAudio();
    if (envelopeOverlay) {
      envelopeOverlay.classList.add('opened');
      setTimeout(() => {
        envelopeOverlay.style.display = 'none';
      }, 1200);
    }
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
  // Groom wedding: 10:00 AM on 06/06/2026
  const targetGroom = new Date(2026, 5, 6, 10, 0, 0).getTime();
  // Bride wedding: 10:00 AM on 05/06/2026
  const targetBride = new Date(2026, 5, 5, 10, 0, 0).getTime();

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

  if (popupId === 'popup-video') {
    const iframe = document.getElementById('wedding-video-iframe');
    if (iframe) {
      iframe.src = 'https://www.youtube.com/embed/vt-YPnXV8WM?autoplay=1&enablejsapi=1';
    }
  }

  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  if (popupId === 'popup-video') {
    const iframe = document.getElementById('wedding-video-iframe');
    if (iframe) {
      iframe.src = ''; // Stop video playback
    }
  }

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
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  window.open(url, '_blank');
}

function shareInvitation() {
  if (navigator.share) {
    navigator.share({
      title: 'Lễ Cưới Xuân Thịnh & Diễm Hằng',
      text: 'Trân trọng kính mời bạn và người thương đến tham dự lễ cưới của chúng tôi!',
      url: window.location.href
    }).catch(err => console.log('Share canceled:', err));
  } else {
    copyToClipboard(window.location.href, 'Đã sao chép link thiệp cưới!');
  }
}

// ==========================================
// 10. GUESTBOOK (SỔ LƯU BÚT)
// ==========================================
const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Long',
    message: 'Chúc mừng hạnh phúc hai bạn! Trăm năm hạnh phúc, đầu bạc răng long và luôn rạng ngời nụ cười như ngày hôm nay nhé 🎉',
    time: '2 ngày trước',
    likes: 12,
    liked: false
  },
  {
    id: 2,
    name: 'Trần Phương Thảo',
    message: 'Chúc hai bạn một đời an yên, luôn yêu thương, nhường nhịn và đồng hành cùng nhau trên mọi nẻo đường đời 🥰',
    time: '3 ngày trước',
    likes: 9,
    liked: false
  },
  {
    id: 3,
    name: 'Lê Quang Huy',
    message: 'Chúc mừng chú rể đẹp trai nhất năm và cô dâu xinh đẹp! Sớm cho anh em ăn cỗ đầy tháng nhé 👨‍👩‍👧',
    time: '5 ngày trước',
    likes: 15,
    liked: false
  },
  {
    id: 4,
    name: 'Đỗ Thanh Hằng',
    message: 'Mừng ngày chung đôi của hai người bạn thân thiết! Chúc tổ ấm nhỏ luôn tràn ngập tiếng cười và hạnh phúc viên mãn ❤️',
    time: '1 tuần trước',
    likes: 8,
    liked: false
  }
];

let wishesList = [];

function loadWishes() {
  try {
    const saved = localStorage.getItem('wedding_bustle_wishes');
    if (saved) {
      wishesList = JSON.parse(saved);
    } else {
      wishesList = DEFAULT_WISHES;
      localStorage.setItem('wedding_bustle_wishes', JSON.stringify(wishesList));
    }
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

  listEl.innerHTML = '';
  wishesList.forEach(w => {
    const item = document.createElement('div');
    item.className = 'wish-card-item';
    item.innerHTML = `
      <div class="wish-card-header">
        <span class="wish-sender-name">${escapeHTML(w.name)}</span>
        <span class="wish-card-time">${escapeHTML(w.time)}</span>
      </div>
      <p class="wish-card-text">${escapeHTML(w.message)}</p>
      <div class="wish-card-footer">
        <div class="wish-like-btn ${w.liked ? 'liked' : ''}" onclick="toggleLikeWish(${w.id})">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="${w.liked ? '#e74c3c' : 'currentColor'}">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>${w.likes}</span>
        </div>
      </div>
    `;
    listEl.appendChild(item);
  });
}

function toggleLikeWish(id) {
  const item = wishesList.find(w => w.id === id);
  if (!item) return;

  item.liked = !item.liked;
  item.likes += item.liked ? 1 : -1;
  localStorage.setItem('wedding_bustle_wishes', JSON.stringify(wishesList));
  renderWishes();
}

function applyWishChip(btn) {
  const textarea = document.getElementById('wish-message');
  if (textarea) {
    textarea.value = btn.textContent.trim();
    textarea.focus();
  }
}

function handleWishSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wish-name');
  const msgInput = document.getElementById('wish-message');

  const name = nameInput.value.trim();
  const message = msgInput.value.trim();

  if (!name || !message) {
    showToast('Vui lòng nhập họ tên và lời chúc');
    return;
  }

  const newWish = {
    id: Date.now(),
    name: name,
    message: message,
    time: 'Vừa xong',
    likes: 1,
    liked: true
  };

  wishesList.unshift(newWish);
  localStorage.setItem('wedding_bustle_wishes', JSON.stringify(wishesList));
  renderWishes();

  nameInput.value = '';
  msgInput.value = '';
  showToast('Cảm ơn bạn đã gửi lời chúc phúc ý nghĩa! ❤️');
}

// ==========================================
// 11. RSVP FORM SUBMISSION
// ==========================================
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
  scrollToSection('section-rsvp');
}

function handleRSVPSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const email = document.getElementById('rsvp-email').value.trim();
  const attendance = document.getElementById('rsvp-attendance').value;
  const guestOf = document.getElementById('rsvp-guest-of').value;
  const guestCount = document.getElementById('rsvp-guest-count').value;
  const eventTarget = document.getElementById('rsvp-event-target').value;

  const rsvpData = {
    name, email, attendance, guestOf, guestCount, eventTarget,
    submittedAt: new Date().toISOString()
  };

  try {
    const list = JSON.parse(localStorage.getItem('wedding_rsvp_entries') || '[]');
    list.push(rsvpData);
    localStorage.setItem('wedding_rsvp_entries', JSON.stringify(list));
  } catch (err) {
    console.error(err);
  }

  showToast(`Cảm ơn bạn ${name} đã gửi xác nhận tham dự! Chúc bạn nhiều niềm vui! 🎉`);
  e.target.reset();
}

// ==========================================
// 12. FLOATING PROMPT & SCROLL UTILITIES
// ==========================================
function dismissPrompt() {
  const prompt = document.getElementById('floating-rsvp-prompt');
  if (prompt) prompt.style.display = 'none';
}

function handleScrollPrompt() {
  const prompt = document.getElementById('floating-rsvp-prompt');
  if (!prompt || prompt.style.display === 'none') return;

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
// 14. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initFallingParticles();
  initCountdownTimers();
  loadWishes();
});
