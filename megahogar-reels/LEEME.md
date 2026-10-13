# Megahogar · Reels automáticos

## Generar vídeos
1. Edita `data/lote-prueba.json` (una fila por producto: categoría, marca, modelo, chips, precio, descuento, foto).
2. Renderiza desde una **ruta corta** (la ruta de esta carpeta puede ser demasiado larga para el renderizador):
   ```
   npx hyperframes render --batch data/lote-prueba.json --strict-variables --fps 30 --quality delivery --output "renders/reel-{index}-{brand}.mp4"
   ```
   Si da `ENAMETOOLONG`, copia el proyecto a `C:\hf\mh` y renderiza allí.
3. La plantilla es `index.html`; vista previa con `npx hyperframes preview`.

## Publicar en Instagram (API oficial "Instagram API with Instagram Login")
La cuenta debe ser **Profesional** (Empresa o Creador). No hace falta página de Facebook.

1. En https://developers.facebook.com crea una app de tipo **Empresa**, añade el producto **Instagram** y, en *Roles → Instagram testers*, añade @megahogar.es y acepta la invitación desde Instagram (Configuración → Sitio web y herramientas → Invitaciones).
2. En *Instagram → Configuración de la API con inicio de sesión de Instagram* genera el **token de acceso** de @megahogar.es con los permisos `instagram_business_basic` e `instagram_business_content_publish`. Anota también el **ID de la cuenta de Instagram**.
3. Copia `publish/.env.example` a `publish/.env` y rellena `IG_USER_ID` e `IG_ACCESS_TOKEN`. Ese archivo no se comparte con nadie.
4. Flujo:
   ```
   node publish/build-queue.mjs --start 2026-10-14 --hour 19 --every 2   # crea la cola (estado draft)
   node publish/instagram.mjs --list                                      # revisa fechas y vídeos; edita textos en publish/queue.json
   node publish/instagram.mjs --approve all                               # aprueba lo revisado
   node publish/instagram.mjs --due                                       # simulación
   node publish/instagram.mjs --due --publish                             # publica de verdad lo aprobado y vencido
   ```
5. Automático: `powershell -ExecutionPolicy Bypass -File publish\schedule-windows.ps1` (revisa cada hora; el PC debe estar encendido).
6. El token dura ~60 días: renuévalo con `node publish/instagram.mjs --refresh-token` y actualiza `.env`.

Nada se publica sin estado `approved` y sin `--publish`.

## Pendiente de revisar antes de publicar
- Precios y descuentos del lote de prueba (copiados del vídeo de liquidación). La web muestra la Bosch WUU28T63ES a 459,50 €, frente a 399 € del vídeo.
- Fotos de producto de más resolución (las de la web son 500x500).
- Música: los vídeos van sin audio.
