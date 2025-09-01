import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import type { ModelParams } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, params: ModelParams): Promise<GenerateContentResponse> => {
    return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: params.temperature,
            topK: params.topK,
            topP: params.topP,
        }
    });
};

export const generateImage = async (prompt: string): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg'
        }
    });
    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};

export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
    onProgress('Starting video generation...');
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1
        }
    });

    onProgress('Video generation in progress... this may take a few minutes.');
    let pollCount = 0;
    while (!operation.done) {
        pollCount++;
        const messages = [
            "Just a moment, the AI is warming up its creative circuits.",
            "Rendering pixels into a moving masterpiece...",
            "Composing your video, frame by frame.",
            "Hang tight, awesome things are on the way.",
            "The digital director is calling 'Action!'."
        ];
        const message = messages[pollCount % messages.length];
        onProgress(`Video generation in progress... ${message}`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    onProgress('Finalizing video...');
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error('Video generation failed to produce a download link.');
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};


export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
    });
};

export const streamChatMessage = async (chat: Chat, message: string, onChunk: (chunk: string) => void) => {
    const responseStream = await chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
        onChunk(chunk.text);
    }
};