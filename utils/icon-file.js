import { VideoIcon, SpeakerLoudIcon, ImageIcon, FileIcon } from "@radix-ui/react-icons";

export default function IconFile(file_type) {
    if (file_type.includes('image')) return <ImageIcon className="w-5 h-5"/>
    else if (file_type.includes('video')) return <VideoIcon className="w-5 h-5"/>
    else if (file_type.includes('audio')) return <SpeakerLoudIcon className="w-5 h-5"/>
    else return <FileIcon />
}