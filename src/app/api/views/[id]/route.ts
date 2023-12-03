import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        // Desestructurar el id del parámetro
        const { id } = params;

        // Buscar el post por ID
        const existingPost = await prisma.post.findUnique({
            where: {
                id: id, 
            },
        });

        // Si no se encuentra el post, devolver un error 404
        if (!existingPost) {
            return NextResponse.json(
                { message: "Post not found", exists: false },
                { status: 404 }
            );
        }

        // Incrementar en 1 el valor de views
        const updatedPost = await prisma.post.update({
            where: {
                id: existingPost.id,
            },
            data: {
                views: (existingPost.views).toNumber() + 1,
            },
        });

        return new NextResponse(JSON.stringify(updatedPost.views), { status: 200 });
    } catch (error) {
        console.error("Error during like existence check:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};