import { siteConfig } from '@config/siteConfig';
import { MetadataRoute } from 'next';

// robots.txt
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/search/'],
        },
        sitemap: siteConfig.homePage + '/sitemap.xml',
    };
}
