# LeoSubs Bot

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)]()
[![discord.js](https://img.shields.io/badge/discord.js-14.x-5865F2?logo=discord&logoColor=white)]()
[![status](https://img.shields.io/badge/status-aktif-brightgreen)]()
[![license](https://img.shields.io/badge/license-private-lightgrey)]()

[LeoSubs](https://leosubs.co) topluluğu için geliştirilmiş bir Discord botu. Şu an ağırlıklı olarak yeni bölüm bildirimleriyle çalışıyor, ileride farklı özelliklerle büyütülmesi planlanıyor.

# LeoSubs Bildirim Botu

[leosubs.co](https://leosubs.co)'yu düzenli aralıklarla kontrol edip yeni bölüm çıktığında haber veren bir Discord botu. Siteyi elle yenileyip bakmak yerine bu işi bota bıraktık.

## Ne yapıyor

- Siteyi düzenli olarak tarar, yeni bölüm var mı diye bakar
- Daha önce gördüğü bölümleri hatırlar, aynısını iki kez bildirmez
- Yeni bir bölüm bulunca kapak resmi, yıl, puan, kanal, tür, isim ve konu gibi bilgileri çekip düzgün bir embed olarak kanala atar
- İstenirse belirli bir rolü etiketleyip herkese haber verir
- Site bir süre cevap vermezse bunu fark edip sahibine DM atar

## Komutlar

- `/ping` — botun uyanık olup olmadığını ve gecikmesini gösterir
- `/embed-olustur` — herhangi bir embed mesajı oluşturup göndermek için (herhangi bir amaç için)
- `/voice-baglan`, `/voice-ayril` — botu sabit bir ses kanalına sokup çıkarmak için

## Klasör yapısı

```
├── bot.js                    → botu çalıştıran ana dosya
├── deploy-commands.js         → slash komutlarını Discord'a tanıtan script
├── package.json
├── commands/
│   ├── ping.js                → /ping komutu
│   ├── embed-olustur.js        → /embed-olustur komutu
│   ├── voice-baglan.js         → /voice-baglan komutu
│   └── voice-ayril.js          → /voice-ayril komutu
├── events/
│   ├── ready.js                → bot açıldığında çalışır, taramayı başlatır
│   └── interactionCreate.js    → slash komutlarını algılayıp yönlendirir
├── services/
│   ├── scraper.js              → siteyi okuyup veri çıkaran kısım
│   └── notifier.js             → yeni bölüm bulunca kanala bildirim gönderir
└── data/
    ├── storage.js               → görülen bölümleri hafızada tutar
    └── status.js                → botun sağlık durumunu takip eder
```

## Kullanılanlar

discord.js, axios, cheerio, dotenv, pm2 — Node.js .

## Not

Bot sadece leosubs.co'nun herkese açık "yeni bölümler" sayfasını okuyor, hiçbir içeriği kopyalamıyor ya da yeniden yayınlamıyor. Sadece "yeni bölüm çıktı" bilgisini alıp Discord'a taşıyor. Site sahibiyle resmi bir bağlantısı yok.