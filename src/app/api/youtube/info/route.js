import { NextResponse } from "next/server";
import play from 'play-dl';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const info = await play.video_info(url);
        
        // Extract basic metadata
        const title = info.video_details.title;
        const author = info.video_details.channel.name;
        const duration = info.video_details.durationInSec;
        
        // Get the best thumbnail
        const thumbnails = info.video_details.thumbnails;
        const bestThumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : null;

        // Parse and categorize formats for the frontend
        // Get MP4 Formats (Video + Audio combined)
        const formats = info.format;
        
        const videoFormats = formats
            .filter(f => f.mimeType?.includes('video/mp4') && f.hasAudio && f.hasVideo)
            .map(format => ({
                itag: format.itag,
                qualityLabel: format.qualityLabel,
                mimeType: format.mimeType,
                hasAudio: format.hasAudio,
                hasVideo: format.hasVideo,
            }))
            // Sort by resolution descending
            .sort((a, b) => {
                const resA = parseInt(a.qualityLabel || '0');
                const resB = parseInt(b.qualityLabel || '0');
                return resB - resA;
            });

        // Filter out duplicate quality labels to keep UI clean
        const uniqueVideoFormats = [];
        const seenQualities = new Set();
        for (const format of videoFormats) {
            if (!seenQualities.has(format.qualityLabel)) {
                seenQualities.add(format.qualityLabel);
                uniqueVideoFormats.push(format);
            }
        }

        // Get Audio formats (for MP3 conversion later)
        let rawAudioFormats = formats.filter(f => f.mimeType?.includes('audio/'));
        if (rawAudioFormats.length === 0) {
            rawAudioFormats = formats.filter(f => f.hasAudio || (f.audioBitrate && f.audioBitrate > 0));
        }

        const audioFormats = rawAudioFormats
            .map(format => ({
                itag: format.itag,
                audioBitrate: format.audioBitrate || parseInt(format.bitrate / 1000) || 128,
                mimeType: format.mimeType,
                hasAudio: true,
                hasVideo: false,
            }))
            // Sort by bitrate descending
            .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

        const data = {
            title,
            author,
            duration,
            thumbnail: bestThumbnail,
            videoFormats: uniqueVideoFormats,
            bestAudioFormat: audioFormats.length > 0 ? audioFormats[0] : null
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching YouTube info:", error);
        return NextResponse.json({ error: "Gagal mengambil informasi video. Video mungkin private, age-restricted, atau tidak tersedia." }, { status: 500 });
    }
}
