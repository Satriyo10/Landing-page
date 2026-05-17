// Data Dummy Geografis Kota Malang untuk Simulasi Log Feed
const KECAMATAN_MALANG = ['Klojen', 'Lowokwaru', 'Blimbing', 'Sukun', 'Kedungkandang'];

// Ambil element DOM
const logTableBody = document.getElementById('logTableBody');
const logCounterEl = document.getElementById('logCounter');
const attackCounterEl = document.getElementById('attackCounter');
const latencyValEl = document.getElementById('latencyVal');

// Inisialisasi Data Counter Awal
let totalLogs = 1249802;
let totalAttacks = 3;

// Helper untuk format angka ribuan (e.g. 1,249,802)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper untuk mendapatkan timestamp saat ini (format: YYYY-MM-DD HH:MM:SS)
function getCurrentTimestamp() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Fungsi Utama untuk Menghasilkan Log Aktivitas Baru secara Otomatis
function generateLiveLog() {
    // 1. Naikkan angka total log secara acak
    totalLogs += Math.floor(Math.random() * 4) + 1;
    logCounterEl.textContent = formatNumber(totalLogs);

    // 2. Simulasi Fluktuasi Latency Jaringan (e.g. 11ms - 28ms)
    const randomLatency = Math.floor(Math.random() * 17) + 11;
    latencyValEl.textContent = `${randomLatency}ms`;

    // 3. Probabilitas Kejadian Serangan MITM (15% kemungkinan terjadi interupsi)
    const isAttack = Math.random() < 0.15;
    const randomKecamatan = KECAMATAN_MALANG[Math.floor(Math.random() * KECAMATAN_MALANG.length)];
    const timestamp = getCurrentTimestamp();

    let newRowHtml = '';

    if (isAttack) {
        totalAttacks += 1;
        attackCounterEl.textContent = totalAttacks;

        // Buat Dummy IP lokal Jawa Timur / Malang secara acak
        const randomIP = `182.253.${Math.floor(Math.random() * 120) + 10}.${Math.floor(Math.random() * 254) + 1}`;

        newRowHtml = `
            <tr class="animate-attack-log bg-red-500/5">
                <td class="py-2.5 text-red-400 font-bold">${timestamp}</td>
                <td class="text-red-400">${randomKecamatan}</td>
                <td><span class="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-500/30">MISMATCH (MITM)</span></td>
                <td class="text-right text-red-400 font-bold">IP: ${randomIP} Traced</td>
            </tr>
        `;
    } else {
        newRowHtml = `
            <tr class="animate-new-log">
                <td class="py-2.5">${timestamp}</td>
                <td>${randomKecamatan}</td>
                <td><span class="text-cyberAccent font-medium">MATCHED</span></td>
                <td class="text-right text-gray-500">No Anomaly</td>
            </tr>
        `;
    }

    // Masukkan baris baru di paling atas tabel feed dashboard
    logTableBody.insertAdjacentHTML('afterbegin', newRowHtml);

    // ==========================================
    // BATASAN MAKSIMAL 20 LIST LOG (STRICT)
    // ==========================================
    if (logTableBody.children.length > 20) {
        // Hapus baris paling bawah (waktu paling awal) secara berkala
        logTableBody.removeChild(logTableBody.lastChild);
    }
}

// Jalankan simulasi generator log setiap 2.5 detik sekali agar dashboard terasa hidup
setInterval(generateLiveLog, 2500);

// Jalankan pengaturan awal saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    logCounterEl.textContent = formatNumber(totalLogs);
    attackCounterEl.textContent = totalAttacks;
});