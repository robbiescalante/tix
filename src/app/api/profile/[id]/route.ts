import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const userId = params.id;

        const profile = await prisma.user.findUnique({
            where: {
                id: userId, // Reemplaza "id" con el nombre del campo en tu modelo de usuario
            },
        });

        if (!profile) {
            return new NextResponse(
                JSON.stringify({ message: "Perfil no encontrado" }),
                { status: 404 }
            );
        }

        return new NextResponse(JSON.stringify(profile), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};

