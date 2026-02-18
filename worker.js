export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST") {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";

        let reply = "Perintah tidak dikenali";

        if (text === "/start") {
          reply = "🤖 Bot Sales Aktif!\nKetik /menu";
        }

        if (text === "/menu") {
          reply =
`📊 MENU SALES
/rekap
/stok
/harga`;
        }

        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply
          })
        });
      }
    }

    return new Response("ok");
  }
};
