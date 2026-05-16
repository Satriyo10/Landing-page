// Data Dummy Geografis Kota Malang untuk Simulasi Log Feed
const KECAMATAN_MALANG = ['Klojen', 'Lowokwaru', 'Blimbing', 'Sukun', 'Kedungkandang'];

// Ambil element DOM
const logTableBody = document.getElementById('logTableBody');
const logCounterEl = document.getElementById('logCounter');
const attackCounterEl = document.getElementById('attackCounter');

// Inisialisasi Data Counter Awal
let totalLogs = 1249802;
let totalAttacks = 3;

// Helper untuk format angka ribuan (e.g. 1,000,000)
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

    // 2. Probabilitas Kejadian Serangan MITM (Misal: 15% kemungkinan terjadi serangan baru)
    const isAttack = Math.random() < 0.15;
    const randomKecamatan = KECAMATAN_MALANG[Math.floor(Math.random() * KECAMATAN_MALANG.length)];
    const timestamp = getCurrentTimestamp();

    let newRowHtml = '';

    if (isAttack) {
        // Jika status terdeteksi serangan MITM (Mismatch Token Hash Log)
        totalAttacks += 1;
        attackCounterEl.textContent = totalAttacks;

        // Simulasi IP Hacker acak
        const randomIP = `182.253.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

        newRowHtml = `
            <tr class="animate-attack-log bg-red-500/5">
                <td class="py-2.5 text-red-400 font-bold">${timestamp}</td>
                <td class="text-red-400">${randomKecamatan}</td>
                <td><span class="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-500/30">MISMATCH (MITM)</span></td>
                <td class="text-right text-red-400 font-bold">IP: ${randomIP} Traced</td>
            </tr>
        `;
    } else {
        // Jika status normal (Log Sinkron/Matched)
        newRowHtml = `
            <tr class="animate-new-log">
                <td class="py-2.5">${timestamp}</td>
                <td>${randomKecamatan}</td>
                <td><span class="text-cyberAccent font-bold">MATCHED</span></td>
                <td class="text-right text-gray-500">No Anomaly</td>
            </tr>
        `;
    }

    // Masukkan baris baru di paling atas tabel feed dashboard
    logTableBody.insertAdjacentHTML('afterbegin', newRowHtml);

    // Batasi jumlah baris dalam tabel biar tidak terlalu panjang ke bawah (maksimal 8 baris)
    if (logTableBody.children.length > 8) {
        logTableBody.removeChild(logTableBody.lastChild);
    }
}

// Jalankan simulasi generator log setiap 3 detik sekali
setInterval(generateLiveLog, 3000);

// Jalankan sekali di awal saat halaman berhasil dimuat
document.addEventListener('DOMContentLoaded', () => {
    logCounterEl.textContent = formatNumber(totalLogs);
    attackCounterEl.textContent = totalAttacks;
});