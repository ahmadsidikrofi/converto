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
export default async function ConvertFile(ffmpeg, action) {
    const { file, to, file_name, file_type } = action
    const input = getFileExtension(file_name)
    const output = removeFileExt(file_name) + '.' + to
    ffmpeg.writeFile(input, await fetchFile(file))

    // FFMEG COMMANDS
    let ffmpeg_cmd = [];

    if (to === '3gp') {
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
            output,
        ];
    } else if (['mp4', 'm4v', 'mov', 'mkv'].includes(to)) {
        // Ultrafast preset for x264 in WASM
        ffmpeg_cmd = [
            '-i', input,
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '28',
            '-c:a', 'aac',
            '-b:a', '128k',
            output,
        ];
    } else if (to === 'avi') {
        ffmpeg_cmd = [
            '-i', input,
            '-c:v', 'mpeg4',
            '-vtag', 'XVID',
            '-q:v', '6',
            '-c:a', 'libmp3lame',
            output,
        ];
    } else if (to === 'webm') {
        ffmpeg_cmd = [
            '-i', input,
            '-c:v', 'libvpx',
            '-crf', '32',
            '-b:v', '1M',
            '-c:a', 'libvorbis',
            output,
        ];
    } else if (['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'].includes(to)) {
        // Fast audio extraction (-vn removes video stream processing)
        ffmpeg_cmd = ['-i', input, '-vn', output];
    } else {
        ffmpeg_cmd = ['-i', input, output];
    }

    // execute cmd
    await ffmpeg.exec(ffmpeg_cmd)

    const data = await ffmpeg.readFile(output)
    const blob = new Blob([data], { type: file_type.split('/')[0] })
    const url = URL.createObjectURL(blob)
    return { url, output }
}