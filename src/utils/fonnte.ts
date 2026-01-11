export async function sendWhatsApp(target: string, message: string) {
  try {
    const token = process.env.FONNTE_TOKEN;

    if (!token) {
      console.error("FONNTE_TOKEN tidak ditemukan di environment variables!");
      return { status: false, error: "Token not configured" };
    }

    console.log(`📤 Mengirim WA ke: ${target}`);

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: target,
        message: message,
      }),
    });

    const result = await response.json();
    console.log(`📱 Fonnte Response untuk ${target}:`, JSON.stringify(result));

    if (!result.status) {
      console.error(
        `❌ Gagal kirim WA ke ${target}:`,
        result.reason || result.detail || "Unknown error"
      );
    } else {
      console.log(`✅ Berhasil kirim WA ke ${target}`);
    }

    return result;
  } catch (error) {
    console.error("❌ Fonnte Error:", error);
    return { status: false, error: String(error) };
  }
}
