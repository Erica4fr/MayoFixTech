// main.js  —  Mayo Fix Tech
// Comportamiento compartido para todas las páginas.
// Este archivo se carga DESPUÉS del <script> inline de cada página
// que define la variable global `translations` con las cadenas de texto.

// ── CURSOR PERSONALIZADO
// Punto sólido + anillo exterior con efecto de lag suave (lerp 12%)
(function () {
  var cursor = document.getElementById('cursor');
  var ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  // Activar cursor: none solo si el cursor personalizado está disponible
  document.body.style.cursor = 'none';

  var mx = 0, my = 0; // coordenadas destino (posición del mouse)
  var rx = 0, ry = 0; // posición actual del anillo
  var moving = false;  // flag para pausar rAF cuando no hay movimiento
  var stopTimer;

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    mx = e.clientX;
    my = e.clientY;

    if (!moving) {
      moving = true;
      requestAnimationFrame(animRing);
    }
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () { moving = false; }, 100);
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    if (moving) requestAnimationFrame(animRing);
  }
}());

// ── MENÚ MÓVIL
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  var menu = document.getElementById('mobileMenu');
  if (menu && !e.target.closest('nav') && !e.target.closest('#mobileMenu'))
    menu.classList.remove('open');
});

// ── SCROLL REVEAL
// Añade clase "visible" cuando el elemento entra en el viewport (activa animación CSS)
(function () {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
}());

// ── FORMULARIO DE CONTACTO → WHATSAPP
// ESTADÍSTICAS (Google Analytics)
// Cada vez que alguien abre WhatsApp desde el sitio se envía el evento
// `contacto_whatsapp`, para contar consultas y no solo visitas. `via` distingue
// los botones del formulario y `ubicacion` dice qué botón fue. Nunca se envían
// nombre, correo ni mensaje: Google prohíbe datos personales y no hacen falta.
// Si Analytics no cargó (por un bloqueador de anuncios), no hace nada.
function track(evento, datos) {
  if (typeof gtag === 'function') gtag('event', evento, datos);
}

document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="https://wa.me/"]');
  if (!a) return;
  var ubicacion = a.closest('nav, #mobileMenu') ? 'menu'
                : a.closest('footer') ? 'pie'
                : a.closest('.cta-band') ? 'banda_final'
                : a.closest('.hero, .page-header') ? 'portada'
                : 'contenido';
  track('contacto_whatsapp', { via: 'boton', ubicacion: ubicacion });
});

// El sitio es estático (sin servidor), así que el formulario no puede enviar correos.
// En su lugar arma un mensaje con los datos y abre WhatsApp con el texto listo.
// Solo existe en nosotros.html; en las demás páginas no hace nada.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evita que la página se recargue y se pierdan los datos

    var en = document.documentElement.lang === 'en';
    var sel = form.servicio;
    var servicio = sel.value ? sel.options[sel.selectedIndex].text : '';

    var lineas = [
      (en ? "Hi, I'm " : 'Hola, soy ') + form.nombre.value.trim() + '.',
      (en ? 'Email: ' : 'Correo: ') + form.email.value.trim()
    ];
    if (servicio) lineas.push((en ? 'Service: ' : 'Servicio: ') + servicio);
    lineas.push('', form.mensaje.value.trim());

    // encodeURIComponent convierte espacios, tildes y saltos de línea a formato de URL
    var url = 'https://wa.me/50259924104?text=' + encodeURIComponent(lineas.join('\n'));

    // El servicio va siempre en español, para que el informe no mezcle idiomas
    var clave = sel.value ? sel.options[sel.selectedIndex].getAttribute('data-i18n') : '';
    var es = typeof translations !== 'undefined' && translations.es;
    track('contacto_whatsapp', {
      via: 'formulario',
      servicio: (clave && es && es[clave]) || servicio || 'sin elegir'
    });

    // Abre WhatsApp en una pestaña nueva; si el navegador la bloquea, lo abre en la misma
    var win = window.open(url, '_blank');
    if (win) win.opener = null;
    else location.href = url;
  });
}());

// ── MOTOR DE TRADUCCIONES
// `translations` es definido por el <script> inline de cada página antes de cargar este archivo.
// data-i18n usa textContent (texto plano, seguro contra XSS).
// data-i18n-html usa innerHTML (solo para contenido con etiquetas HTML internas).
// Por eso las cadenas de `translations` se escriben a mano en cada página y nunca
// vienen de lo que teclee la visitante, de la URL ni de localStorage: innerHTML
// ejecutaría lo que traigan.

function applyLang(lang) {
  // El idioma se guarda en localStorage, que se puede editar desde el navegador.
  // Sin esta guarda, un valor como `__proto__` hacía que translations[lang]
  // devolviera el prototipo de Object: no se aplicaba ninguna traducción, los
  // placeholders del formulario quedaban en "undefined" y el selector de idioma
  // se quedaba sin su clase de estado.
  if (lang !== 'es' && lang !== 'en') lang = 'es';

  if (typeof translations === 'undefined') return;
  var tr = translations[lang];
  if (!tr) return;

  // Título de la pestaña y atributo lang del documento
  if (tr.page_title) document.title = tr.page_title;
  document.documentElement.lang = lang;

  // Reemplaza el contenido de todos los elementos con data-i18n (texto plano)
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) el.textContent = tr[key];
  });

  // Reemplaza el contenido de elementos con data-i18n-html (explícitamente HTML)
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-html');
    if (tr[key] !== undefined) el.innerHTML = tr[key];
  });

  // Placeholders del formulario de contacto (solo nosotros.html; guarda con querySelector)
  var phs = {
    es: { nombre: 'Tu nombre', email: 'tu@correo.com', mensaje: 'Cuéntame qué necesitas...' },
    en: { nombre: 'Your name', email: 'you@email.com', mensaje: 'Tell me what you need...' }
  };
  var p = phs[lang];
  var nombre  = document.querySelector('#nombre');
  var email   = document.querySelector('#email');
  var mensaje = document.querySelector('#mensaje');
  if (nombre)  nombre.placeholder  = p.nombre;
  if (email)   email.placeholder   = p.email;
  if (mensaje) mensaje.placeholder = p.mensaje;

  // Estado visual + aria-checked del selector de idioma
  document.querySelectorAll('.lang-switch').forEach(function (sw) {
    sw.classList.toggle('is-es', lang === 'es');
    sw.classList.toggle('is-en', lang === 'en');
    sw.setAttribute('aria-checked', lang === 'en' ? 'true' : 'false');
  });

  // Reetiqueta el selector de tema en el nuevo idioma.
  // La guarda evita el caso en que applyLang corre antes de que el
  // bloque de temas, más abajo en este archivo, se haya evaluado.
  if (typeof THEME_COLORS !== 'undefined') applyTheme(currentTheme());

  localStorage.setItem('lang', lang);
}

function toggleLang() {
  applyLang((localStorage.getItem('lang') || 'es') === 'es' ? 'en' : 'es');
}

// Accesibilidad: activar lang-switch con teclado (Enter o Espacio)
document.addEventListener('keydown', function (e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('lang-switch')) {
    e.preventDefault();
    toggleLang();
  }
});

// Inicialización: aplica el idioma guardado en localStorage (o español por defecto)
applyLang(localStorage.getItem('lang') || 'es');

// ── MOTOR DE TEMAS (claro / oscuro)
// El tema se aplica en un <script> inline dentro del <head> de cada
// página, ANTES de que se pinte nada, para que no haya un destello
// del tema anterior al cargar. Este bloque solo gestiona el cambio
// posterior y el estado visual del selector.

// Color de la barra del navegador en móvil, por tema.
var THEME_COLORS = { dark: '#0E2337', light: '#F5F8FC' };

function applyTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') theme = 'dark';

  document.documentElement.setAttribute('data-theme', theme);

  // Barra de estado del navegador en móvil
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);

  // Estado visual + accesibilidad de cada selector de tema
  var lang  = document.documentElement.lang === 'en' ? 'en' : 'es';
  var label = {
    es: { dark: 'Cambiar a modo claro',  light: 'Cambiar a modo oscuro' },
    en: { dark: 'Switch to light mode',  light: 'Switch to dark mode'  }
  }[lang][theme];

  document.querySelectorAll('.theme-switch').forEach(function (sw) {
    sw.classList.toggle('is-dark',  theme === 'dark');
    sw.classList.toggle('is-light', theme === 'light');
    sw.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
    sw.setAttribute('aria-label', label);
    sw.setAttribute('title', label);
  });

  try { localStorage.setItem('theme', theme); } catch (e) {}
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function toggleTheme() {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

// Sincroniza el estado visual del selector al cargar la página.
applyTheme(currentTheme());
