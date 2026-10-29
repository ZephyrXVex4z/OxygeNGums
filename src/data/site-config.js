// CONFIGURACIÓN DE LA MARCA — edita aquí nombre, colores, contacto y categorías.
window.SITE = {
  name: "OxygenNGums",
  slogan: "Catálogo de gomitas",
  heroTitle: "Gomitas para todos los antojos",
  heroText: "Explora el catálogo de OxygenNGums y consulta tu pedido por WhatsApp.",
  about: "OxygenNGums es una marca de gomitas. Aquí puedes ver los productos disponibles y consultar cómo pedirlos.",
  colors: { primary: "#e8365d", accent: "#ffb703", dark: "#2b1a3d", bg: "#fff8f1", lime: "#6fb83a" },
  currency: "MXN", locale: "es-MX",
  // Número con lada y país, solo dígitos. Ej: "5219841234567". Vacío = se muestra alternativa.
  whatsapp: "529844681306",
  email: "", phone: "+52 984 468 1306",
  social: { instagram: "", facebook: "", tiktok: "" },
  orderMessage: "Hola, me interesa este producto de OxygenNGums:\n• {producto}\n• Presentación: {presentacion}\n• Precio mostrado: {precio}\n¿Me confirman disponibilidad?",
  showDemoNotice: false, // pon false cuando reemplaces los datos de demostración
  uploadUrl: "", // OBLIGATORIO para subir fotos: URL del Worker de subida (R2), ej. "https://oxygengums-upload.TU-CUENTA.workers.dev"
  showLegal: false,
  categories: [
    { id: "enchiladas", name: "Gomitas enchiladas", color: "#e8365d" },
    { id: "dulces", name: "Gomitas dulces", color: "#ff8fab" },
    { id: "acidas", name: "Gomitas ácidas", color: "#6fb83a" },
    { id: "frutales", name: "Gomitas frutales", color: "#ffb703" },
    { id: "paquetes", name: "Paquetes y promociones", color: "#7b5ea7" }
  ],
  perks: [ // Información comercial: edita solo con datos reales
    { title: "Varias presentaciones", text: "Consulta en cada producto la presentación disponible." },
    { title: "Variedad de sabores", text: "Filtra el catálogo por categoría y sabor." },
    { title: "Pedido por WhatsApp", text: "Inicia tu consulta con un mensaje listo." }
  ]
};
