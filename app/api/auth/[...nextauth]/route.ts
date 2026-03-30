import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

interface TwitterProfile {
  data?: {
    username?: string;
    profile_image_url?: string;
  };
  screen_name?: string;
  profile_image_url?: string;
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  version: "2.0",
  allowDangerousEmailAccountLinking: true,
}),
  ],
  callbacks: {
    async session({ session, token }) {
      return { ...session, token };
    },
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as TwitterProfile;
        token.username = p.data?.username || p.screen_name;
        token.avatar = p.data?.profile_image_url || p.profile_image_url;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };