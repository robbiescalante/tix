import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./conntext";  // Asegúrate de que "conntext" sea el nombre correcto del archivo
import { default as bcrypt } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // console.log("Credentials:", credentials);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });

                // console.log("Existing User:", existingUser);

                if (!existingUser) {
                    console.log("User not found");
                    return null;
                }

                const passMatch = await bcrypt.compare(credentials.password, existingUser.password);

                // console.log("Password Match:", passMatch);

                if (!passMatch) {
                    console.log("Password does not match");
                    return null;
                }

                return {
                    id: existingUser.id,
                    username: existingUser.username,
                    email: existingUser.email
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            
            if(user) {
                return {
                    ...token,
                    username: user.id,
                }
            }
            return token
        },
        async session({ session, token, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                }
            }
            console.log(token, user); 
        },

    }
};