import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

// Function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string; ids: string[] } }
) => {
    const { id, ids } = params;

    // Input Validation
    if (!ids || ids.length === 0) {
        return new NextResponse(
            JSON.stringify({ message: "Invalid input. Please provide a valid 'ids' array." }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        // Prisma query
        const remainingPosts = await prisma.post.findMany({
            where: {
                id: {
                    not: {
                        in: ids,
                    },
                },
            },
        });

        // Filter out the last video from the remaining posts
        const filteredRemainingPosts = remainingPosts.filter(
            (post) => post.id !== id
        );

        // If there are enough remaining posts, select randomly 4 elements
        const randomPosts =
            filteredRemainingPosts.length >= 4
                ? shuffleArray(filteredRemainingPosts).slice(0, 4)
                : [];

        // Combine the last video and the selected random posts
        const result = [id, ...randomPosts.map((post) => post.id)];

        return new NextResponse(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Prisma error:", error);
        return new NextResponse(
            JSON.stringify({ message: "Database error. Please try again later." }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};