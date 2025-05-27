import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Add other providers here if needed
  ],

  // Optional: Add callbacks, pages, etc. here
  // database: process.env.DATABASE_URL,
  // callbacks: { ... },
  // pages: { ... },
  // events: { ... },
  // jwt: { ... },
  // theme: { ... },
  // session: { ... },
  // debug: true,
});
