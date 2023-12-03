import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const likes = await prisma.like.findMany({
            where: {
                userid: params.id,
            },
        });

        const postIds = likes.map((like) => like.vid);

        const posts = await prisma.post.findMany({
            where: {
                id: {
                    in: postIds,
                },
            },
        });

        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        console.error("Error during fetching liked posts:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};