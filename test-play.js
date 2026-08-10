const play = require('play-dl');

async function test() {
    try {
        const info = await play.video_info("https://www.youtube.com/watch?v=Nskf70DMR60");
        console.log("Title:", info.video_details.title);
        const formats = info.format;
        const videoFormats = formats.filter(f => f.hasAudio && f.hasVideo);
        const audioFormats = formats.filter(f => !f.hasVideo && f.hasAudio);
        console.log("Video formats:", videoFormats.length);
        console.log("Audio formats:", audioFormats.length);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
