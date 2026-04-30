// ============================================================
//  FFCS Timetable Builder — script.js v2.0.1
// ============================================================

let selectedColor = '#caf0f8';
let timetableHistory = [];
let historyIndex = -1;
let selectedSlots = new Set();
let isNightMode = false;
let searchDebounceTimer = null;

// DOM
const slots           = document.querySelectorAll('.slot');
const colorOptions    = document.querySelectorAll('.color-option');
const colorPalette    = document.getElementById('colorPalette');
const searchInput     = document.getElementById('searchSlot');
const clearSearchBtn  = document.getElementById('clearSearch');
const customColorInput= document.getElementById('customColor');
const applyCustomBtn  = document.getElementById('applyCustom');
const nightToggleBtn  = document.getElementById('nightToggleBtn');
const searchWrapper   = document.querySelector('.search-wrapper');
const searchBadge     = document.querySelector('.search-badge');

// Tool buttons
const newBtn      = document.getElementById('newBtn');
const deleteBtn   = document.getElementById('deleteBtn');
const undoBtn     = document.getElementById('undoBtn');
const redoBtn     = document.getElementById('redoBtn');
const resetBtn    = document.getElementById('resetBtn');
const colorBtn    = document.getElementById('colorBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Mobile
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileCloseBtn   = document.getElementById('mobileCloseBtn');
const sidebar          = document.getElementById('sidebar');

// Modal
const downloadModal = document.getElementById('downloadModal');
const closeModal    = document.getElementById('closeModal');
const formatButtons = document.querySelectorAll('.format-btn');

// ── INIT ──────────────────────────────────────────────────
function init() {
    saveState();
    setupEventListeners();
    setupMobileMenu();
    loadFromLocalStorage();
    loadNightMode();
}

// ── NIGHT MODE ─────────────────────────────────────────────
function loadNightMode() {
    if (localStorage.getItem('nightMode') === 'true') enableNightMode(false);
}
function enableNightMode(animate = true) {
    isNightMode = true;
    if (animate) document.body.style.transition = 'background-color 0.40s ease, color 0.40s ease';
    document.body.classList.add('night-mode');
    if (nightToggleBtn) {
        nightToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        nightToggleBtn.title = 'Switch to Light Mode';
    }
    localStorage.setItem('nightMode', 'true');
}
function disableNightMode() {
    isNightMode = false;
    document.body.classList.remove('night-mode');
    if (nightToggleBtn) {
        nightToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        nightToggleBtn.title = 'Switch to Night Mode';
    }
    localStorage.setItem('nightMode', 'false');
}
function toggleNightMode() {
    isNightMode ? disableNightMode() : enableNightMode();
}

// ── MOBILE MENU ────────────────────────────────────────────
function setupMobileMenu() {
    mobileMenuToggle?.addEventListener('click', openMobileMenu);
    mobileCloseBtn?.addEventListener('click', closeMobileMenu);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('.tool-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768) setTimeout(closeMobileMenu, 110);
        })
    );
}
function openMobileMenu()  { sidebar.classList.add('active');    document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { sidebar.classList.remove('active'); document.body.style.overflow = 'auto';   }

// ── EVENT LISTENERS ────────────────────────────────────────
function setupEventListeners() {
    nightToggleBtn?.addEventListener('click', toggleNightMode);

    colorBtn.addEventListener('click', () => colorPalette.classList.toggle('active'));

    colorOptions.forEach(opt => opt.addEventListener('click', function() {
        colorOptions.forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectedColor = this.dataset.color;
    }));

    applyCustomBtn.addEventListener('click', () => {
        selectedColor = customColorInput.value;
        colorOptions.forEach(o => o.classList.remove('selected'));
    });

    // Slot interactions
    slots.forEach(slot => {
        slot.addEventListener('click', function(e) {
            if (this.classList.contains('highlight')) {
                this.classList.remove('highlight', 'highlight-pop');
                return;
            }
            if (e.ctrlKey || e.metaKey) {
                this.classList.toggle('selected');
                this.classList.contains('selected') ? selectedSlots.add(this) : selectedSlots.delete(this);
            } else {
                selectedSlots.forEach(s => s.classList.remove('selected'));
                selectedSlots.clear();
                this.style.backgroundColor = selectedColor;
                this.style.color = getContrastColor(selectedColor);
                saveState();
            }
        });

        slot.addEventListener('dblclick', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
            this.textContent = '';
            this.classList.remove('highlight','highlight-pop','selected');
            selectedSlots.delete(this);
            saveState();
        });

        slot.addEventListener('blur', () => saveState());

        slot.addEventListener('touchend', function(e) {
            if (e.cancelable) e.preventDefault();
            this.focus();
        }, { passive: false });
    });

    // Search — debounced for smooth feel
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        const val = e.target.value.trim();

        // toggle has-value class for pulse animation
        searchWrapper.classList.toggle('has-value', val.length > 0);

        if (!val) {
            clearSearchVisuals();
            hideBadge();
            return;
        }
        searchDebounceTimer = setTimeout(() => handleSearch(val), 120);
    });

    clearSearchBtn.addEventListener('click', clearSearch);
    newBtn.addEventListener('click', createNew);
    deleteBtn.addEventListener('click', deleteSelected);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    resetBtn.addEventListener('click', reset);
    downloadBtn.addEventListener('click', showDownloadModal);

    closeModal.addEventListener('click', hideDownloadModal);
    downloadModal.addEventListener('click', (e) => { if (e.target === downloadModal) hideDownloadModal(); });

    formatButtons.forEach(btn => btn.addEventListener('click', function() {
        downloadTimetable(this.dataset.format);
        hideDownloadModal();
    }));

    document.addEventListener('keydown', handleKeyboardShortcuts);
    window.addEventListener('resize', () => { if (window.innerWidth > 768) { closeMobileMenu(); document.body.style.overflow='auto'; } });
}

// ── SEARCH ─────────────────────────────────────────────────
function handleSearch(term) {
    const upperTerm = term.toUpperCase();
    let matches = [];

    slots.forEach(slot => {
        slot.classList.remove('highlight', 'highlight-pop');
        const name    = slot.dataset.slot.toUpperCase();
        const content = slot.textContent.toUpperCase();
        if (name.includes(upperTerm) || content.includes(upperTerm)) {
            slot.classList.add('highlight');
            matches.push(slot);
        }
    });

    if (matches.length === 0) {
        // shake the search bar
        searchWrapper.classList.remove('no-result');
        void searchWrapper.offsetWidth; // reflow to retrigger
        searchWrapper.classList.add('no-result');
        searchWrapper.addEventListener('animationend', () => searchWrapper.classList.remove('no-result'), { once: true });
        hideBadge();
        return;
    }

    // pop animation on first match
    matches[0].classList.add('highlight-pop');
    matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });

    // show match count badge
    showBadge(matches.length);
}

function clearSearchVisuals() {
    slots.forEach(s => s.classList.remove('highlight','highlight-pop'));
}

function clearSearch() {
    searchInput.value = '';
    searchWrapper.classList.remove('has-value');
    clearSearchVisuals();
    hideBadge();
    searchInput.focus();
}

function showBadge(count) {
    if (!searchBadge) return;
    searchBadge.textContent = count === 1 ? '1 match' : `${count} matches`;
    searchBadge.classList.add('visible');
}
function hideBadge() {
    searchBadge?.classList.remove('visible');
}

// ── MODAL ──────────────────────────────────────────────────
function showDownloadModal() {
    downloadModal.classList.add('open');
    downloadModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function hideDownloadModal() {
    downloadModal.style.display = 'none';
    downloadModal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// ── TOOLS ──────────────────────────────────────────────────
function createNew() {
    if (!confirm('Create a new timetable? Current data will be saved to history.')) return;
    saveState();
    slots.forEach(s => { s.style.backgroundColor=''; s.style.color=''; s.textContent=''; });
    selectedSlots.clear();
    clearSearch();
    saveToLocalStorage();
    showToast('New timetable created.', 'success');
}

function deleteSelected() {
    if (selectedSlots.size === 0) { showToast('Hold Ctrl/Cmd + click to select slots first.', 'info'); return; }
    saveState();
    selectedSlots.forEach(s => {
        s.style.backgroundColor=''; s.style.color=''; s.textContent='';
        s.classList.remove('selected');
    });
    selectedSlots.clear();
    saveToLocalStorage();
    showToast('Selected slots cleared.', 'success');
}

function reset() {
    if (!confirm('Reset the entire timetable? All data will be cleared.')) return;
    saveState();
    slots.forEach(s => {
        s.style.backgroundColor=''; s.style.color=''; s.textContent='';
        s.classList.remove('selected','highlight','highlight-pop');
    });
    selectedSlots.clear();
    clearSearch();
    localStorage.removeItem('timetableData');
    showToast('Timetable has been reset.', 'success');
}

// ── HISTORY ────────────────────────────────────────────────
function saveState() {
    const state = { slots: Array.from(slots).map(s => ({ content:s.textContent, bg:s.style.backgroundColor, color:s.style.color })) };
    timetableHistory = timetableHistory.slice(0, historyIndex + 1);
    timetableHistory.push(state);
    historyIndex++;
    if (timetableHistory.length > 60) { timetableHistory.shift(); historyIndex--; }
    saveToLocalStorage();
}
function undo() {
    if (historyIndex > 0) { historyIndex--; restoreState(timetableHistory[historyIndex]); showToast('Undo.','info'); }
    else showToast('Nothing to undo.','info');
}
function redo() {
    if (historyIndex < timetableHistory.length - 1) { historyIndex++; restoreState(timetableHistory[historyIndex]); showToast('Redo.','info'); }
    else showToast('Nothing to redo.','info');
}
function restoreState(state) {
    state.slots.forEach((d,i) => {
        if (slots[i]) { slots[i].textContent=d.content||''; slots[i].style.backgroundColor=d.bg||''; slots[i].style.color=d.color||''; }
    });
}

// ── LOCAL STORAGE ──────────────────────────────────────────
function saveToLocalStorage() {
    localStorage.setItem('timetableData', JSON.stringify({
        slots: Array.from(slots).map(s => ({ content:s.textContent, bg:s.style.backgroundColor, color:s.style.color })),
        ts: Date.now()
    }));
}
function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem('timetableData');
        if (!raw) return;
        const data = JSON.parse(raw);
        data.slots.forEach((d,i) => {
            if (slots[i]) { slots[i].textContent=d.content||''; slots[i].style.backgroundColor=d.bg||''; slots[i].style.color=d.color||''; }
        });
    } catch(e) { console.error('Load error:',e); }
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg, type='info') {
    document.querySelector('.tt-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'tt-toast';
    const icons  = { success:'fa-check-circle', info:'fa-info-circle', error:'fa-exclamation-circle' };
    const colors = { success:'#1565c0', info:'#1976d2', error:'#e53935' };
    toast.innerHTML = `<i class="fas ${icons[type]||icons.info}"></i> ${msg}`;
    Object.assign(toast.style, {
        position:'fixed', bottom:'26px', right:'26px',
        background: colors[type]||colors.info, color:'#fff',
        padding:'12px 20px', borderRadius:'10px',
        fontSize:'0.91rem', fontWeight:'500',
        boxShadow:'0 6px 22px rgba(0,0,0,0.22)',
        zIndex:'9999', display:'flex', alignItems:'center', gap:'9px',
        opacity:'0', transform:'translateY(14px)',
        transition:'opacity 0.26s ease, transform 0.26s ease',
        maxWidth:'320px', pointerEvents:'none', fontFamily:'inherit'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateY(0)'; });
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(10px)'; setTimeout(()=>toast.remove(),320); }, 2600);
}

// ── DOWNLOAD ───────────────────────────────────────────────
async function downloadTimetable(format) {
    const fn = `FFCS_Timetable_${new Date().toISOString().split('T')[0]}`;
    try {
        if (format==='html') downloadAsHTML(fn);
        else if (format==='png')  await downloadAsImage(fn,'png');
        else if (format==='jpg')  await downloadAsImage(fn,'jpeg');
        else if (format==='pdf')  await downloadAsPDF(fn);
    } catch(e) { console.error(e); showToast('Download failed. Try again.','error'); }
}

function downloadAsHTML(fn) {
    const clone = document.getElementById('timetable').cloneNode(true);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FFCS Timetable</title>
<style>
body{font-family:'Segoe UI',Arial,sans-serif;padding:20px;background:#eef5ff;display:flex;justify-content:center;min-height:100vh;}
.wrap{background:#fff;padding:30px;border-radius:16px;box-shadow:0 6px 28px rgba(21,101,192,0.14);}
h1{text-align:center;color:#1565c0;margin-bottom:20px;letter-spacing:4px;font-size:1.8rem;}
table{border-collapse:collapse;width:100%;background:#fff;}
th,td{border:1.5px solid #cfe3f7;padding:11px;text-align:center;}
th{background:linear-gradient(180deg,#1e88e5,#1565c0);color:#fff;font-weight:600;}
.lunch-column{background:linear-gradient(180deg,#7ac8f8,#42a5f5) !important;color:#fff;}
.day-column{background:linear-gradient(180deg,#1e88e5,#1565c0) !important;color:#fff !important;font-weight:700;}
.slot{background:#f4f9ff;min-height:50px;}
.footer{text-align:center;margin-top:24px;color:#1565c0;font-size:13px;}
</style></head><body>
<div class="wrap"><h1>FFCS TIMETABLE</h1>${clone.outerHTML}
<div class="footer"><strong>FFCS Timetable Builder</strong><br>Designed by Rishi Raj &nbsp;|&nbsp; v2.0.1<br>${new Date().toLocaleDateString()}</div>
</div></body></html>`;
    const link = document.createElement('a');
    link.download = fn+'.html';
    link.href = URL.createObjectURL(new Blob([html],{type:'text/html'}));
    link.click(); URL.revokeObjectURL(link.href);
    showToast('Downloaded as HTML!','success');
}

async function downloadAsImage(fn, fmt) {
    const el = document.getElementById('timetableCapture');
    const hl = document.querySelectorAll('.slot.highlight');
    hl.forEach(s=>s.classList.add('temp-no-highlight'));
    const canvas = await html2canvas(el,{scale:2,backgroundColor:'#ffffff',logging:false,useCORS:true});
    hl.forEach(s=>s.classList.remove('temp-no-highlight'));
    canvas.toBlob(blob=>{
        const link=document.createElement('a');
        link.download=fn+'.'+(fmt==='jpeg'?'jpg':'png');
        link.href=URL.createObjectURL(blob);
        link.click(); URL.revokeObjectURL(link.href);
        showToast(`Downloaded as ${fmt.toUpperCase()}!`,'success');
    },`image/${fmt}`,0.95);
}

async function downloadAsPDF(fn) {
    const el = document.getElementById('timetableCapture');
    const hl = document.querySelectorAll('.slot.highlight');
    hl.forEach(s=>s.classList.add('temp-no-highlight'));
    const canvas = await html2canvas(el,{scale:2,backgroundColor:'#ffffff',logging:false,useCORS:true});
    hl.forEach(s=>s.classList.remove('temp-no-highlight'));
    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const w=280, h=(canvas.height*w)/canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'),'PNG',10,10,w,h);
    pdf.save(fn+'.pdf');
    showToast('Downloaded as PDF!','success');
}

// ── KEYBOARD SHORTCUTS ──────────────────────────────────────
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey||e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'z': e.preventDefault(); e.shiftKey?redo():undo(); break;
            case 'y': e.preventDefault(); redo(); break;
            case 'n': e.preventDefault(); createNew(); break;
            case 'd': e.preventDefault(); deleteSelected(); break;
            case 'f': e.preventDefault(); searchInput.focus(); break;
            case 's': e.preventDefault(); saveToLocalStorage(); showToast('Saved!','success'); break;
        }
    }
    if (e.key==='Delete' && selectedSlots.size>0) deleteSelected();
    if (e.key==='Escape') {
        if (downloadModal.style.display==='flex') hideDownloadModal();
        if (window.innerWidth<=768 && sidebar.classList.contains('active')) closeMobileMenu();
    }
}

// ── UTILITY ────────────────────────────────────────────────
function getContrastColor(hex) {
    if (!hex||!hex.startsWith('#')||hex.length<7) return '#000000';
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return (0.299*r+0.587*g+0.114*b)/255 > 0.55 ? '#000000' : '#ffffff';
}

// ── LIFECYCLE ──────────────────────────────────────────────
setInterval(saveToLocalStorage, 30000);
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', saveToLocalStorage);
