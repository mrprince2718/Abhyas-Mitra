// --- Base64 and Audio Utility Functions ---

// Encodes raw bytes into a Base64 string.
export function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Decodes a Base64 string into raw bytes.
export function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Decodes raw audio data into an AudioBuffer for playback.
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- File Utility Functions ---

// Converts a File object to a Base64 encoded string.
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string)?.split(',')[1];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = error => reject(error);
    });
}

// Extracts text content from a PDF file.
declare global {
    interface Window {
        pdfjsLib: any;
    }
}
export async function extractTextFromPdf(file: File): Promise<string> {
    if (!window.pdfjsLib) {
        throw new Error("PDF.js library is not loaded.");
    }
    const pdf = await window.pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let content = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        content += textContent.items.map((item: any) => item.str).join(' ');
        content += '\n'; // Add newline between pages
    }
    return content;
}
