(function(){
"use strict";
var S=window.SITE,P=window.PRODUCTS,$=function(s){return document.querySelector(s)},main=$("#main");
var fmtN=new Intl.NumberFormat(S.locale,{style:"currency",currency:S.currency});
var esc=function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var money=function(n){return typeof n==="number"?fmtN.format(n):"Precio por confirmar"};
var cat=function(id){return S.categories.find(function(c){return c.id===id})||{name:"",color:"#999"}};
var bySlug=function(s){return P.find(function(p){return p.slug===s})};
var r=document.documentElement.style;r.setProperty("--p",S.colors.primary);r.setProperty("--a",S.colors.accent);r.setProperty("--d",S.colors.dark);r.setProperty("--bg",S.colors.bg);r.setProperty("--l",S.colors.lime);
// Imagen provisional (ilustración, NO es fotografía del producto)
function ph(p){var c=cat(p.category).color;
 var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f6ece2"/><circle cx="140" cy="150" r="70" fill="'+c+'"/><circle cx="260" cy="190" r="60" fill="'+S.colors.accent+'"/><circle cx="190" cy="270" r="55" fill="'+S.colors.lime+'"/><text x="200" y="370" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#6b5b7b">Foto próximamente</text></svg>';
 return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s)}
function img(p,src){return '<img src="'+esc(src||p.image||ph(p))+'" data-ph="'+esc(ph(p))+'" alt="'+esc(src||p.image?p.name:"Imagen provisional de "+p.name)+'" loading="lazy" width="400" height="400">'}
document.addEventListener("error",function(e){var t=e.target;if(t.tagName==="IMG"&&t.dataset.ph&&t.src!==t.dataset.ph)t.src=t.dataset.ph},true);
function wa(p){var d=(S.whatsapp||"").replace(/\D/g,"");if(!d)return null;
 var m=S.orderMessage.replace("{producto}",p.name).replace("{presentacion}",p.presentation||"por confirmar").replace("{precio}",money(p.price));
 return "https://wa.me/"+d+"?text="+encodeURIComponent(m)}
function orderBtn(p){var u=wa(p);return u?'<a class="btn" href="'+u+'" target="_blank" rel="noopener">Pedir por WhatsApp</a>':'<a class="btn alt" href="#/contacto">Consultar contacto</a><p class="note">El número de WhatsApp aún no está configurado.</p>'}
function card(p){var t=(p.tags||[])[0];
 return '<a class="card" href="#/producto/'+esc(p.slug)+'"><div class="im">'+img(p)+(t?'<span class="tag">'+esc(t)+'</span>':'')+(p.available?'':'<span class="tag na">No disponible</span>')+'</div><div class="bd"><h3>'+esc(p.name)+'</h3><p>'+esc(p.short)+'</p><span class="price">'+money(p.price)+(p.oldPrice?'<span class="old">'+money(p.oldPrice)+'</span>':'')+'</span><span class="note">Ver detalles →</span></div></a>'}
function home(){var f=P.filter(function(p){return p.featured});
 var dots=[[60,18,34,S.colors.primary],[12,50,24,S.colors.lime],[70,62,30,S.colors.dark],[34,28,22,"#fff"]].map(function(d){return '<i style="left:'+d[0]+'%;top:'+d[1]+'%;width:'+d[2]+'%;height:'+d[2]+'%;background:'+d[3]+'"></i>'}).join("");
 return '<div class="wrap"><section class="hero"><div><h1>'+esc(S.heroTitle)+'</h1><p>'+esc(S.heroText)+'</p><div class="cta"><a class="btn" href="#/catalogo">Explorar catálogo</a><a class="btn alt" href="#/contacto">Consultar pedidos</a></div></div><div class="vis" role="img" aria-label="Composición gráfica decorativa de gomitas">'+dots+'</div></section>'+
 (f.length?'<section class="sec"><h2>Productos destacados</h2><div class="grid">'+f.map(card).join("")+'</div></section>':'')+
 '<section class="sec"><h2>Categorías</h2><div class="cats">'+S.categories.map(function(c){return '<a class="cat" style="background:'+c.color+'" href="#/catalogo?cat='+c.id+'">'+esc(c.name)+'</a>'}).join("")+'</div></section>'+
 '<section class="sec"><h2>Información</h2><div class="perks">'+S.perks.map(function(k){return '<div class="perk"><h3>'+esc(k.title)+'</h3><p>'+esc(k.text)+'</p></div>'}).join("")+'</div></section></div>'}
function catalogo(q){var st={q:"",cat:q.get("cat")||"",fl:"",o:""};
 var flavors=[].concat.apply([],P.map(function(p){return p.flavors||[]})).filter(function(v,i,a){return a.indexOf(v)===i}).sort();
 var html='<div class="wrap sec"><h1>Catálogo</h1><div class="tools"><input id="q" type="search" placeholder="Buscar por nombre" aria-label="Buscar por nombre"><select id="c" aria-label="Categoría"><option value="">Todas las categorías</option>'+S.categories.map(function(c){return '<option value="'+c.id+'"'+(c.id===st.cat?" selected":"")+'>'+esc(c.name)+'</option>'}).join("")+'</select>'+(flavors.length?'<select id="f" aria-label="Sabor"><option value="">Todos los sabores</option>'+flavors.map(function(f){return '<option>'+esc(f)+'</option>'}).join("")+'</select>':'')+'<select id="o" aria-label="Ordenar"><option value="">Ordenar</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option></select><button class="btn alt" id="all">Mostrar todos</button></div><p class="count" id="n" aria-live="polite"></p><div class="grid" id="g"></div></div>';
 function draw(){var l=P.filter(function(p){return(!st.q||p.name.toLowerCase().indexOf(st.q)>-1)&&(!st.cat||p.category===st.cat)&&(!st.fl||(p.flavors||[]).indexOf(st.fl)>-1)});
  if(st.o)l.sort(function(a,b){var x=a.price==null?Infinity:a.price,y=b.price==null?Infinity:b.price;return st.o==="asc"?x-y:(y===Infinity?-1:x===Infinity?1:y-x)});
  $("#n").textContent=l.length+(l.length===1?" resultado":" resultados");
  $("#g").innerHTML=l.length?l.map(card).join(""):'<div class="empty" style="grid-column:1/-1"><h2>Sin resultados</h2><p>Prueba con otra búsqueda o quita los filtros.</p></div>'}
 return {html:html,init:function(){
  $("#q").oninput=function(e){st.q=e.target.value.trim().toLowerCase();draw()};
  $("#c").onchange=function(e){st.cat=e.target.value;draw()};
  if($("#f"))$("#f").onchange=function(e){st.fl=e.target.value;draw()};
  $("#o").onchange=function(e){st.o=e.target.value;draw()};
  $("#all").onclick=function(){st={q:"",cat:"",fl:"",o:""};$("#q").value="";$("#c").value="";$("#o").value="";if($("#f"))$("#f").value="";draw()};
  draw()}}}
function producto(slug){var p=bySlug(slug);if(!p)return nf();
 var imgs=[p.image].concat(p.images||[]).filter(Boolean);
 var rel=P.filter(function(x){return x.category===p.category&&x!==p}).slice(0,4);
 return {html:'<div class="wrap"><p><a href="#/catalogo">← Volver al catálogo</a></p><article class="prod"><div><div class="pimg" id="pm">'+img(p,imgs[0])+'</div>'+(imgs.length>1?'<div class="thumbs">'+imgs.map(function(s,i){return '<button data-s="'+esc(s)+'" aria-label="Ver imagen '+(i+1)+'"><img src="'+esc(s)+'" alt="" loading="lazy"></button>'}).join("")+'</div>':'')+'</div><div><h1>'+esc(p.name)+'</h1><p class="price" style="font-size:1.6rem">'+money(p.price)+(p.oldPrice?'<span class="old">'+money(p.oldPrice)+'</span>':'')+'</p><p>'+esc(p.long||p.short)+'</p><div class="chips"><span class="chip">'+esc(cat(p.category).name)+'</span>'+(p.presentation?'<span class="chip">Presentación: '+esc(p.presentation)+'</span>':'')+(p.flavors&&p.flavors.length?p.flavors.map(function(f){return '<span class="chip">'+esc(f)+'</span>'}).join(""):'')+'<span class="chip">'+(p.available?"Disponible":"No disponible")+'</span></div>'+(p.extra?'<p>'+esc(p.extra)+'</p>':'')+orderBtn(p)+'<p class="note">WhatsApp solo inicia la conversación; el pedido no queda confirmado hasta que lo confirmen contigo.</p></div></article>'+(rel.length?'<section class="sec"><h2>Productos relacionados</h2><div class="grid">'+rel.map(card).join("")+'</div></section>':'')+'</div>',
 init:function(){document.title=p.name+" — "+S.name;document.querySelectorAll(".thumbs button").forEach(function(b){b.onclick=function(){$("#pm img").src=b.dataset.s}})}}}
function nosotros(){return '<div class="wrap sec"><h1>Sobre nosotros</h1><p>'+esc(S.about)+'</p></div>'}
function contacto(){var s=S.social,l=[];
 if(S.whatsapp)l.push('<a href="https://wa.me/'+S.whatsapp.replace(/\D/g,"")+'" target="_blank" rel="noopener">WhatsApp</a>');
 if(S.phone)l.push('<p>Tel: '+esc(S.phone)+'</p>');if(S.email)l.push('<a href="mailto:'+esc(S.email)+'">'+esc(S.email)+'</a>');
 Object.keys(s).forEach(function(k){if(s[k])l.push('<a href="'+esc(s[k])+'" target="_blank" rel="noopener">'+k[0].toUpperCase()+k.slice(1)+'</a>')});
 return '<div class="wrap sec"><h1>Contacto</h1>'+(l.length?'<div>'+l.join("")+'</div>':'<p>Aún no hay datos de contacto configurados. Agrégalos en <code>src/data/site-config.js</code>.</p>')+'<p class="note">Para pedir, abre un producto y usa el botón de pedido.</p></div>'}
function nf(){document.title="No encontrado — "+S.name;return '<div class="wrap empty"><h1>404</h1><p>Esta página no existe.</p><a class="btn" href="#/">Volver al inicio</a></div>'}
function route(){var h=location.hash.replace(/^#/,"")||"/",pq=h.split("?"),path=pq[0].replace(/\/+$/,"")||"/",q=new URLSearchParams(pq[1]||""),res,key="";
 document.title=S.name+" — "+S.slogan;
 if(path==="/"){res=home();key="home"}else if(path==="/catalogo"){res=catalogo(q);key="catalogo"}
 else if(path.indexOf("/producto/")===0){res=producto(decodeURIComponent(path.slice(10)));key="catalogo"}
 else if(path==="/nosotros"){res=nosotros();key="nosotros"}else if(path==="/contacto"){res=contacto();key="contacto"}else if(window.EXTRA&&window.EXTRA[path]){res='<div class="wrap sec" id="ex"></div>'}else res=nf();
 var o=typeof res==="string"?{html:res}:res;main.innerHTML=o.html;if(o.init)o.init();
 document.querySelectorAll("nav a[data-r]").forEach(function(a){a.classList.toggle("on",a.dataset.r===key)});
 $("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded","false");window.scrollTo(0,0);window.dispatchEvent(new CustomEvent("routed",{detail:path}))}
$("#brand").textContent=$("#fbrand").textContent=$("#fname").textContent=S.name;$("#fabout").textContent=S.about;$("#yr").textContent=new Date().getFullYear();
var fc=[];if(S.whatsapp)fc.push('<a href="https://wa.me/'+S.whatsapp.replace(/\D/g,"")+'" target="_blank" rel="noopener">WhatsApp</a>');if(S.email)fc.push('<a href="mailto:'+esc(S.email)+'">'+esc(S.email)+'</a>');if(S.phone)fc.push('<span>'+esc(S.phone)+'</span>');
$("#fcontact").innerHTML=fc.join("")||'<span>Próximamente</span>';
if(S.showLegal)$("#fcontact").innerHTML+='<a href="#/contacto">Aviso de privacidad y términos</a>';
var wu=S.whatsapp&&S.whatsapp.replace(/\D/g,"");if(wu){var h=$("#hdrOrder");h.href="https://wa.me/"+wu;h.target="_blank";h.rel="noopener"}
if(S.showDemoNotice&&P.some(function(p){return p.demo})){var d=document.createElement("div");d.className="demo";d.textContent="Datos de demostración: productos y precios de ejemplo";document.body.prepend(d)}
$("#burger").onclick=function(){var o=$("#nav").classList.toggle("open");this.setAttribute("aria-expanded",o)};
window.addEventListener("hashchange",route);route();
})();
