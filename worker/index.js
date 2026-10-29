// Worker de subida de imágenes a R2. Solo acepta cuentas admin de Firebase (sin secretos: usa el token del propio usuario).
export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const ok = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).includes(origin);
    const cors = { "Access-Control-Allow-Origin": ok ? origin : "null", "Access-Control-Allow-Methods": "POST,OPTIONS", "Access-Control-Allow-Headers": "Authorization,Content-Type", "Vary": "Origin" };
    const out = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || !ok) return out({ error: "No permitido" }, 403);
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
    if (!token) return out({ error: "Sin sesión" }, 401);
    const type = req.headers.get("Content-Type") || "";
    const ext = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[type];
    if (!ext) return out({ error: "Formato no permitido" }, 415);
    // 1) Verifica el token con Firebase Auth
    const lk = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + env.FIREBASE_API_KEY, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) });
    if (!lk.ok) return out({ error: "Sesión inválida" }, 401);
    const uid = ((await lk.json()).users || [])[0]?.localId;
    // 2) Confirma que existe admins/{uid} (las reglas solo dejan leer tu propio documento)
    const ad = uid && await fetch(`https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT}/databases/(default)/documents/admins/${uid}`, { headers: { Authorization: "Bearer " + token } });
    if (!ad || !ad.ok) return out({ error: "Solo administradores" }, 403);
    const body = await req.arrayBuffer();
    if (!body.byteLength || body.byteLength > 2 * 1024 * 1024) return out({ error: "Archivo vacío o mayor a 2 MB" }, 413);
    const key = `products/${crypto.randomUUID()}.${ext}`;
    await env.BUCKET.put(key, body, { httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" } });
    return out({ url: env.PUBLIC_BASE.replace(/\/$/, "") + "/" + key });
  }
};
