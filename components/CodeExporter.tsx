import React, { useState } from 'react';
import type { ModelParams } from '../types';
import { AppMode } from '../types';
import { IconCode, IconCopy } from '../constants';

interface CodeExporterProps {
  prompt: string;
  params: ModelParams;
  mode: AppMode;
}

type Language = 'curl' | 'javascript';

const CodeExporter: React.FC<CodeExporterProps> = ({ prompt, params, mode }) => {
  const [activeLang, setActiveLang] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);

  const generateCode = (lang: Language): string => {
    const escapedPrompt = JSON.stringify(prompt);
    const apiKey = "YOUR_API_KEY"; // Placeholder

    if (mode === AppMode.Image) {
        switch (lang) {
            case 'curl':
                return `curl 'https://generativelanguage.googleapis.com/v1/models/imagen-4.0-generate-001:generateImages' \\\n-H 'Content-Type: application/json' \\\n-d '{"prompt": ${escapedPrompt}}' \\\n-X POST --compressed -v \\\n-H 'x-goog-api-key: ${apiKey}'`;
            case 'javascript':
                return `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: "${apiKey}" });\n\nasync function run() {\n  const response = await ai.models.generateImages({\n    model: 'imagen-4.0-generate-001',\n    prompt: ${escapedPrompt},\n  });\n  console.log(response.generatedImages);\n}\n\nrun();`;
        }
    } else if (mode === AppMode.Video) {
        switch (lang) {
            case 'curl':
                return `echo "Video generation via curl requires polling an operation. See documentation for a complete example."\n\n# 1. Start the generation\ncurl 'https://generativelanguage.googleapis.com/v1/models/veo-2.0-generate-001:generateVideos' \\\n-H 'Content-Type: application/json' \\\n-d '{"prompt": ${escapedPrompt}}' \\\n-X POST --compressed -v \\\n-H 'x-goog-api-key: ${apiKey}'\n\n# 2. Poll the returned operation name`;
            case 'javascript':
                return `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: "${apiKey}" });\n\nasync function run() {\n  console.log('Starting video generation...');\n  let operation = await ai.models.generateVideos({\n    model: 'veo-2.0-generate-001',\n    prompt: ${escapedPrompt},\n  });\n\n  console.log('Polling for result...');\n  while (!operation.done) {\n    await new Promise(resolve => setTimeout(resolve, 10000));\n    operation = await ai.operations.getVideosOperation({ operation: operation });\n  }\n\n  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;\n  console.log('Video ready:', downloadLink);\n}\n\nrun();`;
        }
    } else {
        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: params.temperature,
                topK: params.topK,
                topP: params.topP,
            }
        };
        const bodyString = JSON.stringify(body, null, 2);

        switch (lang) {
            case 'curl':
                return `curl 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}' \\\n-H 'Content-Type: application/json' \\\n-d '${JSON.stringify({contents: {parts: [{text: prompt}]}})}' \\\n-X POST`;
            case 'javascript':
                return `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: "${apiKey}" });\n\nasync function run() {\n  const response = await ai.models.generateContent({\n    model: 'gemini-2.5-flash',\n    contents: ${escapedPrompt},\n    config: {\n      temperature: ${params.temperature},\n      topK: ${params.topK},\n      topP: ${params.topP},\n    },\n  });\n  console.log(response.text);\n}\n\nrun();`;
        }
    }
    return '';
  };

  const handleCopy = () => {
    const code = generateCode(activeLang);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const code = generateCode(activeLang);

  return (
    <div className="bg-studio-panel rounded-lg mt-4">
      <div className="p-4 border-b border-studio-border flex items-center gap-2">
        <IconCode className="w-5 h-5 text-studio-text-secondary" />
        <h3 className="text-md font-semibold text-studio-text">Get Code</h3>
      </div>
      <div className="p-2">
        <div className="flex space-x-1 bg-studio-surface p-1 rounded-md mb-2">
          <button onClick={() => setActiveLang('curl')} className={`w-full text-sm py-1 rounded ${activeLang === 'curl' ? 'bg-studio-accent-dark text-white' : 'hover:bg-gray-600'}`}>cURL</button>
          <button onClick={() => setActiveLang('javascript')} className={`w-full text-sm py-1 rounded ${activeLang === 'javascript' ? 'bg-studio-accent-dark text-white' : 'hover:bg-gray-600'}`}>Node.js</button>
        </div>
        <div className="relative">
          <pre className="bg-studio-surface p-3 rounded-md text-xs text-studio-text-secondary overflow-x-auto">
            <code>{code}</code>
          </pre>
          <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-studio-border hover:bg-studio-surface rounded-md text-studio-text-secondary">
            <IconCopy className="w-4 h-4" />
          </button>
          {copied && <span className="absolute bottom-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-md">Copied!</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeExporter;