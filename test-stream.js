// Quick test: spawn yt-dlp directly and count bytes received on stdout
const { spawn } = require('child_process');
const path = require('path');

const ytdlpPath = path.join(require.resolve('youtube-dl-exec'), '..', '..', 'bin', 'yt-dlp.exe');
console.log('yt-dlp path:', ytdlpPath);

const args = [
    'https://www.youtube.com/watch?v=noZAe-T96w8',
    '-f', 'bestaudio',
    '-o', '-',
    '--no-check-certificates',
    '--no-warnings'
];

console.log('Spawning yt-dlp...');
const child = spawn(ytdlpPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });

let totalBytes = 0;
child.stdout.on('data', (chunk) => {
    totalBytes += chunk.length;
    if (totalBytes % (1024 * 100) < chunk.length) {
        console.log(`Received ${(totalBytes / 1024).toFixed(0)} KB so far...`);
    }
});

child.stderr.on('data', (data) => {
    console.log('STDERR:', data.toString().trim());
});

child.on('close', (code) => {
    console.log(`\nProcess exited with code ${code}`);
    console.log(`Total bytes received: ${totalBytes} (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
});

child.on('error', (err) => {
    console.error('Spawn error:', err);
});
