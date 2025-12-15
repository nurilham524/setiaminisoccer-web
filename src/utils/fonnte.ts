// src/utils/fonnte.ts

export async function sendWhatsApp(target: string, message: string) {
  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.FONNTE_TOKEN || '', // Pastikan ada di .env
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: target,
        message: message,
      }),
    });

    const result = await response.json();
    console.log(`Fonnte Send to ${target}:`, result.status ? "Success" : "Failed");
    return result;
  } catch (error) {
    console.error("Fonnte Error:", error);
    return null; // Jangan throw error agar sistem booking tidak crash jika WA gagal
  }
}