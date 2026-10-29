import mammoth from "mammoth/mammoth.browser";

export interface DocxConversionResult {
    html: string;
    warnings: string[];
}

export interface DocxConversionOptions {
    preserveImages?: boolean;
}

/**
 * Converts a Word (.docx) document into clean, semantic HTML suitable for TipTap / VikEditor.
 * Embedded images are automatically extracted and converted to inline Base64 data URIs.
 */
export async function convertDocxToHtml(
    file: File | Blob | ArrayBuffer,
    options: DocxConversionOptions = { preserveImages: true }
): Promise<DocxConversionResult> {
    let arrayBuffer: ArrayBuffer;

    if (file instanceof ArrayBuffer) {
        arrayBuffer = file;
    } else {
        arrayBuffer = await file.arrayBuffer();
    }

    const mammothOptions: any = {};

    if (options.preserveImages) {
        mammothOptions.convertImage = mammoth.images.imgElement(image => {
            return image.read("base64").then(imageBuffer => {
                return {
                    src: `data:${image.contentType};base64,${imageBuffer}`,
                    class: "vik-image"
                };
            });
        });
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, mammothOptions);

    return {
        html: result.value,
        warnings: result.messages.map(m => m.message)
    };
}
