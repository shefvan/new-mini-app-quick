import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.NEXTAUTH_SECRET as string,
  cookieName: "growme_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

