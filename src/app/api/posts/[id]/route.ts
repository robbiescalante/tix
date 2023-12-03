import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    // Asegurarse de que query e query.id estén definidos
    const ids = params?.id ? params.id.split(',') : [];
    // console.log("Sent array:", ids);

    try {
        const allPosts = await prisma.post.findMany();

        // Si se proporcionan IDs, filtrarlos del conjunto de videos
        const remainingPosts = ids.length > 0
            ? allPosts.filter((post) => !ids.includes(post.id))
            : allPosts;

        // console.log("Original Array:", remainingPosts);
        let randomPosts = shuffleArray(remainingPosts).slice(0, 3);
        // console.log("Shuffled Array:", randomPosts);

        // Si hay IDs proporcionadas, incluir la última en la lista
        if (ids.length > 0) {
            const lastVideo = allPosts.find((post) => post.id === ids[ids.length - 1]);
            if (lastVideo) {
                randomPosts.unshift(lastVideo);
            }
        }

        return new NextResponse(JSON.stringify(randomPosts), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};

// Function to shuffle an array randomly (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


