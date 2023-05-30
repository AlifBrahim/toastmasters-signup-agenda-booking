import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

export default NextAuth({
    adapter: TypeORMLegacyAdapter({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    }),
    providers: [
        // OAuth authentication providers...
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.JWT_SECRET
})