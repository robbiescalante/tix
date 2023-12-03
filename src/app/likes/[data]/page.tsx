"use client"

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useRouter } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";
import PostMain from "@/components/PostMain";
import { Post } from "@/app/types";

const Post = ({ params }: { params: { data: string } }) => {
    const [post, setPost] = useState<Post | null>(null);
    const [loadedCount, setLoadedCount] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const router = useRouter();
    const [username, id] = params.data.split('-');
    const containerRef = useRef<HTMLDivElement>(null);

    // const loadMorePosts = async () => {
    //     if (loadedCount < 3 && posts.length > 0) {
    //         const currentIds = posts.map((post) => post.id).join(',');

    //         try {
    //             const res = await fetch(`/api/insertLikes/${username},${currentIds}`, {
    //                 cache: 'no-store',
    //             });

    //             if (!res.ok) {
    //                 throw new Error('Failed to fetch additional data');
    //             }

    //             const additionalPosts = await res.json();

    //             additionalPosts.shift();

    //             setPosts((prevPosts) => [...prevPosts, ...additionalPosts]);
    //             setLoadedCount((prevCount) => prevCount + 1);
    //         } catch (error) {
    //             console.error('Error loading more posts:', error);
    //         }
    //     }
    // };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/liked/${id}`, {
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await res.json();
            setPost(data);
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const container = containerRef.current;
    //         if (container) {
    //             const scrollPosition = container.scrollTop;
    //             const windowHeight = container.clientHeight;
    //             const scrollHeight = container.scrollHeight;

    //             const index = Math.floor((scrollPosition + windowHeight / 2) / windowHeight);
    //             setCurrentVideoIndex(index);

    //             if (scrollPosition + windowHeight >= scrollHeight && loadedCount < 4) {
    //                 loadMorePosts();
    //             }
    //         }
    //     };

    //     const container = containerRef.current;
    //     if (container) {
    //         container.addEventListener('scroll', handleScroll);
    //     }

    //     return () => {
    //         if (container) {
    //             container.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [containerRef, loadedCount, loadMorePosts]);

    // useEffect(() => {
    //     const currentPost = posts[currentVideoIndex];
    //     if (currentPost) {
    //         const videoId = currentPost.id;
    //         window.history.replaceState(null, '', `/likes/${username}-${videoId}`);
    //     }
    // }, [currentVideoIndex, posts]);

    return (
        <>
            <div className="ml-auto sm:mt-0">
                <Link
                    href={`/profile/${username}`}
                    className="absolute text-white z-10 m-5 mt-24 sm:mt-15 rounded-full bg-neutral-800 bg-opacity-40 p-2 cursor-pointer hover:bg-opacity-80 sm:bg-opacity-100 ml-[calc(50%+170px)]  sm:ml-[calc(100%-130px)] hidden"
                >
                    <AiOutlineClose size="27" />
                </Link>
                <div className=''>
                    {post ? ( // Verifica si post no es null antes de mapear sus propiedades
                        <div className="sm:pt-14 ml-auto">
                            <PostMain
                                post={{
                                    id: post.id,
                                    videoUrl: post.videoUrl,
                                    description: post.description,
                                    tag: post.tag,
                                    views: post.views,
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>Post not found</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Post;