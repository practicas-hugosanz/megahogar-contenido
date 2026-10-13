# Paquete de tips · pendiente de revisión

Nada de esto se ha publicado. Una persona de la tienda debe revisar los consejos antes de aprobar.

## Archivos
- Reels: `megahogar-tips/renders/tips-lavadora.mp4`, `tips-frigorifico.mp4`, `tips-lavavajillas.mp4` (16,5 s, 1080x1920).
- Carrusel TV: `megahogar-carrusel/slides/slide-1.png` … `slide-6.png` (1080x1350).
- Editar textos de los Reels: `megahogar-tips/data/tips-lote.json` y volver a renderizar (ver LEEME del proyecto de Reels).

## Textos de publicación propuestos

**Lavadora**
4 errores que estropean tu lavadora 🧺 ¿Cuántos cometes? Guarda este vídeo y compártelo con quien siempre llena la lavadora hasta arriba.
👉 Encuentra tu lavadora en megahogar.es o en tu tienda Megahogar.
#megahogar #lavadora #trucos #hogar #electrodomesticos #tipsdehogar

**Frigorífico**
Cómo elegir tu frigorífico en 4 pasos 🧊 Guárdalo para cuando toque cambiar el tuyo.
👉 Mira nuestros frigoríficos en megahogar.es o en tu tienda Megahogar.
#megahogar #frigorifico #electrodomesticos #tipsdehogar #cocina

**Lavavajillas**
4 trucos para que tu lavavajillas dure más y lave mejor 🍽️ ¿Cuál no conocías?
👉 Encuentra el tuyo en megahogar.es o en tu tienda Megahogar.
#megahogar #lavavajillas #trucos #hogar #electrodomesticos #tipsdehogar

**Carrusel · ¿Qué tamaño de TV elegir?**
¿Qué tamaño de tele te conviene según la distancia a tu sofá? 📺 Guárdalo para cuando elijas la tuya y cuéntanos en comentarios cuántas pulgadas tienes.
👉 Pregúntanos sin compromiso en tu tienda Megahogar o en megahogar.es.
#megahogar #television #tv #hogar #electrodomesticos

## Afirmaciones a verificar antes de publicar
**Lavadora**
- "Deja un hueco de una mano en el tambor": regla práctica habitual; confirmar con el manual del fabricante.
- "Más detergente deja residuos y malos olores": cierto en general; la dosis exacta depende del producto y de la dureza del agua.
- "Deja la puerta y el cajetín entreabiertos": recomendación habitual para evitar humedad y malos olores.
- "Lavado en caliente sin ropa de vez en cuando": mirar la frecuencia que indique cada marca.

**Frigorífico**
- "No Frost: frío más uniforme": ventaja habitual de la tecnología; confirmar que aplica a los modelos que vendéis.
- "Margen para la ventilación": comprobar la medida exacta que pide cada fabricante.
- Etiqueta energética: una clase más eficiente consume menos.

**Lavavajillas**
- "No aclares los platos": suele recomendarse quitar solo los restos grandes; algunos fabricantes y aguas duras pueden matizarlo.
- "Limpia el filtro con regularidad": frecuencia según manual.
- "Sal y abrillantador según la dureza del agua": cierto; la dosis depende de la zona.
- "No lo sobrecargues / no bloquees los brazos": recomendación estándar.

**Carrusel TV**
- Los rangos de distancia (1,5–2 m, 2–2,5 m, 2,5–3 m, +3,5 m) vienen de vuestra publicación anterior. Falta el tramo 3–3,5 m (entre 75” y 85”); conviene decidir qué tamaño se recomienda ahí.

## Locución (ElevenLabs, voz Gala)
- Vídeos con voz: `megahogar-tips/renders/tips-lavadora-voz.mp4`, `tips-frigorifico-voz.mp4`, `tips-lavavajillas-voz.mp4` (23-27 s).
- Audios: `megahogar-tips/audio/*.mp3`. Los textos hablados están en el guion de cada generación y son una versión resumida de los textos de pantalla.
- Coste: unos 1.060 créditos en total (346 + 391 + 320), unos 0,11 USD.
- Para regenerar con otra voz o texto: se genera el audio, se transcribe para sacar los tiempos y se actualizan `s1`-`s4`, `sEnd` y `total` en `data/<nombre>-voz.json` antes de renderizar.
- Sin música de fondo: el conector de ElevenLabs conectado solo cubre voz.

## Vídeo real de fondo (Pexels)
- Vídeos finales: `megahogar-tips/renders/tips-lavadora-real.mp4`, `tips-frigorifico-real.mp4`, `tips-lavavajillas-real.mp4`.
- Clips usados (licencia Pexels: uso comercial gratuito, sin atribución obligatoria): 8756886 y 8756701 (lavadora), 9032882 y 35576751 (frigorífico), 7641501 y 9462908 (lavavajillas). Originales 4K en `megahogar-tips/assets/stock/raw`, versiones ligeras en `assets/stock`.
- Regenerar: `bash megahogar-tips/render-tips.sh [lavadora|frigorifico|lavavajillas]`. Cambiar los clips en `data/<nombre>-voz.json` (`hookClip`, `tipClip`).
- La lavadora usa imágenes de una lavandería industrial; el lavavajillas, de fregado a mano. Quedan relacionadas con el tema pero no son electrodomésticos domésticos de Megahogar.

## Pendiente
- Sin música en los vídeos.
- Tipografía Oswald (parecida a la de la marca).
- Publicación automática: los Reels pueden ir por el script de `megahogar-reels/publish`; los carruseles necesitan subir las imágenes a una URL pública (no implementado aún).
