const puppeteer = require('puppeteer');

(async () => {
    // Puppeteer başlat
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: false });
    const page = await browser.newPage();

    try {
        // Sayfaya git
        await page.goto('https://ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf');

        // İstanbul(Söğütlüçeşme) seçimi
        await page.type('#nereden', 'İstanbul(Söğütlüçeşme)'); // Burada id yerine kullanılan değer kullanılmalı, örneğin 1313    
        // Konya seçimi
        await page.type('#nereye', 'Konya'); // Burada id yerine kullanılan değer kullanılmalı, örneğin 1325

        // Tarih seçimini temizleyip yeni tarihi yaz
        await page.evaluate(() => {
            const dateInput = document.querySelector('#trCalGid_input');
            dateInput.value = ''; // İçeriği temizle
        });
        await page.type('#trCalGid_input', '17.07.2024'); // Yeni tarihi yaz

        // Sefer Sorgula butonuna tıkla
        await page.click('#btnSeferSorgula');

        // Sayfanın yüklenmesini bekleyelim
        await page.waitForNavigation();

        // Yönlendirilen sayfada .ui-selectonemenu-label.ui-inputfield.ui-corner-all sınıfına sahip elemanları al
        const elements = await page.$$eval('.ui-selectonemenu-label.ui-inputfield.ui-corner-all', elems => elems.map(el => el.textContent.trim()));

        // Sonuçları konsola yazdır
        console.log(elements);
        console.log(typeof elements);

    } catch (error) {
        console.error('Hata oluştu:', error);
    } finally {
        await browser.close();
    }
})();
