"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useEffect } from "react"
import Link from "next/link"
import { PostLikedCompTypes } from "@/app/types"

export default function PostLiked({post, id}: PostLikedCompTypes) {

    useEffect(() => {
        const video = document.getElementById(`video${post?.id}`) as HTMLVideoElement

        setTimeout(() => {
            video.addEventListener('mouseenter', () => { video.play() })
            video.addEventListener('mouseleave', () => { video.pause() })
        }, 50)

    }, [])

    return (
        <>
            <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
                {!post.videoUrl ? (
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                        <Link href={`/likes/${id}-${post.id}`}>
                        <video
                            id={`video${post.id}`}
                            muted
                            loop
                            playsInline
                            className="aspect-[3/4] object-cover rounded-md"
                            src={(post.videoUrl)}
                        />
                    </Link>
                )}

            </div>
        </>
    )
}