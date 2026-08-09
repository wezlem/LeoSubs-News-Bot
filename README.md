# LeoSubs Bildirim Botu

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)]()
[![discord.js](https://img.shields.io/badge/discord.js-14.x-5865F2?logo=discord&logoColor=white)]()
[![status](https://img.shields.io/badge/status-aktif-brightgreen)]()
[![license](https://img.shields.io/badge/license-private-lightgrey)]()

LeoSubs sitesini gözünü kırpmadan izleyen, yeni bölüm çıkar çıkmaz Discord'a haber salan bir bekçi. Sıkıcı sayfa yenilemelerini bota bıraktık, biz sadece bildirimi görüp tıklıyoruz.

---

## Bu bot ne iş yapar

- Siteyi belirli aralıklarla dolaşır, yeni bölüm var mı diye kontrol eder
- Daha önce gördüğü bölümleri unutmaz, aynı şeyi iki kere söylemez
- Yeni bir bölüm yakaladığında animenin kendi sayfasına uğrar, kaliteli kapak resmini ve yıl/puan/kanal/tür/konu gibi detayları toplayıp getirir
- Hepsini tek bir şık kartta, "Hemen Izle" butonuyla birlikte kanala bırakır
- İstenirse belirli bir rolü de etiketleyip herkese haber verir
- Kendi nabzını tutar — site bir süre cevap vermezse haber verir, düzelince de öyle
- `/ping` yazınca botun uyanık olup olmadığını anında söyler

## Ne ile ayakta duruyor

| Araç | Görevi |
|---|---|
| discord.js | Discord tarafındaki her şey |
| axios | Siteye gidip HTML'i getirmek |
| cheerio | Getirilen HTML'i eleyip lazım olanı bulmak |
| dotenv | Token gibi hassas bilgileri kodun dışında tutmak |

## Klasörde neler var

```
leosubs-bot/
├── bot.js → botun kalbi, her şey burada birleşiyor
├── deploy-commands.js → /ping komutunu Discord'a tanıtan script
├── scraper.js → siteyi okuyup veri çıkaran kısım
├── storage.js → hafıza yönetimi
├── status.js → sağlık kaydı yönetimi
├── seen.json → görülen bölümler (kendiliğinden oluşur, paylaşılmaz)
├── status.json → sağlık verisi (kendiliğinden oluşur, paylaşılmaz)
├── .env → gizli ayarlar (paylaşılmaz)
└── .gitignore
```

## Not

Bu bot yalnızca LeoSubs sitesinin herkese açık "Yeni Bölümler" sayfasını okur, hiçbir içeriği kopyalamaz veya yeniden yayınlamaz — sadece "yeni bölüm çıktı" bilgisini Discord'a taşır. Site sahibiyle bir bağlantısı yoktur, resmi bir ürün değildir. Kişisel kullanım içindir.
