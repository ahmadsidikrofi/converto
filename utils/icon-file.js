'use client'
import { FileCloud, FilePdf, FileVideo, Images, MusicNotes } from "@phosphor-icons/react";
// import { VideoIcon, SpeakerLoudIcon, ImageIcon, FileIcon } from "@radix-ui/react-icons";

export default function IconFile(file_type) {
    if (file_type.includes('image')) return <Images className='w-5 h-5' weight="fill" />
    else if (file_type.includes('video')) return <FileVideo className='w-5 h-5' weight="fill" />
    else if (file_type.includes('audio')) return <MusicNotes className='w-5 h-5' weight="fill" />
    else return <FileCloud weight="fill" />
}