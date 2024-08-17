const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
    const { nereden, nereye, dateInput } = req.body;

    if (!nereden || !nereye || !dateInput) {
        return res.status(400).json({ error: 'Lütfen nereden, nereye ve dateInput bilgilerini sağlayın.' });
    }

    let browser;
    try {
        console.log('Puppeteer başlatılıyor...');
        browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: false, // Ekranı görmek için headless modunu kapatalım
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null
        });
        const page = await browser.newPage();

        console.log('Sayfaya gidiliyor...');
        await page.goto('https://ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf', { waitUntil: 'networkidle2' });

        console.log(`Nereden: ${nereden}`);
        await page.type('#nereden', nereden);
        
        console.log(`Nereye: ${nereye}`);
        await page.type('#nereye', nereye);

        console.log(`Tarih: ${dateInput}`);
        await page.evaluate(() => {
            const dateInputElement = document.querySelector('#trCalGid_input');
            dateInputElement.value = ''; // İçeriği temizle
        });
        await page.type('#trCalGid_input', dateInput);

        console.log('Takvimi kapatma işlemi gerçekleştiriliyor...');
        // Takvimi kapatmak için başka bir yere tıklayalım veya klavyede ESC tuşuna basalım
        await page.click('body'); // Veya await page.keyboard.press('Escape');

        console.log('Sefer Sorgula butonuna tıklanıyor...');
        await page.waitForSelector('#btnSeferSorgula'); // Butonun görünür olmasını bekleyin
        await page.click('#btnSeferSorgula');

        console.log('Sayfa yönlendirmesi bekleniyor...');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Sonuçlar alınıyor...');
        const times = await page.$$eval('.whiteSortIcon', elems =>
            elems
                .filter(el => el.classList.length === 1 && el.classList.contains('whiteSortIcon')) // sadece whiteSortIcon sınıfına sahip olanları al
                .map(el => el.textContent.trim())
        );
        console.log(times);
        
        const elements = await page.$$eval('.ui-selectonemenu-label.ui-inputfield.ui-corner-all', elems =>
            elems.map(el => el.textContent.trim())
        );
        console.log(elements);
        // times ve elements listelerini key-value çiftleri olarak birleştir
        const combined = times.reduce((acc, time, index) => {
            acc[time] = elements[index] || null; // Eğer elements[index] undefined ise null olarak ayarla
            return acc;
        }, {});
        
        console.log(combined);        
        console.log('Sonuçlar gönderiliyor...');
        res.json({ results: combined });
    } catch (error) {
        console.error('Hata oluştu:', error.message);
        res.status(500).json({ error: 'Bir hata oluştu.', details: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
