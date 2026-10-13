# Reels de ofertas y publicación en Instagram

## Reels de ofertas (esta carpeta)
Plantilla de vídeo de oferta (producto, ficha, precio y descuento). Los datos están en `data/lote-prueba.json` (una fila por producto).

```
npx hyperframes render --batch data/lote-prueba.json --strict-variables --fps 30 --quality delivery --output "renders/reel-{index}-{brand}.mp4"
```
Si da `ENAMETOOLONG`, copia el proyecto a una ruta corta (por ejemplo `C:\hf\mh`) y renderiza allí. Confirma precios y descuentos antes de publicar.

## Publicación en Instagram (`publish/`)
Usa la API oficial "Instagram API with Instagram Login". La cuenta debe ser **Profesional** (Empresa o Creador); no hace falta página de Facebook.

### Puesta en marcha (una vez)
1. En https://developers.facebook.com crea una app de tipo **Empresa**, añade el producto **Instagram** y, en *Roles > Instagram testers*, añade @megahogar.es y acepta la invitación desde Instagram.
2. En *Instagram > Configuración de la API con inicio de sesión de Instagram* genera el **token** con los permisos `instagram_business_basic` e `instagram_business_content_publish`, y anota el **ID de la cuenta**.
3. En el repositorio de GitHub: *Settings > Secrets and variables > Actions*, crea los secretos `IG_USER_ID` e `IG_ACCESS_TOKEN`. Nunca los escribas en archivos ni en un chat.

### Cómo se publica
- La cola está en `publish/queue.json`. Cada pieza tiene `video`, `caption`, `scheduled_at` (UTC) y `status` (`draft`, `approved`, `published` o `failed`).
- Una pieza se aprueba cambiando su estado a `approved` y fusionando el cambio. GitHub Actions (`.github/workflows/publicar.yml`) publica cada hora la primera pieza aprobada cuya hora ya haya llegado.
- Comprobar la cola: `node publish/validate-queue.mjs`.
- Probar sin publicar: pestaña *Actions > Publicar Reels aprobados > Run workflow* con simulación activada.

### Uso local (opcional)
Copia `publish/.env.example` a `publish/.env` y rellénalo. Después: `node publish/instagram.mjs --list`, `--approve all`, `--due` (simulación) y `--due --publish`.

### Token
Caduca a los 60 días. Renuévalo con `node publish/instagram.mjs --refresh-token` y actualiza el secreto `IG_ACCESS_TOKEN`. El repositorio abre un aviso los días 1 y 20 de cada mes.
