const youtubedl = require('youtube-dl-exec');

async function test() {
    try {
        console.log("Fetching info...");
        const output = await youtubedl('https://www.youtube.com/watch?v=Nskf70DMR60', {
            dumpJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com']
        });
        console.log("Title:", output.title);
        console.log("Formats:", output.formats.length);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
