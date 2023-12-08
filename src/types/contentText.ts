import { micromark } from 'micromark';
import { safeStringify } from './strings';

// Text with an associated contentType
export class TextType {
    public text: string;
    public contentType: string;

    constructor(text: string | undefined, contentType: string = 'text/plain') {
        this.text = safeStringify(text);
        this.contentType = contentType;
    }

    toString(): string {
        return this.text;
    }

    // Apparently can't include a toHTML() function
    // or the class doesn't work as an api/json data type
}

export function contentToHTML(content: TextType): string {
    switch (content.contentType) {
        case 'text/plain':
            return '<p>' + content.text + '</p>';
        case 'text/html':
            return content.text;
        case 'text/markdown':
            return micromark(content.text, 'utf8', {
                allowDangerousHtml: true,
            });
        default:
            return '';
    }
}
