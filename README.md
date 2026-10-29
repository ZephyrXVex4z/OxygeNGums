# OxygenNGums — catálogo estático (HTML/CSS/JS, sin dependencias)

## Ejecutar
Abre `index.html` en el navegador, o en la carpeta ejecuta `python3 -m http.server 8000` y visita http://localhost:8000.

## Cambiar productos, precios, imágenes y categorías
- Productos y precios: `src/data/products.js` (campos: id, name, slug, short, long, price, oldPrice, category, flavors, presentation, image, images, tags, available, featured, extra). Quita `demo:true` y pon `showDemoNotice:false` en site-config al usar datos reales. `price:null` muestra «Precio por confirmar».
- Imágenes: copia archivos (WebP optimizado) a `assets/products/` y escribe `image: "assets/products/gomitas-mango.webp"`. Sin imagen o si falla, se muestra una ilustración provisional (no es foto del producto).
- Categorías, colores, textos, contacto, redes y mensaje de pedido: `src/data/site-config.js`.
- Los slugs son fijos en cada producto: no cambian aunque cambies el nombre.

## WhatsApp
En `site-config.js` pon `whatsapp: "52XXXXXXXXXX"` (solo dígitos, con código de país). Sin número, el botón dirige a Contacto.

## Publicar
Sube toda la carpeta a cualquier hosting estático (Netlify, Cloudflare Pages, GitHub Pages…). Las rutas usan `#/` (p. ej. `#/producto/gomitas-fuego`), así que recargar funciona sin configurar el servidor.

## Implementado
Inicio, catálogo (búsqueda, categoría, sabor, orden por precio, contador, sin resultados), página de producto con galería y relacionados, pedido por WhatsApp, imágenes de respaldo, SEO/Open Graph básico, favicon, 404, responsive.
## Pendiente (futuras versiones)
Panel admin, base de datos, subida de fotos, inventario, pedidos, cupones, estadísticas, pagos. Imagen Open Graph propia (1200×630) y URLs sin `#` si pasas a un hosting con reescrituras.

## Firebase (fase 2)
1. Consola Firebase → Authentication → habilita «Correo/contraseña». Authentication → Configuración → Dominios autorizados: agrega tu dominio.
2. Firestore Database → crear (modo producción) → pestaña Reglas → pega `firestore.rules` → Publicar.
3. Abre el sitio, crea tu cuenta, copia tu UID (Authentication → Usuarios).
4. Firestore → crea la colección `admins` con un documento cuyo ID sea ese UID (cualquier campo). Solo así se da admin; las reglas impiden crearlo desde la web.
5. Entra al sitio → «Admin» → «Importar demostración» o crea productos.
Si Firebase no responde, el catálogo usa `src/data/products.js`.
