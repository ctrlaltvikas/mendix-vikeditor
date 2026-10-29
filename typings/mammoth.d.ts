declare module "mammoth" {
    export interface ConversionResult {
        value: string;
        messages: Array<{
            type: "warning" | "error";
            message: string;
        }>;
    }

    export interface ConvertOptions {
        arrayBuffer?: ArrayBuffer;
        path?: string;
        convertImage?: any;
        styleMap?: string | string[];
        includeDefaultStyleMap?: boolean;
    }

    export interface ImageElement {
        read: (encoding: string) => Promise<string>;
        contentType: string;
    }

    export function convertToHtml(input: { arrayBuffer: ArrayBuffer } | { path: string }, options?: ConvertOptions): Promise<ConversionResult>;
    export function convertToMarkdown(input: { arrayBuffer: ArrayBuffer } | { path: string }, options?: ConvertOptions): Promise<ConversionResult>;
    export function extractRawText(input: { arrayBuffer: ArrayBuffer } | { path: string }): Promise<{ value: string }>;

    export const images: {
        imgElement: (fn: (image: ImageElement) => Promise<{ src: string } | { [key: string]: string }>) => any;
        dataUri: any;
    };
}

declare module "mammoth/mammoth.browser" {
    import mammoth from "mammoth";
    export = mammoth;
}
