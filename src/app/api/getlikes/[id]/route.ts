import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

// Ingresa el id del video y regresa el número de likes totales asociados a ese vídeo.
export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        
        const likes = await prisma.like.findMany({
            where: {
                vid: params.id,
            },
        }); 
        const likeCount = likes.length;

        return NextResponse.json(
            { count: likeCount, message: "Query successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during like count:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};