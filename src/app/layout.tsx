import { Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import './syntax.css';
import { siteConfig } from '@config/siteConfig';
import Link from 'next/link';

const roboto = Roboto_Mono({
    variable: '--font-roboto-mono',
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: siteConfig.siteName,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let index = 1;
    return (
        <html lang="en" className={`${roboto.variable}`}>
            <head>
                {siteConfig.links.map((x) => {
                    return <link key={index++} rel={x.rel} href={x.href} />;
                })}
            </head>
            <body>
                <nav>
                    <Link prefetch={false} href="/">
                        {siteConfig.siteName}
                    </Link>
                </nav>
                {children}
            </body>
        </html>
    );
}
