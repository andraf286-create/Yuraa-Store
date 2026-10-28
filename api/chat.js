import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Pastikan hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    // Mengambil API Key dari Environment Variables Vercel
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key Gemini belum dikonfigurasi di Vercel.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Mengambil riwayat percakapan terakhir dari client
    // Format untuk Google GenAI SDK versi terbaru
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "Kamu adalah Yuraa Panda AI, asisten jualan resmi Yuraa Store yang ramah dan membantu pembeli memilih layanan digital streaming (Netflix, Disney+, dll.) serta menjelaskan cara pembayaran via DANA 08984436849 atau QRIS.",
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Error Gemini API:', error);
    return res.status(500).json({ error: 'Gagal memproses AI chat' });
  }
}

