//import I18n from 'ex-react-native-i18n';
class I18n {
  static t(str, data) {
    let word = I18n.translations[I18n.defaultLocale];
    if (word) return word[str];
    return `${I18n.defaultLocale}.${str} can't be found.`;
  }
  static currentLocale() {
    return I18n.defaultLocale;
  }
}

I18n.fallbacks = true;

I18n.defaultLocale = "tr";

I18n.translations = {
  en: {
    feedback: "Feedback",
    feedbackinput: "Write your feedback",
    feedbacksuccess: "Your feedback is successfully send.",
    feedbackthanks: "Thank you for feedback.",
    ok: "OK",
    pid: "5054ef32961f73f97166416a85c1976d",
    sendmessage: "Send Message...",
    send: "Send",
    loading: "Loading",
    changeLanguage: "Change Language",
    reloadApp: "Reload Application",
    reload: "Reload Chat",
    select: "Select",
    selectLang: "Select your language",
    options: "Options",
    market: "Chatbot Market",
    close: "Close {{name}}",
    open: "Open",
    settings: "Settings",
    logout: "Logout",
    about: "About Dahi.ai",
    anonim: "Anonim User",
    guest: "Guest Login",
    facebook: "Login with Facebook",
    google: "Login with Google",
    checkforupdate: "Check for Updates",
    error: "Error",
    uptodate: "Your app is up-to-date",
    newupdate: "There is a new version.",
    wouldyouliketoupdate: "Would you like to update now?",
    aboutdahiai: "About Dahi.ai",
    dahiai: "Dahi.ai",
    dahiextra:
      "You can build your own bots without any coding knowledge with Dahi.ai. After building your bots, you can integrated these bots as a service(end-point) to your favorite applications just like Facebook Messenger etc.",
    dahiextra2:
      "You can define many intents into your bots, after that your bots can answer your defined properties concurrently.",
    dahiaivisit: "Visit Dahi.ai",
    dahiairehber: "User Guide",
    dahiaihowto: "How to Use Videos",
    dahiaiexample: "Usage Examples",
    privacypolicy: "Privacy Policy",
    termsofservice: "Terms of Service",
    nowlistening: "Listening Now",
    sendinglocation: "Sending Location Info"
  },
  tr: {
    feedback: "Geri Dönüş",
    feedbackinput: "Geri dönüşünüzü yazınız",
    feedbacksuccess: "Geri dönüşünüz başarılı bir şekilde yollandı.",
    feedbackthanks: "Geri dönüşünüz için teşekkürler.",
    ok: "Tamam",
    pid: "5054ef32961f73f97166416a85c1976d",
    sendmessage: "Mesaj Yolla...",
    send: "Yolla",
    loading: "Yükleniyor",
    changeLanguage: "Dili Değiştir",
    reloadApp: "Uygulamayı Tekrar Aç",
    reload: "Tekrar Yükle",
    select: "Seç",
    open: "Göster",
    selectLang: "Dilinizi Seçiniz",
    options: "Seçenekler",
    market: "Chatbot Market",
    close: "{{name}} Botunu Kapat",
    settings: "Ayarlar",
    logout: "Çıkış Yap",
    about: "Dahi.ai Hakkında",
    anonim: "Anonim Kullanıcı",
    guest: "Misafir Girişi",
    facebook: "Facebook ile Giriş Yap",
    google: "Google ile Giriş Yap",
    checkforupdate: "Güncellemeleri kontrol et",
    error: "Hata",
    uptodate: "Uygulamanız günceldir.",
    newupdate: "Yeni bir güncelleme bulundu.",
    wouldyouliketoupdate: "Şimdi uygulamanızı güncellemek ister misiniz?",
    aboutdahiai: "Dahi.ai Hakkında",
    dahiai: "Dahi.ai",
    dahiextra:
      "Kodlama bilgisi gerekmeden kendi botlarınızı Dahi.ai aracılığıyla oluşturabilirsiniz. Bu oluşturduğunuz botu servis(end-point) olarak dilediğiniz uygulamalara entegre edebilirsiniz. Ör.: Facebook Messenger, Telegram, Maytap etc.",
    dahiextra2:
      "Botlarınıza birden fazla kategori tanımlayabilirsiniz ve botunuz eş zamanlı olarak tanımladığınız özelliklere cevap vermeye başlar.",
    dahiaivisit: "Dahi.ai Sitesine Git",
    dahiairehber: "Kullanıcı Rehberi",
    dahiaihowto: "Kullanım Videoları",
    dahiaiexample: "Kullanım Örnekleri",
    privacypolicy: "Gizlilik Sözleşmesi",
    termsofservice: "Kullanım Koşulları",
    nowlistening: "Şimdi Dinliyorum",
    sendinglocation: "Konum Bilgileri Yollanıyor"
  },
  de: {
    pid: "7001e460de4fa9424d0dce0bd1ba0d2d"
  }
};

export default I18n;
