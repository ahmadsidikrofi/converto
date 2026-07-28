import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Action } from "../types.d";

const getFileExtension = ( file_name) => {
    const regex = /(?:\.([^.]+))?$/
    const match = regex.exec(file_name)
    if (match && match[1]) {
      return match[1]
    }
    return ''
}
const removeFileExt = (file_name) => {
    const lastDotIndex = file_name.lastIndexOf('.')
    if (lastDotIndex !== -1) {
      return file_name.slice(0, lastDotIndex)
    }
    return file_name // No file extension found
}
const convertImageNative = async (file, to, outputName) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                const targetMime = (to === 'jpg' || to === 'jpeg') ? 'image/jpeg' : `image/${to}`;

                // If converting to JPG/JPEG, fill background with clean white so transparent PNGs don't turn black or crash
                if (targetMime === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject(new Error("Canvas toBlob failed during image conversion"));
                    }
                    const url = URL.createObjectURL(blob);
                    resolve({ url, output: outputName });
                }, targetMime, 0.95); // High quality 95% output
            };
            img.onerror = (err) => {
                reject(new Error("Failed to load image for native conversion: " + err));
            };
            img.src = event.target.result;
        };
        reader.onerror = (err) => {
            reject(new Error("Failed to read image file: " + err));
        };
        reader.readAsDataURL(file);
    });
};

export default async function ConvertFile(ffmpeg, action) {
    const { file, to, file_name, file_type } = action
    const ext = getFileExtension(file_name)
    const inputExt = ext.toLowerCase()
    const userOutputName = removeFileExt(file_name) + '.' + to
    
    // NATIVE BROWSER CANVAS ENGINE FOR STILL IMAGES:
    // Bypasses WASM memory boundary constraints & handles transparent PNGs and odd dimensions instantly
    const nativeImageInputExts = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'svg'];
    const nativeImageOutputExts = ['jpg', 'jpeg', 'png', 'webp'];
    
    if (nativeImageInputExts.includes(inputExt) && nativeImageOutputExts.includes(to.toLowerCase())) {
        try {
            return await convertImageNative(file, to.toLowerCase(), userOutputName);
        } catch (nativeErr) {
            console.warn("Native canvas image conversion fallback to FFmpeg:", nativeErr);
        }
    }

    const uniqueId = Date.now() + "_" + Math.random().toString(36).substring(2, 7)
    const input = `in_${uniqueId}.${ext}`
    const wasmOutput = `out_${uniqueId}.${to}`

    await ffmpeg.writeFile(input, await fetchFile(file))

    // FFMEG COMMANDS
    let ffmpeg_cmd = [];
    const modernContainers = ['mp4', 'm4v', 'mov', 'mkv'];

    if (modernContainers.includes(to) && modernContainers.includes(inputExt)) {
        // Lightning-fast lossless stream remuxing (prevents CPU overhead & WASM memory crashes)
        ffmpeg_cmd = ['-i', input, '-c', 'copy', wasmOutput];
    } else if (to === '3gp') {
        ffmpeg_cmd = [
            '-i', input,
            '-r', '20',
            '-s', '352x288',
            '-vb', '400k',
            '-acodec', 'aac',
            '-strict', 'experimental',
            '-ac', '1',
            '-ar', '8000',
            '-ab', '24k',
            '-threads', '1',
            wasmOutput,
        ];
    } else if (modernContainers.includes(to)) {
        // Ultrafast preset for x264 with single thread limit to prevent WASM heap OOB
        ffmpeg_cmd = [
            '-i', input,
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '28',
            '-threads', '1',
            '-c:a', 'aac',
            '-b:a', '128k',
            wasmOutput,
        ];
    } else if (to === 'avi') {
        ffmpeg_cmd = [
            '-i', input,
            '-c:v', 'mpeg4',
            '-vtag', 'XVID',
            '-q:v', '6',
            '-threads', '1',
            '-c:a', 'libmp3lame',
            wasmOutput,
        ];
    } else if (to === 'webm') {
        // Reliable standard VP8/Vorbis encoding with single thread limit for WASM
        ffmpeg_cmd = [
            '-i', input,
            '-f', 'webm',
            '-c:v', 'libvpx',
            '-b:v', '1.5M',
            '-threads', '1',
            '-c:a', 'libvorbis',
            '-ar', '44100',
            wasmOutput,
        ];
    } else if (['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'].includes(to)) {
        // Fast audio extraction (-vn removes video stream processing)
        ffmpeg_cmd = ['-i', input, '-vn', wasmOutput];
    } else if (['jpg', 'jpeg'].includes(to)) {
        // JPG/JPEG requires EVEN resolution dimensions (divisible by 2) for YUV subsampling and alpha padding
        ffmpeg_cmd = [
            '-i', input,
            '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2:color=white',
            '-q:v', '2',
            '-pix_fmt', 'yuv420p',
            wasmOutput,
        ];
    } else if (to === 'ico') {
        // ICO icons require standard resolution limits (max 256x256) in FFmpeg
        ffmpeg_cmd = [
            '-i', input,
            '-vf', 'scale=256:256:force_original_aspect_ratio=decrease',
            wasmOutput,
        ];
    } else {
        // Default image/general processing
        ffmpeg_cmd = ['-i', input, wasmOutput];
    }

    try {
        // execute cmd
        await ffmpeg.exec(ffmpeg_cmd)

        const data = await ffmpeg.readFile(wasmOutput)
        const blob = new Blob([data], { type: file_type.split('/')[0] })
        const url = URL.createObjectURL(blob)
        return { url, output: userOutputName }
    } finally {
        // Clean up MEMFS filesystem immediately in finally block to guarantee free RAM even on error
        try { await ffmpeg.deleteFile(input); } catch (e) {}
        try { await ffmpeg.deleteFile(wasmOutput); } catch (e) {}
    }
}