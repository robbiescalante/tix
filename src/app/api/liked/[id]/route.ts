import { chunk } from 'lodash';
import { prisma } from "@/components/utils/conntext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        

        const post = await prisma.post.findFirst({
            where: {
                id: params.id,
            },
        }); 

        return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (error) {
        console.error("Error during fetching liked posts:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};