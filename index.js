require('dotenv').config(); // Mengambil token dari file .env
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TOKEN); // Mengambil token dari environment

// Daftar koin meme
const memeCoins = {
    'dogecoin': 'Dogecoin',
    'shiba-inu': 'Shiba Inu',
    'safe-moon': 'SafeMoon',
    'akita-inu': 'Akita Inu',
    'hokkaido-inu': 'Hokkaido Inu',
    'hoge': 'Hoge Finance',
    'kishu': 'Kishu Inu',
    'pitbull': 'Pitbull',
    'elondoge': 'Elon Musk Doge Token',
    'elon': 'Dogelon Mars',
    'saitama': 'Saitama',
    'poodle': 'Poodle',
    'wan': 'Wanchain',
    'cum': 'CumRocket',
    'pug': 'PugLife',
    'floki': 'Floki Inu',
    'feg-token': 'FEG Token'
};

// Fungsi untuk mengambil harga koin dari API CoinGecko
const getPrices = async () => {
    const ids = Object.keys(memeCoins).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching prices:', error.response ? error.response.data : error.message);
        return null;
    }
};

// Command '/start' yang mengirim pesan selamat datang dan pilihan koin meme
bot.start((ctx) => {
    ctx.reply('Selamat datang! Pilih koin meme yang ingin dicek harganya:', {
        reply_markup: {
            inline_keyboard: [
                ...Object.keys(memeCoins).map((key) => [{
                    text: memeCoins[key],
                    callback_data: key
                }])
            ]
        }
    });
});

// Menangani pilihan pengguna dan mengirimkan harga koin yang dipilih
bot.on('callback_query', async (ctx) => {
    const prices = await getPrices();
    if (prices) {
        const coinId = ctx.callbackQuery.data;
        const price = prices[coinId]?.usd;
        const coinName = memeCoins[coinId];

        if (price) {
            ctx.reply(`${coinName}: $${price}`);
        } else {
            ctx.reply(`Gagal mendapatkan harga untuk ${coinName}.`);
        }
    } else {
        ctx.reply('Gagal mengambil harga koin.');
    }
});

// Menjalankan bot
bot.launch().then(() => {
    console.log('Bot is running...');
}).catch((error) => {
    console.error('Error launching bot:', error);
});
