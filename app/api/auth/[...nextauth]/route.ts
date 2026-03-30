import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return { ...session, token };
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = (profile as any).data?.username;
        token.avatar = (profile as any).data?.profile_image_url;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };