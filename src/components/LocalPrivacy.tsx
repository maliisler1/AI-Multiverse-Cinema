import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { AdPrivacyOptions } from "./AdPrivacyOptions";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";

const labels = {
  tr: ["Gizlilik ve uygulama hakkında", "Yerel verileri sil", "Bu cihazdaki profil önizlemesi ve demo ilerlemesi temizlenecek, bu cihazdaki oturum kapatılacak. Sunucudaki hesabınız ve verileriniz silinmez.", "İptal", "Verileri sil", "Yerel veriler temizlendi", "Profil fotoğrafı giriş yapıldığında sunucuya yüklenir; misafir modunda cihazda tutulur. Fotoğraf yalnızca afiş önizlemesinde kullanılır, videolara yerleştirilmez. AdMob reklamları cihaz bilgileri, IP adresi ve reklam etkileşimlerini işleyebilir.", "Hesap ve sunucu verilerinin silinmesini iste"],
  en: ["Privacy and about", "Clear local data", "Clears profile previews and demo progress on this device and signs out here. Your server account and data are not deleted.", "Cancel", "Clear data", "Local data cleared", "Signed-in profile photos are uploaded to the server; guest photos stay on this device. Photos appear in poster previews, not videos. AdMob may process device information, IP addresses and ad interactions.", "Request account and server data deletion"],
  de: ["Datenschutz und Info", "Lokale Daten löschen", "Löscht Vorschauen und Demo-Fortschritt auf diesem Gerät und meldet Sie hier ab. Serverkonto und Serverdaten bleiben erhalten.", "Abbrechen", "Daten löschen", "Lokale Daten gelöscht"],
  fr: ["Confidentialité et informations", "Effacer les données locales", "Efface les aperçus et la progression sur cet appareil et déconnecte la session. Le compte et les données du serveur sont conservés.", "Annuler", "Effacer", "Données locales effacées"],
  es: ["Privacidad e información", "Borrar datos locales", "Borra las vistas previas y el progreso de este dispositivo y cierra la sesión. La cuenta y los datos del servidor no se eliminan.", "Cancelar", "Borrar datos", "Datos locales borrados"],
  pt: ["Privacidade e informações", "Apagar dados locais", "Apaga as prévias e o progresso neste dispositivo e encerra a sessão. A conta e os dados do servidor não são apagados.", "Cancelar", "Apagar dados", "Dados locais apagados"],
  ar: ["الخصوصية والمعلومات", "حذف البيانات المحلية", "يحذف المعاينات والتقدم على هذا الجهاز ويسجل الخروج. لا يحذف الحساب أو البيانات على الخادم.", "إلغاء", "حذف البيانات", "تم حذف البيانات المحلية"],
  hi: ["गोपनीयता और जानकारी", "स्थानीय डेटा मिटाएं", "इस डिवाइस के पूर्वावलोकन और प्रगति हटाता है और साइन आउट करता है। सर्वर खाता और डेटा नहीं हटते।", "रद्द करें", "डेटा मिटाएं", "स्थानीय डेटा मिटाया गया"],
};

export function LocalPrivacy() {
  const { clearLocal, user } = useAppState();
  const { lang } = useT();
  const [busy, setBusy] = useState(false);
  const l = labels[lang] ?? labels.en;
  return <section className="mx-5 mt-6 rounded-3xl bg-card p-5">
    <h2 className="text-sm font-bold">{l[0]}</h2>
    <p className="mt-3 text-xs text-muted-foreground">{l[6] ?? labels.en[6]}</p>
    <a className="mt-3 block text-xs text-primary underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy</a>
    <AdPrivacyOptions />
    <AlertDialog>
      <AlertDialogTrigger className="mt-4 rounded-full bg-secondary px-4 py-2 text-sm">{l[1]}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{l[1]}</AlertDialogTitle>
        <AlertDialogDescription>{l[2]}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{l[3]}</AlertDialogCancel>
          <AlertDialogAction disabled={busy} onClick={async () => {
            setBusy(true);
            try { await clearLocal(); toast.success(l[5]); }
            catch { toast.error(lang === "tr" ? "Veriler temizlenemedi. Yeniden deneyin." : "Could not clear data. Try again."); }
            finally { setBusy(false); }
          }}>{l[4]}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {user && <a className="mt-4 block text-xs text-primary underline" href={`mailto:maliislerim@gmail.com?subject=${encodeURIComponent('AI Multiverse Cinema - hesap silme talebi')}&body=${encodeURIComponent('Hesabımın ve sunucudaki verilerimin silinmesini istiyorum. Hesap e-postası: ' + (user.email ?? ''))}`}>{l[7] ?? labels.en[7]}</a>}
  </section>;
}
