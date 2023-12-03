import { prisma } from "@/components/utils/conntext";
import { NextResponse } from "next/server";

// Función para barajar aleatoriamente un array (algoritmo de Fisher-Yates)
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const GET = async () => {
    try {
        // Consulta la base de datos para obtener todos los videos
        const allVideos = await prisma.post.findMany();

        // Baraja aleatoriamente el array de videos
        const shuffledVideos = shuffleArray(allVideos);

        // Selecciona un video aleatorio del array barajado
        const randomVideo = shuffledVideos[Math.floor(Math.random() * shuffledVideos.length)];

        return new NextResponse(JSON.stringify(randomVideo), { status: 200 });
    } catch (err) {
        console.error("Error:", err); // Imprimir el error real
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};















