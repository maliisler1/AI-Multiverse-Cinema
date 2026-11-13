import { r as __toESM } from "../_runtime.mjs";
import { a as AlertDialogDescription$1, c as AlertDialogTitle$1, f as require_jsx_runtime, i as AlertDialogContent$1, l as AlertDialogTrigger$1, n as AlertDialogAction$1, o as AlertDialogOverlay$1, p as require_react, r as AlertDialogCancel$1, s as AlertDialogPortal$1, t as AlertDialog$1, u as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as LogOut } from "../_libs/lucide-react.mjs";
import { a as TokenBadge, c as useAppState, l as useT, o as ads, t as AppShell } from "./AppShell-BjZXb2sK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-B_39l8ty.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdPrivacyOptions() {
	if (!(0, import_react.useSyncExternalStore)(ads.subscribe, ads.getSnapshot, ads.getSnapshot).privacyRequired) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "mt-4 block rounded-full border px-4 py-2",
		onClick: () => {
			ads.openPrivacyOptions().catch(() => toast.error("Reklam gizlilik seçenekleri açılamadı. Lütfen tekrar deneyin."));
		},
		children: "Reklam gizlilik seçenekleri"
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AlertDialog = AlertDialog$1;
var AlertDialogTrigger = AlertDialogTrigger$1;
var AlertDialogPortal = AlertDialogPortal$1;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogOverlay$1.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogContent$1.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogTitle$1.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogDescription$1.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction$1, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogAction$1.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel$1, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogCancel$1.displayName;
var labels = {
	tr: [
		"Gizlilik ve uygulama hakkında",
		"Yerel verileri sil",
		"Bu cihazdaki demo ilerlemesi temizlenecek, bu cihazdaki oturum kapatılacak. Sunucudaki hesabınız ve verileriniz silinmez.",
		"İptal",
		"Verileri sil",
		"Yerel veriler temizlendi",
		"AdMob reklamları cihaz bilgileri, IP adresi ve reklam etkileşimlerini işleyebilir.",
		"Hesap ve sunucu verilerinin silinmesini iste"
	],
	en: [
		"Privacy and about",
		"Clear local data",
		"Clears demo progress on this device and signs out here. Your server account and data are not deleted.",
		"Cancel",
		"Clear data",
		"Local data cleared",
		"AdMob may process device information, IP addresses and ad interactions.",
		"Request account and server data deletion"
	],
	de: [
		"Datenschutz und Info",
		"Lokale Daten löschen",
		"Löscht Vorschauen und Demo-Fortschritt auf diesem Gerät und meldet Sie hier ab. Serverkonto und Serverdaten bleiben erhalten.",
		"Abbrechen",
		"Daten löschen",
		"Lokale Daten gelöscht"
	],
	fr: [
		"Confidentialité et informations",
		"Effacer les données locales",
		"Efface les aperçus et la progression sur cet appareil et déconnecte la session. Le compte et les données du serveur sont conservés.",
		"Annuler",
		"Effacer",
		"Données locales effacées"
	],
	es: [
		"Privacidad e información",
		"Borrar datos locales",
		"Borra las vistas previas y el progreso de este dispositivo y cierra la sesión. La cuenta y los datos del servidor no se eliminan.",
		"Cancelar",
		"Borrar datos",
		"Datos locales borrados"
	],
	pt: [
		"Privacidade e informações",
		"Apagar dados locais",
		"Apaga as prévias e o progresso neste dispositivo e encerra a sessão. A conta e os dados do servidor não são apagados.",
		"Cancelar",
		"Apagar dados",
		"Dados locais apagados"
	],
	ar: [
		"الخصوصية والمعلومات",
		"حذف البيانات المحلية",
		"يحذف المعاينات والتقدم على هذا الجهاز ويسجل الخروج. لا يحذف الحساب أو البيانات على الخادم.",
		"إلغاء",
		"حذف البيانات",
		"تم حذف البيانات المحلية"
	],
	hi: [
		"गोपनीयता और जानकारी",
		"स्थानीय डेटा मिटाएं",
		"इस डिवाइस के पूर्वावलोकन और प्रगति हटाता है और साइन आउट करता है। सर्वर खाता और डेटा नहीं हटते।",
		"रद्द करें",
		"डेटा मिटाएं",
		"स्थानीय डेटा मिटाया गया"
	]
};
function LocalPrivacy() {
	const { clearLocal, user } = useAppState();
	const { lang } = useT();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const l = labels[lang] ?? labels.en;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-5 mt-6 rounded-3xl bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-bold",
				children: l[0]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: l[6] ?? labels.en[6]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "mt-3 block text-xs text-primary underline",
				href: "https://policies.google.com/privacy",
				target: "_blank",
				rel: "noreferrer",
				children: "Google Privacy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdPrivacyOptions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
				className: "mt-4 rounded-full bg-secondary px-4 py-2 text-sm",
				children: l[1]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: l[1] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: l[2] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: l[3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await clearLocal();
							toast.success(l[5]);
						} catch {
							toast.error(lang === "tr" ? "Veriler temizlenemedi. Yeniden deneyin." : "Could not clear data. Try again.");
						} finally {
							setBusy(false);
						}
					},
					children: l[4]
				})] })
			] })] }),
			user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "mt-4 block text-xs text-primary underline",
				href: `mailto:maliislerim@gmail.com?subject=${encodeURIComponent("AI Multiverse Cinema - hesap silme talebi")}&body=${encodeURIComponent("Hesabımın ve sunucudaki verilerimin silinmesini istiyorum. Hesap e-postası: " + (user.email ?? ""))}`,
				children: l[7] ?? labels.en[7]
			})
		]
	});
}
function Profile() {
	const { user, signOut } = useAppState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-5 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: "Hesabım"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenBadge, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-5 mt-8 rounded-3xl bg-card p-5",
			children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Hesabın"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all text-sm font-semibold",
					children: user.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void signOut(),
					className: "mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Çıkış Yap"]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Hesabın yok"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Misafir modunda ilerlemen yalnızca bu cihazda saklanır."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/giris",
					className: "mt-4 block rounded-full bg-neon py-3 text-center text-sm font-bold text-primary-foreground shadow-neon",
					children: "Giriş Yap / Kayıt Ol"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalPrivacy, {})
	] });
}
//#endregion
export { Profile as component };
