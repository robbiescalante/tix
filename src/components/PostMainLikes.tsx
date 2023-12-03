"use client";
import { Like, PostMainCompTypes, PostMainLikesCompTypes } from "@/app/types";
import { useEffect, useState, useMemo } from "react";
import { AiFillHeart } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"
import { FaShare } from "react-icons/fa"
import { MdReport } from "react-icons/md";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"
import { useSession } from 'next-auth/react';
import ReportFormOverlay from "./ReportOverlay";
import { toast } from "react-toastify";

export default function PostMainLikes({ post, toggleMute, isMuted }: PostMainLikesCompTypes) {
    // ...
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
    const [userLiked, setUserLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0);
    const { data: session } = useSession();
    const [showReportOverlay, setShowReportOverlay] = useState(false);
    const [copied, setCopied] = useState(false);


    const copyToClipboard = () => {
        const currentUrl = window.location.href;

        navigator.clipboard.writeText(currentUrl).then(
            () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                toast.success("URL copied succesfully");
            },
            (err) => {
                console.error('Error al copiar al portapapeles', err);
            }
        );
    };

    const openReportOverlay = () => {
        setShowReportOverlay(true);
    };

    const randomIncrement = useMemo(() => {
        // Genera un número aleatorio entre 55 y 125
        return Math.floor(Math.random() * (250 - 55 + 1)) + 55;
    }, [post.id]);

    const fetchLikes = async () => {
        try {
            if (session && session.user) {
                const response = await fetch(`/api/getlikes/${post.id}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    // console.log(responseData);

                    // Actualiza el estado con el número de likes
                    setLikes(responseData.count || 0);
                } else {
                    console.error('Error al obtener el número de likes:', response.statusText);
                }
            } else {
                console.error('La sesión o el usuario es nulo.');
            }
        } catch (error) {
            console.error('Error al obtener el número de likes:', error);
        }
    };

    const likeOrUnlike = async () => {
        // Deshabilita el botón mientras se procesa la solicitud
        setHasClickedLike(true);

        try {
            if (session && session.user) {
                const response = await fetch(`/api/likes/${session.user.username},${post.id}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    // console.log(responseData);

                    // Actualizar el estado basado en la respuesta
                    const liked = responseData.like !== null;
                    setUserLiked(liked);

                    // Actualizar el estado de likes si es necesario
                    fetchLikes();
                } else {
                    console.error('Error al procesar la solicitud:', response.statusText);
                }
            } else {
                toast.error("Please login");
                console.error('La sesión o el usuario es nulo.');
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
        } finally {
            // Habilitar el botón después de procesar la solicitud
            setHasClickedLike(false);
        }
    };

    const checkUserLiked = async () => {
        try {

            if (session && session.user) {
                const response = await fetch(`/api/likes/${session.user.username},${post.id}`, {
                    method: 'GET',
                });

                // console.log(response);

                if (response.ok) {
                    const responseData = await response.json();
                    // console.log(responseData);

                    // Verifica el valor de "exists" en la respuesta JSON
                    const liked = responseData.exists === true;
                    setUserLiked(liked);
                } else {
                    console.error('Error al verificar si el usuario dio like:', response.statusText);
                }
            } else {
                console.error('La sesión o el usuario es nulo.');
            }
        } catch (error) {
            console.error('Error al verificar si el usuario dio like:', error);
        }
    };

    useEffect(() => {
       //  console.log("Efecto ejecutado");
        checkUserLiked(); // Llama a la función al montar el componente
        fetchLikes();
    }, [post.id]);

    return (
        <>
            <div id={`PostMainLikes-${post.id}`}>
                <div className="absolute bottom-0 ml-[-75px] sm:ml-5">
                    <div className="relative grid grid-rows-2 gap-1 text-center">
                        <div className="relative">
                            <button
                                disabled={hasClickedLike}
                                onClick={() => likeOrUnlike()}
                                className="rounded-full bg-neutral-800 bg-opacity-40 p-2 cursor-pointer hover:bg-opacity-80 sm:bg-opacity-100"
                            >
                                {!hasClickedLike ? (
                                    <AiFillHeart color={userLiked ? '#F7ADBA' : '#ffffff'} size="25" />
                                ) : (
                                    <BiLoaderCircle color="white" className="animate-spin" size="25" />
                                )}
                            </button>
                            <span className="text-xs text-white sm:text-[#262626] font-semibold block mt-2">
                                {likes+randomIncrement}
                            </span>
                        </div>
                        <button className="relative -mt-1" onClick={() => toggleMute()}>
                            <div className="rounded-full bg-neutral-800 bg-opacity-40 p-2 cursor-pointer hover:bg-opacity-80 sm:bg-opacity-100">
                                {isMuted ? (
                                    <HiVolumeOff color="white" size="25" />
                                ) : (
                                    <HiVolumeUp color="white" size="25" />
                                )}
                            </div>
                        </button>
                        <button
                            className="relative "
                            onClick={() => {
                                openReportOverlay();
                            }}
                        >
                            <div className="rounded-full bg-neutral-800 bg-opacity-40 p-2 cursor-pointer mb-8 hover:bg-opacity-80 sm:bg-opacity-100">
                                <MdReport color="white" size="25" />
                            </div>
                        </button>
                        <button
                            className="relative -mt-5"
                            onClick={() => {
                                copyToClipboard();
                            }}
                        >
                            <div className="rounded-full bg-neutral-800 bg-opacity-40 p-2 cursor-pointer mb-8 hover:bg-opacity-80 sm:bg-opacity-100">
                                <FaShare color="white" size="25" />
                            </div>
                        </button>
                    </div>
                </div>
                
            </div>
            {showReportOverlay && (
                <ReportFormOverlay id={post.id} onClose={() => setShowReportOverlay(false)} />
            )}
        </>
    )
}