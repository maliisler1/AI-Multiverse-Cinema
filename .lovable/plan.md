# AI Multiverse Cinema — Çok Dilli Gerçek Uygulama Planı

## Mevcut durum (kısa)
- Çalışan: Türkçe arayüz, 3 örnek dizi, kategori sekmeleri, "Başrol Ol" fotoğraf yükleme, demo jeton ekranı.
- Eksik: veritabanı, hesaplar, gerçek video oynatıcı, çoklu dil, yönetici paneli, gerçek ödeme. Jetonlar ve fotoğraf yalnızca telefonda saklanıyor.
- 3 örnek dizi, sizin listenizdeki 10 diziyle değiştirilecek. Videosu olmayan bölümler "Taslak" kalacak, izlenebilir gösterilmeyecek.

## Aşama 1 — Çok dilli altyapı
- 8 dil: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Portekizce, Arapça (sağdan sola düzen), Hintçe.
- İlk açılışta cihazın tercih ettiği dil önerilir (ülke değil). Kullanıcı onaylar veya değiştirir.
- Ayarlar ekranında üç ayrı seçim: Arayüz dili, Seslendirme dili, Altyazı dili.
- Arayüz metinlerinin tamamı 8 dile çevrilir (menüler, butonlar, hata mesajları).

## Aşama 2 — Veritabanı ve hesaplar (Lovable Cloud)
- Diziler, bölümler, her bölümün ses parçaları ve altyazıları (dil başına), kullanıcılar, izleme ilerlemesi, favoriler.
- Bir bölümde tek görüntü dosyası; her dil için ayrı ses parçası ve ayrı altyazı dosyası. Video dillere göre çoğaltılmaz.
- Her ses/altyazı kaydının durumu: Yok / Üretiliyor / Hazır. Yalnızca "Hazır" olanlar oynatıcıda görünür.
- Kayıt, giriş, şifre sıfırlama, hesap silme.

## Aşama 3 — Oynatıcı
- Oynat/duraklat, 10 sn ileri/geri, ses, tam ekran, altyazı ve ses dili menüsü.
- Seçilen dilde dublaj yoksa açık uyarı: "Bu bölümün [dil] dublajı henüz hazır değil. Türkçe sesle [dil] altyazılı izleyebilirsiniz." Hazır olmayan dublaj listede gösterilmez.
- Bölüm sonunda 3 sn geri sayım: "Hemen izle", "İptal", otomatik geçişi kapatma. Sonraki bölüm önceden yüklenir.
- Kaldığı yerden devam, favoriler, 15. bölümde "Dizi tamamlandı" ekranı, yükleme hatasında "Tekrar dene".
- Ana sayfa, kategoriler, arama, dizi detayı, sıralı bölüm listesi (mevcut tasarım korunur).

## Aşama 4 — Yönetici paneli
- Dizi/bölüm ekleme-düzenleme, kapak ve video yükleme, dil başına ses ve altyazı yükleme.
- Taslak / Önizleme / Yayında durumları. Yetki sunucuda kontrol edilir.
- Her bölüm için dil tablosu: hangi dilde ses ve altyazı hazır, hangisi eksik.

## Aşama 5 — Pilot bölüm içerik iş akışı (yalnızca "Son Dünya Ailesi" 1. bölüm)
1. 15 bölümlük hikâye planı (metin).
2. 1. bölümün ~180 sn senaryosu, diyaloglar, süreli sahne listesi (Türkçe).
3. Karakter tutarlılık rehberi: görünüş, kıyafet, ses tonu, kişilik — her karakter için diller arasında aynı ses kimliği notları.
4. İngilizce uyarlama: birebir değil doğal diyalog; her replik Türkçe süresine yakın tutulur (dudak/zamanlama uyumu için süre notu).
5. Altyazılar: Türkçe ve İngilizce, zaman kodlu.
6. Seslendirme: Türkçe ve İngilizce, karakter başına sabit ses, duygu notlarıyla.
7. Görüntü: kısa sahneler üretilip tek videoda birleştirilir; ses parçaları ve altyazılar ayrı eklenir.
- Metin işleri (1-5) Lovable AI ile yapılır, düşük maliyetlidir.
- Video ve seslendirme üretimi (6-7) ücretlidir ve onayınız olmadan başlatılmaz.

## Aşama 6 — Maliyet raporu (onay için)
- Diğer 6 dil için ayrı ayrı tahmini: çeviri, seslendirme, altyazı, depolama.
- Video üretim hizmeti seçenekleri, fiyatları, gereken hesaplar.
- Toplu üretim (150 bölüm) sizin açık onayınız olmadan başlamaz.

## Bu planda yapılmayacaklar (ayrı adım)
- Abonelik / Google Play Billing ve AdMob: fiyat ve ücretsiz bölüm sayısını size soracağım; webde sahte ödeme düğmesi olmayacak. Mevcut demo jeton ekranı kaldırılıp "yakında" olarak işaretlenecek.
- Android AAB otomatik güncellenmez; kod Android'e aktarılabilir şekilde tutulur.

## Benden size gerekenler
- Plan onayı.
- Yönetici olacak e-posta adresiniz.
- Daha sonra: abonelik fiyatı, ücretsiz bölüm sayısı, video üretimi için bütçe onayı.

## Teknik detaylar
- i18n: dil sözlükleri (tr, en, de, fr, es, pt, ar, hi), `navigator.languages` ile öneri, seçim kullanıcı profiline kaydedilir; `dir="rtl"` Arapça için.
- Tablolar: series, series_translations, episodes, episode_translations, audio_tracks (episode_id, lang, url, status, is_original), subtitle_tracks (episode_id, lang, vtt_url, status), profiles (ui_lang, audio_lang, subtitle_lang), watch_progress, favorites, user_roles (admin). RLS ile yalnızca yayımlanmış bölümler herkese açık.
- Depolama: videos (tek MP4/HLS), audio (dil başına), subtitles (WebVTT), covers.
- Oynatıcı: HTML5 video + ayrı `<audio>` senkronu (ses parçası seçimi), `<track>` ile WebVTT altyazı; sonraki bölüm için `preload`.
- Pilot metin üretimi sunucu fonksiyonunda Lovable AI ile; API anahtarları yalnızca sunucuda.
