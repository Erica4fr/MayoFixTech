# Mayo Fix Tech

Sitio web de **Mayo Fix Tech**, servicio técnico en Santa Cruz del Quiché, Guatemala: reparación de computadoras, páginas web en WordPress y sistemas a medida.

**En línea:** [mayofixtech.com](https://mayofixtech.com)

---

## Qué es

Un sitio estático de cinco páginas, escrito a mano en HTML, CSS y JavaScript. **Sin frameworks, sin dependencias y sin proceso de compilación**: lo que está en el repositorio es exactamente lo que se sirve al navegador. Pesa menos de 500 KB completo.

## Lo que hace

**Bilingüe español / inglés.** El texto se cambia sin recargar la página: cada elemento traducible lleva un atributo `data-i18n` y cada página define sus cadenas en un objeto `translations`. La elección se guarda en el navegador.

**Tema claro y oscuro.** Un selector junto al de idioma. El tema se aplica desde un script en el `<head>`, antes de que el navegador pinte nada, para que al recargar no se vea un destello del tema anterior. El sitio abre siempre en oscuro; si el visitante elige otro tema, se recuerda.

**Color por tokens.** Variables semánticas encima de escalas de color; el cambio de tema redefine las variables, no los componentes. El tema oscuro usa los colores de la marca, azul marino y dorado. El tema claro usa una paleta distinta de azul eléctrico, cian y grises fríos. En ella el cian solo aparece en botones y superficies, porque como texto sobre fondo claro no alcanza contraste legible.

**Contraste verificado.** Cada combinación de texto y fondo se comprobó contra el mínimo de WCAG 2.1 AA (4,5:1 en texto normal, 3:1 en texto grande) midiendo el resultado renderizado, en las seis páginas y en los dos temas.

**Responsive.** De 360 px a escritorio. En pantallas estrechas la navegación se repliega en un menú desplegable.

**Preparado para buscadores y para compartir.** Datos estructurados `LocalBusiness` de Schema.org, `sitemap.xml`, `robots.txt`, URL canónica por página y etiquetas Open Graph con imagen de vista previa para WhatsApp y redes sociales.

**Contacto por WhatsApp.** El sitio no tiene servidor, así que el formulario no envía correo: toma los datos, arma un mensaje y abre WhatsApp con el texto listo para enviar.

## Estructura

```
index.html        Portada
reparacion.html   Reparación de computadoras
wordpress.html    Páginas web en WordPress
sistemas.html     Sistemas y software a medida
nosotros.html     Sobre mí y formulario de contacto
404.html          Página de error
css/styles.css    Hoja de estilos única (tokens + componentes + los dos temas)
js/main.js        Idioma, tema, menú móvil, animaciones al hacer scroll y formulario
```

## Verlo en local

No hace falta compilar nada. Basta con un servidor estático, porque abrir los archivos con `file://` cambia el comportamiento del almacenamiento del navegador:

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.

## Próximas mejoras

- Galería de trabajos hechos, con fotos reales de reparaciones.
- Testimonios de clientes.
- Comprimir `FotoErica.jpg` a WebP con respaldo en JPG.
- Formulario con envío real por correo, si en algún momento el sitio pasa a un alojamiento con servidor.
- Versión en idioma k'iche', por la zona en la que trabajo.

## Licencia

El código puede reutilizarse libremente. El contenido, el logotipo, las fotografías y la marca **Mayo Fix Tech** son propios y no lo están.

---

**Autora:** Erica Alejandra Franco Rosales · [@Erica4fr](https://github.com/Erica4fr)
