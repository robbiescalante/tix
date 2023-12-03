import { prisma } from "@/components/utils/conntext";
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        // Descomprimir los parámetros separados por comas
        const [username, vid] = params.id.split(',');

        const existingLike = await prisma.like.findFirst({
            where: {
                userid: String(username),
                vid: String(vid),
            },
        });

        return NextResponse.json(
            { exists: Boolean(existingLike), message: "Query successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during like existence check:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export const POST = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const [username, vid] = params.id.split(',');

        const existingLike = await prisma.like.findFirst({
            where: {
                userid: String(username),
                vid: String(vid),
            },
        });

        if (existingLike) {
            // Si el like ya existe, lo eliminamos
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            return NextResponse.json(
                { like: null, message: "Like removed successfully" },
                { status: 200 }
            );
        }

        const newLike = await prisma.like.create({
            data: {
                userid: String(username),
                vid: String(vid),
            },
        });

        const { id, ...rest } = newLike;

        return NextResponse.json(
            { like: newLike, message: "Like created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during like creation/removal:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}