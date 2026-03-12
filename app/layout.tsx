import Providers from "./providers";
import LayoutClient from "./LayoutClient";
import "@/app/globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            <LayoutClient>
              {children}
            </LayoutClient>
        </Providers>
      </body>
    </html>
  );
}