import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🤖 Bot Sales Pro aktif!\nKetik /menu");
});

bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id,
`📊 MENU SALES
/rekap - Rekap penjualan
/stok - Cek stok
/help - Bantuan`);
});

bot.onText(/\/rekap/, (msg) => {
    bot.sendMessage(msg.chat.id, "📈 Fitur rekap belum diisi (next step)");
});

bot.onText(/\/stok/, (msg) => {
    bot.sendMessage(msg.chat.id, "📦 Fitur stok belum diisi (next step)");
});
