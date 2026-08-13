# LeoSubs Bot

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)]()
[![discord.js](https://img.shields.io/badge/discord.js-14.x-5865F2?logo=discord&logoColor=white)]()
[![status](https://img.shields.io/badge/status-aktif-brightgreen)]()
[![license](https://img.shields.io/badge/license-private-lightgrey)]()

[LeoSubs](https://leosubs.co) topluluğu için geliştirilmiş bir Discord botu. Şu an ağırlıklı olarak yeni bölüm bildirimleriyle çalışıyor, ileride farklı özelliklerle büyütülmesi planlanıyor.

---

## Bu bot ne iş yapar

- Belirli araliklarla siteyi kontrol edip yeni bölüm çıkıp çıkmadığına bakar
- Yeni bölüm bulunca kapak resmi, yıl, puan, stüdyo, tür ve konu bilgisiyle birlikte bir embed hazırlar
- Bölümün adını ve varsa çevirmen/redaktör bilgisini de ekler
- "Hemen İzle" butonuyla direkt bölüme yönlendirir
- Ayarlandıysa belirli bir rolü etiketleyip herkese bildirim atar
- Site 3 kez üst üste cevap vermezse sahibine DM ile haber verir, sorun düzelince tekrar haber verir
- `/ping` komutuyla botun gecikmesini gösterir


## Nasıl çalışıyor

LeoSubs'ın resmi bir API'si yok, o yüzden bot siteyi kendisi ziyaret edip sayfayı okuyor ve ihtiyacı olan veriyi (bölüm bilgileri, kapak resmi, çevirmen/redaktör vb.) oradan çıkarıyor. Daha önce bildirdiği bölümleri hatırlıyor, her kontrolde sadece yeni olanları bildiriyor.


## Ne ile ayakta duruyor

| Araç | Görevi |
|---|---|
| discord.js | Discord tarafındaki her şey |
| axios | Siteye gidip HTML'i getirmek |
| cheerio | Getirilen HTML'i eleyip lazım olanı bulmak |
| dotenv | Token gibi hassas bilgileri kodun dışında tutmak |
| pm2 | Botu sunucuda kesintisiz, arka planda ayakta tutmak |

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
├── credits.json → çevirmen/redaktör isim eşleştirmesi (kendiliğinden oluşmaz, elle tutulur, paylaşılmaz)
├── .env → gizli ayarlar (paylaşılmaz)
└── .gitignore
```

## Not

Bu bot LeoSubs sitesinin herkese açık "Yeni Bölümler" sayfasını okur, hiçbir içeriği kopyalamaz veya yeniden yayınlamaz — sadece "yeni bölüm çıktı" bilgisini Discord'a taşır. Site sahibiyle resmi bir bağlantısı yoktur, resmi bir ürün değildir. __**Site sahibi onaylıdır ve Leosubs Discord sunucusunda aktif bir şekilde kullanılmaktadır.**__

## Kaynaklar

- [node.js](https://nodejs.org)
- [discord.js](https://discord.js.org)
- [axios](https://axios-http.com)
- [cheerio](https://cheerio.js.org)
- [dotenv](https://www.dotenv.org)
- [pm2](https://pm2.keymetrics.io)