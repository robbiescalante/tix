import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    // Asegurarse de que query e query.id estén definidos
    const { id } = params || { id: '' };
    const [username, ...ids] = id.split(',');

    try {
        // Obtener el último valor de ids
        const lastId = ids[ids.length - 1];

        // Buscar todos los likes asociados al usuario
        const userLikes = await prisma.like.findMany({
            where: {
                vid: username,
            },
        });

        // Filtrar los likes que coinciden con los IDs proporcionados
        const remainingLikes = ids.length > 0
            ? userLikes.filter((like) => !ids.includes(like.vid))
            : userLikes;

        // Agregar el último valor de ids como primer elemento de postIds
        const postIds = [lastId, ...remainingLikes.map((like) => like.vid)];

        const posts = await prisma.post.findMany({
            where: {
                id: {
                    in: postIds,
                },
            },
        });

        // Tomar los siguientes 5 posts (o menos si hay menos disponibles)
        const nextLikes = posts.slice(0, 5);

        return new NextResponse(JSON.stringify(nextLikes), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};