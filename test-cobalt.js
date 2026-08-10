const fetch = require('node-fetch');

async function test() {
    const instances = [
        'https://api.cobalt.tools',
        'https://co.wuk.sh',
        'https://cobalt.api.engiy.co',
        'https://cobalt.q0.is',
        'https://api.cobalt.ac',
        'https://api.cobalt.tools/api/json',
        'https://cobalt-api.kwiatekos.pl',
        'https://api.cobalt.foo'
    ];

    for (const url of instances) {
        try {
            console.log("Testing:", url);
            let res = await fetch(url.endsWith('/api/json') ? url : url + '/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: "https://www.youtube.com/watch?v=Nskf70DMR60",
                    isAudioOnly: true,
                    aFormat: "mp3"
                })
            });
            let data = await res.text();
            console.log(url, "V7 API Response:", data);

            res = await fetch(url.endsWith('/api/json') ? url.replace('/api/json', '') : url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: "https://www.youtube.com/watch?v=Nskf70DMR60",
                    downloadMode: "audio",
                    audioFormat: "mp3"
                })
            });
            data = await res.text();
            console.log(url, "V11 API Response:", data);
        } catch (e) {
            console.log(url, "Failed", e.message);
        }
    }
}
test();
