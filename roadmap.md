# Yol Haritası — AI Multiverse Cinema

## Aşama 1 — Mevcut kod incelemesi
- [x] Kod hatalarını düzelt (index.tsx: useT / seriesText import eksikleri)
- [ ] Tüm sayfaları ve özellikleri gözden geçir; çalışan / eksik listesi çıkar

## Aşama 2 — Altyapı (Lovable Cloud)
- [ ] Cloud'u aç (veritabanı + depolama)
- [ ] Üyelik sistemi (kayıt / giriş / oturum)
- [ ] Bölüm sonu: 3 sn otomatik geçiş, "Hemen izle", iptal, kaldığı yerden devam
- [ ] Arayüz / seslendirme / altyazı dili ayrı seçim; olmayan dublajı "hazır" gösterme
- [ ] Gerçek video oynatıcı + bölüm geçişi (tek gerçek videoyla doğrula)
- [ ] Yönetici paneli (giriş korumalı) — dizi / bölüm / medya / dil dosyası yönetimi
- [ ] Yüz fotoğrafı yüklemeyi gerçek dosya depolamaya taşı

## Aşama 3 — İçerik hedefi
- [ ] 10 dizi × 15 bölüm = 150 bölüm, bölüm başı ~3 dk — taslak olarak tanımla
- [ ] Gerçek videolar hazır olana kadar bölümler "taslak" durumda kalsın
- [ ] Pilot bölüm: Türkçe + İngilizce seslendirme iş akışı (onaylı, toplu değil)

## Kullanıcı onayı bekleyen
- [ ] Video üretimi / dublaj için ücretli API kullanımı (bu aşamada başlatılmayacak)
- [ ] Gerçek ödeme (Türkiye: iyzico / PayTR veya Google Play içi ödeme)

- [ ] iyzico ile web ödemesi: kullanıcı iyzico hesabını açacak; açıldıktan sonra jeton satın alma gerçek ödemeye bağlanacak (şirket/şahıs bilgisi, API anahtarları gerekecek)

- Bolum suresi hedefi: 2,5 dakika (~150 sn, yaklasik 19 sahne x 8 sn) — kullanici onayladi
- [ ] Basrol: kullanici fotografini video sahnelerine yerlestirme (reference_images ile deneme) — kullanici sordu, oncelikli
