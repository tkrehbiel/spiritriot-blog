import path from 'path';
import { PageContent } from '../interfaces/content';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { canonicalizePath } from '@/site/utilities';
import { TextType } from '@/types/contentText';
import { HugoJsonPage } from '../interfaces/hugo';
import { hugoToPage, hugoToPageList } from '@/types/page';
import { s3Client } from '@config/awsS3Client';
import { ENV, getEnv } from '@config/env';

export async function getContentAtRouteS3(
    route: string[],
): Promise<PageContent> {
    const key = path.join(route.join('/'), 'index.json');
    try {
        const data: HugoJsonPage = await getContentObject(key);
        if (data.children && data.children.length > 0) {
            // List page
            const children = hugoToPageList(data.children);
            return hugoToPage(data, children);
        } else {
            // Single page
            return hugoToPage(data, []);
        }
    } catch (error) {
        console.log(error);
        return {
            timestamp: Date.now(),
            route: canonicalizePath(route.join('/')),
            article: new TextType(
                `There was an error fetching content from S3: ${error} It's probably a misconfiguration somewhere in the infrastructure.`,
            ),
        };
    }
}

export async function getContentObject(key: string): Promise<any> {
    const contentBucketName = getEnv(ENV.JSON_BUCKET);
    const command = new GetObjectCommand({
        Bucket: contentBucketName,
        Key: key,
    });
    const response = await s3Client.send(command);
    if (response.Body) {
        const s = await response.Body?.transformToString();
        return JSON.parse(s);
    }
    return {};
}
