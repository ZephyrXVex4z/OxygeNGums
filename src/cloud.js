// Firebase: productos (Firestore), cuentas, reseñas y panel admin. Si Firebase falla, el sitio usa products.js.
(function(){
"use strict";
var C=window.FIREBASE_CONFIG,S=window.SITE;
window.EXTRA={"/cuenta":1,"/admin":1};
if(!C||!window.firebase)return;
firebase.initializeApp(C);
var auth=firebase.auth(),db=firebase.firestore(),TS=firebase.firestore.FieldValue.serverTimestamp,user=null,admin=false,live=false,P=window.PRODUCTS,DEMO=P.slice();
var $=function(s){return document.querySelector(s)};
var esc=function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var slugify=function(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};
var list=function(t){return t.split(",").map(function(x){return x.trim()}).filter(Boolean)};
var again=function(){window.dispatchEvent(new Event("hashchange"))};
function load(){return db.collection("products").get().then(function(s){
  if(s.empty&&!live)return;live=true;
  P.splice.apply(P,[0,P.length].concat(s.docs.map(function(d){var o=d.data();o.id=d.id;return o})));
  var b=$(".demo");if(b)b.remove();again()}).catch(function(e){console.warn("Firestore:",e.code)})}
var a=document.createElement("a");a.id="acc";a.href="#/cuenta";$("#nav").insertBefore(a,$("#hdrOrder"));
function nav(){a.textContent=user?"Mi cuenta":"Entrar";var ad=$("#adm");
  if(admin&&!ad){ad=document.createElement("a");ad.id="adm";ad.href="#/admin";ad.textContent="Admin";$("#nav").insertBefore(ad,a)}else if(!admin&&ad)ad.remove()}
auth.onAuthStateChanged(function(u){user=u;admin=false;nav();if(!u){again();return}
  db.doc("admins/"+u.uid).get().then(function(s){admin=s.exists}).catch(function(){}).then(function(){nav();again()})});
function msg(e){return{"auth/invalid-credential":"Correo o contraseña incorrectos.","auth/email-already-in-use":"Ese correo ya tiene cuenta.","auth/weak-password":"La contraseña es muy corta.","auth/invalid-email":"Correo no válido."}[e.code]||"No se pudo completar ("+(e.code||"error")+")."}
function account(){var ex=$("#ex");document.title="Cuenta — "+S.name;
  if(user){ex.innerHTML='<h1>Mi cuenta</h1><p>'+esc(user.displayName||"")+' · '+esc(user.email)+'</p><p class="note">Puedes dejar reseñas en los productos. Los sorteos llegarán más adelante.</p><button class="btn alt" id="out">Cerrar sesión</button>';$("#out").onclick=function(){auth.signOut()};return}
  ex.innerHTML='<h1>Entrar o crear cuenta</h1><p class="note">No necesitas cuenta para ver los productos.</p><div class="form"><label>Nombre (al crear cuenta)<input id="an" autocomplete="name"></label><label>Correo<input id="ae" type="email" autocomplete="email"></label><label>Contraseña (mínimo 6)<input id="ap" type="password" autocomplete="current-password"></label><div class="cta"><button class="btn" id="li">Entrar</button><button class="btn alt" id="su">Crear cuenta</button></div><a href="#" id="rs">Olvidé mi contraseña</a><p id="am" role="alert"></p></div>';
  var m=function(t){$("#am").textContent=t},err=function(e){m(msg(e))};
  $("#li").onclick=function(){auth.signInWithEmailAndPassword($("#ae").value,$("#ap").value).then(function(){location.hash="#/"}).catch(err)};
  $("#su").onclick=function(){var n=$("#an").value.trim().slice(0,60)||"Cliente";
    auth.createUserWithEmailAndPassword($("#ae").value,$("#ap").value).then(function(c){return c.user.updateProfile({displayName:n}).then(function(){return db.doc("users/"+c.user.uid).set({name:n,email:c.user.email,createdAt:TS()})})}).then(function(){location.hash="#/"}).catch(err)};
  $("#rs").onclick=function(ev){ev.preventDefault();auth.sendPasswordResetEmail($("#ae").value).then(function(){m("Te enviamos un correo para restablecerla.")}).catch(err)}}
function panel(){var ex=$("#ex");document.title="Admin — "+S.name;
  if(!admin){ex.innerHTML='<h1>Acceso restringido</h1><p>'+(user?"Tu cuenta no tiene permisos de administrador.":'Inicia sesión desde <a href="#/cuenta">Entrar</a>.')+'</p>';return}
  var f=function(id,l,t){return'<label>'+l+'<input id="'+id+'"'+(t?' type="'+t+'"':'')+'></label>'};
  ex.innerHTML='<h1>Panel de administración</h1><form id="pf" class="form"><h2 id="pt">Nuevo producto</h2>'+f("pn","Nombre")+f("ps","Slug (URL; se fija al crear)")+
   '<label>Categoría<select id="pc">'+S.categories.map(function(c){return'<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join("")+'</select></label>'+
   f("pp","Precio MXN","number")+f("po","Precio anterior (opcional)","number")+f("pr","Presentación")+f("pv","Sabores (separados por coma)")+f("pi","Imagen (ruta, ej. assets/products/x.webp)")+f("pg","Etiquetas (coma)")+f("pd","Descripción corta")+
   '<label>Descripción completa<textarea id="pl" rows="4"></textarea></label><label class="chk"><input type="checkbox" id="pa" checked> Disponible</label><label class="chk"><input type="checkbox" id="pw"> Destacado</label><div class="cta"><button class="btn" type="submit">Guardar</button><button class="btn alt" type="button" id="pcl">Limpiar</button></div><p id="pm2" role="alert"></p></form><h2>Productos ('+P.length+')</h2>'+
   (P.some(function(p){return p.demo})?'<p><button class="btn alt" id="seed">Importar demostración a Firebase</button></p>':'')+
   P.map(function(p){return'<div class="rv"><b>'+esc(p.name)+'</b> · '+esc(p.slug)+'<br><button class="lnk" data-e="'+esc(p.slug)+'">Editar</button><button class="lnk" data-d="'+esc(p.slug)+'">Eliminar</button></div>'}).join("");
  var v=function(id){return $("#"+id).value},m=function(t){$("#pm2").textContent=t};
  function clear(){$("#pf").reset();$("#ps").readOnly=false;$("#pt").textContent="Nuevo producto"}
  $("#pcl").onclick=clear;
  $("#pf").onsubmit=function(e){e.preventDefault();var n=v("pn").trim(),s=v("ps").trim()||slugify(n);if(!n||!s)return m("Escribe un nombre.");
    var old=P.find(function(p){return p.slug===s})||{},num=function(x){return x===""?null:Number(x)};
    var d={name:n,slug:s,category:v("pc"),price:num(v("pp")),oldPrice:num(v("po")),presentation:v("pr").trim(),flavors:list(v("pv")),image:v("pi").trim()||null,images:old.images||[],tags:list(v("pg")),short:v("pd").trim(),long:v("pl").trim(),available:$("#pa").checked,featured:$("#pw").checked,extra:old.extra||""};
    db.collection("products").doc(slugify(s)).set(d).then(load).catch(function(x){m("No se pudo guardar ("+x.code+")")})};
  ex.onclick=function(e){var t=e.target,s;
    if(s=t.dataset.e){var p=P.find(function(x){return x.slug===s});$("#pt").textContent="Editar producto";$("#ps").readOnly=true;
      $("#pn").value=p.name;$("#ps").value=p.slug;$("#pc").value=p.category;$("#pp").value=p.price==null?"":p.price;$("#po").value=p.oldPrice==null?"":p.oldPrice;$("#pr").value=p.presentation||"";$("#pv").value=(p.flavors||[]).join(", ");$("#pi").value=p.image||"";$("#pg").value=(p.tags||[]).join(", ");$("#pd").value=p.short||"";$("#pl").value=p.long||"";$("#pa").checked=!!p.available;$("#pw").checked=!!p.featured;window.scrollTo(0,0)}
    if(s=t.dataset.d){if(confirm("¿Eliminar este producto?"))db.collection("products").doc(s).delete().then(load).catch(function(x){m("No se pudo eliminar ("+x.code+")")})}
    if(t.id==="seed"){var b=db.batch();DEMO.forEach(function(p){var o=Object.assign({},p);delete o.demo;delete o.id;b.set(db.collection("products").doc(p.slug),o)});b.commit().then(load).catch(function(x){m("Error ("+x.code+")")})}}}
function reviews(s){var w=$("main .wrap");if(!w)return;var box=document.createElement("section");box.className="sec";
  box.innerHTML='<h2>Reseñas</h2><div id="rl"><p class="note">Cargando…</p></div><div id="rf"></div>';w.appendChild(box);
  var col=db.collection("products").doc(s).collection("reviews");
  function draw(){col.orderBy("at","desc").limit(30).get().then(function(q){
    $("#rl").innerHTML=q.docs.map(function(d){var r=d.data(),n=Math.max(1,Math.min(5,r.rating|0));return'<div class="rv"><b>'+esc(r.name)+'</b> <span class="st" aria-label="'+n+' de 5">'+"★".repeat(n)+"☆".repeat(5-n)+'</span><p>'+esc(r.text)+'</p>'+(user&&(user.uid===d.id||admin)?'<button class="lnk" data-x="'+esc(d.id)+'">Eliminar</button>':'')+'</div>'}).join("")||'<p class="note">Aún no hay reseñas.</p>';
    document.querySelectorAll("[data-x]").forEach(function(b){b.onclick=function(){col.doc(b.dataset.x).delete().then(draw)}})}).catch(function(){$("#rl").innerHTML='<p class="note">No se pudieron cargar las reseñas.</p>'})}
  draw();
  if(!user){$("#rf").innerHTML='<p><a href="#/cuenta">Inicia sesión o crea una cuenta</a> para dejar una reseña.</p>';return}
  $("#rf").innerHTML='<form class="form"><label>Calificación<select id="rr"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label><label>Tu reseña<textarea id="rt" rows="3" maxlength="500" required></textarea></label><button class="btn" type="submit">Publicar reseña</button><p id="re" role="alert"></p></form>';
  $("#rf form").onsubmit=function(e){e.preventDefault();var t=$("#rt").value.trim();if(!t)return;
    col.doc(user.uid).set({uid:user.uid,name:(user.displayName||"Cliente").slice(0,60),rating:parseInt($("#rr").value,10),text:t,at:TS()}).then(function(){$("#rt").value="";draw()}).catch(function(x){$("#re").textContent="No se pudo publicar ("+x.code+")"})}}
window.addEventListener("routed",function(e){var p=e.detail;
  if(p==="/cuenta")account();else if(p==="/admin")panel();else if(p.indexOf("/producto/")===0)reviews(decodeURIComponent(p.slice(10)))});
load();again();
})();
