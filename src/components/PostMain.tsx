"use client";

import { PostMainCompTypes } from "@/app/types";
import { useEffect, useState } from "react";
import PostMainLikes from "./PostMainLikes";

export default function PostMain({ post }: PostMainCompTypes) {
    const [isMuted, setIsMuted] = useState(true);
    const [isReportOverlayVisible, setIsReportOverlayVisible] = useState(true);
    const [views, setViews] = useState<number>(parseInt(post.views, 10) || 0);

    const increaseViews = async () => {
        try {
            const response = await fetch(`/api/views/${post.id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const responseData = await response.json();
                // console.log(responseData);

                // Convertir la cadena a número y actualizar el estado con el número de views
                setViews(parseInt(responseData.count, 10) || 0);
            } else {
                console.error('Error al obtener el número de views:', response.statusText);
            }

        } catch (error) {
            console.error('Error al obtener el número de views:', error);
        }
    };

    useEffect(() => {
        const video = document.getElementById(`video-${post?.id}`) as HTMLVideoElement;
        const postMainElement = document.getElementById(`PostMain-${post.id}`);

        if (postMainElement) {
            let observer = new IntersectionObserver((entries) => {
                entries[0].isIntersecting ? (video.play(), increaseViews()) : video.pause();
            }, { threshold: [0.6] });

            observer.observe(postMainElement);
            return () => {
                if (observer) {
                    observer.disconnect();
                }
            };
        }
    }, []);

    const toggleMute = () => {
        const video = document.getElementById(`video-${post?.id}`) as HTMLVideoElement;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    return (
        <>
            <div
                id={`PostMain-${post.id}`}
                className="flex justify-center border-b h-[100dvh] sm:h-[calc(100dvh-3.5rem)] relative"
            >
                <div className="flex">
                    <video
                        id={`video-${post.id}`}
                        loop
                        playsInline
                        muted={isMuted}
                        className="object-cover"
                        style={{ width: '100%' }}
                        src={(post?.videoUrl)}
                    />
                    <div className="absolute bottom-0 ml-5 w-40 min-[300px]:w-64 min-[450px]:w-72 sm:w-96 lg:w-96">
                        <p className="text-white custom-shadow text-xs min-[400px]:text-sm sm:text-base lg:text-sm">{post.description}</p>
                        <p className="text-white mb-2 custom-shadow text-xs min-[400px]:text-sm sm:text-base lg:text-sm">{post.tag}</p>
                        <p className="text-white mb-4 custom-shadow text-xs min-[400px]:text-sm sm:text-base lg:text-sm">{post.views} views</p>
                    </div>
                </div>

                <PostMainLikes post={post} toggleMute={toggleMute} isMuted={isMuted} />
            </div>
        </>
    );
}