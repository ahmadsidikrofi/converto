import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { Readable, PassThrough } from "stream";
import path from "path";

// Hardcode absolute path ke yt-dlp binary
// require.resolve() tidak bisa dipakai di Next.js webpack RSC karena path-nya ter-transform
const YTDLP_BIN = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');

// Endpoint ini akan melakukan proses streaming download langsung ke client
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const type = searchParams.get("type"); // 'mp4' atau 'mp3'
    const itag = searchParams.get("itag");

    if (!url) {
        return NextResponse.json({ error: "Link YouTube tidak valid atau kosong" }, { status: 400 });
    }

    try {
        // Langkah 1: Ambil judul video dulu via --dump-json (cepat, tanpa download)
        let cleanTitle = `download_${Date.now()}`;
        try {
            const titleJson = await new Promise((resolve, reject) => {
                const infoProc = spawn(YTDLP_BIN, [
                    url,
                    '--no-playlist',
                    '--dump-json',
                    '--no-check-certificates',
                    '--no-warnings'
                ], { stdio: ['ignore', 'pipe', 'ignore'] });

                let data = '';
                infoProc.stdout.on('data', (chunk) => { data += chunk.toString(); });
                infoProc.on('close', (code) => {
                    if (code === 0 && data) resolve(data);
                    else reject(new Error(`yt-dlp info exited with code ${code}`));
                });
                infoProc.on('error', reject);

                // Timeout 15 detik untuk info
                setTimeout(() => { infoProc.kill(); reject(new Error('Info timeout')); }, 15000);
            });
            const info = JSON.parse(titleJson);
            if (info.title) {
                cleanTitle = info.title.replace(/[^\w\s-]/gi, "").trim();
            }
        } catch (err) {
            console.warn("Gagal mendapatkan judul (fallback ke timestamp):", err.message);
        }

        const ext = type === 'mp3' ? 'mp3' : 'mp4';
        const filename = `${cleanTitle}.${ext}`;

        // Langkah 2: Spawn yt-dlp untuk streaming file ke stdout
        const formatArg = type === 'mp3'
            ? 'bestaudio'
            : (itag && itag !== 'undefined' && itag !== 'null') ? itag : 'best[ext=mp4]/best';

        const args = [
            url,
            '--no-playlist',
            '-f', formatArg,
            '-o', '-',
            '--no-check-certificates',
            '--no-warnings'
        ];

        console.log(`[download] Spawning yt-dlp: ${formatArg} for "${cleanTitle}"`);
        const child = spawn(YTDLP_BIN, args, { stdio: ['ignore', 'pipe', 'pipe'] });

        // Log stderr untuk debugging (tidak dikirim ke client)
        child.stderr.on('data', (data) => {
            const msg = data.toString().trim();
            if (msg && !msg.startsWith('[download]')) {
                console.log('[yt-dlp]', msg);
            }
        });

        // Bungkus stdout ke PassThrough lalu konversi ke Web ReadableStream
        const passthrough = new PassThrough();
        child.stdout.pipe(passthrough);

        child.on('error', (err) => {
            console.error('[yt-dlp spawn error]', err);
            passthrough.destroy(err);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`[yt-dlp] Process exited with code ${code}`);
            }
        });

        const webStream = Readable.toWeb(passthrough);

        // Setup Headers supaya browser memicu File Download
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        headers.set('Content-Type', type === 'mp3' ? 'audio/mpeg' : 'video/mp4');
        headers.set('Transfer-Encoding', 'chunked');

        return new Response(webStream, {
            headers,
            status: 200,
        });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json({ error: "Gagal mendownload video. Silakan coba lagi nanti." }, { status: 500 });
    }
}
