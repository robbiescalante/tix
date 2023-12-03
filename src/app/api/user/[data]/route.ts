import { prisma } from "@/components/utils/conntext";
import { default as bcrypt } from 'bcryptjs'
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: Request) {
    try {
        const {
            usernameActual,
            usernameNuevo,
            passwordActual,
            nuevaPassword,
        } = await req.json();

        const usuarioActual = await prisma.user.findUnique({
            where: { username: usernameActual },
        });

        if (!usuarioActual) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Verificar si el nombre de usuario nuevo es diferente
        const esNuevoUsernameDiferente =
            usernameNuevo && usernameActual !== usernameNuevo;

        // Si es diferente, verificar si ya existe
        if (esNuevoUsernameDiferente) {
            const existeNuevoUsername = await prisma.user.findUnique({
                where: { username: usernameNuevo },
            });

            if (existeNuevoUsername) {
                return NextResponse.json(
                    { message: "New username already exists" },
                    { status: 409 }
                );
            }
        }

        // Verificar contraseña actual si se proporciona
        if (passwordActual) {
            const esPasswordCorrecta = await bcrypt.compare(
                passwordActual,
                usuarioActual.password
            );

            if (!esPasswordCorrecta) {
                return NextResponse.json(
                    { message: "Incorrect current password" },
                    { status: 401 }
                );
            }
        }

        // Actualizar nombre de usuario si es diferente
        if (esNuevoUsernameDiferente) {
            await prisma.user.update({
                where: { username: usernameActual },
                data: { username: usernameNuevo },
            });
        }

        // Actualizar contraseña si se proporciona nueva contraseña
        if (nuevaPassword) {
            const nuevaPasswordHash = await bcrypt.hash(nuevaPassword, 10);

            await prisma.user.update({
                where: { username: esNuevoUsernameDiferente ? usernameNuevo : usernameActual },
                data: { password: nuevaPasswordHash },
            });
        }

        return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error during user update:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



