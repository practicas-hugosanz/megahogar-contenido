# Megahogar · contenido de Instagram

Todo lo necesario para crear, revisar y publicar los Reels de **@megahogar.es** con ayuda de Claude.
Claude escribe el guion, genera la voz, monta el vídeo con clips reales y prepara la publicación. Una persona del equipo revisa y aprueba.

<p align="center">
  <a href="https://github.com/practicas-hugosanz/megahogar-contenido/releases/latest/download/Instalar-Megahogar.bat">
    <img alt="Descargar instalador para Windows" src="https://img.shields.io/badge/%E2%AC%87%20Descargar%20instalador-Windows-E8541E?style=for-the-badge&labelColor=1F2D5F" />
  </a>
</p>

<p align="center"><sub>Haz doble clic en <code>Instalar-Megahogar.bat</code> y sigue las preguntas. Después, en Claude: <i>"hazme un reel de megahogar de..."</i>. Si Windows avisa de que es un archivo desconocido: Más información > Ejecutar de todas formas.</sub></p>

## El flujo en 5 pasos

```
1. Idea            2. Claude lo crea          3. Revisión              4. Aprobación           5. Publicación
Issue "Idea de     Guion + voz + vídeo +      Se abre un Pull          Se fusiona el Pull      Cada hora, GitHub
Reel" (o se lo     caption en una rama        Request con la lista     Request: el Reel pasa   publica en Instagram
pide a Claude)     nueva                      de comprobación          a "approved"            lo aprobado a su hora
```

Nada se publica sin que alguien lo haya aprobado fusionando el Pull Request.

## Instalación (Windows)

Con esto, desde Claude basta con decir *"hazme un reel de megahogar de..."* y Claude hace el Reel como en este proyecto.

**Lo más fácil:** pulsa el botón de arriba y haz doble clic en `Instalar-Megahogar.bat`.

**Desde PowerShell:**

```powershell
git clone https://github.com/practicas-hugosanz/megahogar-contenido.git
cd megahogar-contenido
powershell -ExecutionPolicy Bypass -File instalar.ps1
```

El instalador (se puede leer antes en `instalar.ps1`):
1. Comprueba Git, Node.js 22, Python 3 y FFmpeg, y **pregunta** antes de instalar cada uno con winget.
2. Descarga el proyecto en `Documentos\Megahogar\megahogar-contenido`.
3. Instala las herramientas de vídeo (HyperFrames) y, si se acepta, el modelo de voz local y los clips de stock.
4. Añade a Claude la habilidad `megahogar-reel` (en `~\.claude\skills`), que le lleva al proyecto y le hace seguir `CLAUDE.md`.

Después solo falta **conectar ElevenLabs** en Claude (Ajustes > Conectores) con una cuenta propia. El instalador no pide ni guarda claves y no publica nada en Instagram.

Opciones: `-Yes` (no pregunta), `-SinModelos`, `-SinClips`, `-Destino <carpeta>` y `-Simular` (solo muestra lo que haría).

## Cómo crear un Reel nuevo

1. Abre la carpeta del proyecto en **Claude Code** (app de escritorio o terminal). Claude lee `CLAUDE.md` y ya conoce la marca, el formato y las reglas.
2. Pídele algo como:
   > Haz un Reel "directo" nuevo sobre cómo elegir una aspiradora, con el mismo formato que los de lavadora, frigorífico y lavavajillas. Propón el guion primero.
3. Claude propone el guion, genera la voz con ElevenLabs, pide permiso para descargar los clips de stock, monta el vídeo, revisa los fotogramas y añade el caption a `megahogar-reels/publish/queue.json` en estado `draft`.
4. Se abre un **Pull Request** con el cambio. Se revisa el vídeo y la lista de comprobación de la plantilla.
5. Para aprobarlo, se cambia `"status": "draft"` a `"approved"` en la cola (se puede hacer en la propia web de GitHub, con el lápiz) y se **fusiona** el Pull Request.

## Qué hay en el repositorio

| Carpeta | Para qué sirve |
|---|---|
| `CLAUDE.md` | Instrucciones que Claude lee solo: marca, estrategia, flujo y reglas. |
| `REVISION.md` | Afirmaciones que alguien de la tienda debe validar antes de publicar. |
| `megahogar-directo/` | **Reels de tips con vídeo real, voz y sonido.** Plantilla principal. |
| `megahogar-reels/` | Reels de ofertas (precio y descuento) y la herramienta que publica en Instagram (`publish/`). |
| `megahogar-carrusel/` | Carrusel de 6 diapositivas del tamaño de TV (se sube a mano). |
| `skill/` e `instalar.ps1` | La habilidad de Claude y el instalador. |
| `.github/` | Comprobaciones, publicación automática, recordatorio del token y plantillas. |

## Configurar la publicación (una vez)

1. **Cuenta de Instagram Profesional** (Empresa o Creador).
2. **App de Meta** en developers.facebook.com con el producto *Instagram* y el permiso `instagram_business_content_publish` (pasos en `megahogar-reels/LEEME.md`).
3. En el repositorio: **Settings > Secrets and variables > Actions > New repository secret**. Crear dos secretos:
   - `IG_USER_ID`: el ID de la cuenta de Instagram.
   - `IG_ACCESS_TOKEN`: el token de larga duración.

   Los secretos no son visibles para nadie, ni siquiera en un repositorio público. **Nunca** se escriben en un archivo ni en un chat.
4. Probar el flujo sin publicar: **Actions > Publicar Reels aprobados > Run workflow** con *simulación* activada.
5. Cada ~50 días hay que renovar el token (el repositorio abre un aviso los días 1 y 20 de cada mes): `node megahogar-reels/publish/instagram.mjs --refresh-token` y actualizar el secreto.

## Requisitos en el ordenador de quien crea los vídeos

- **Claude Code** con el conector de **ElevenLabs** (voz) activado.
- **Node.js 22**, **Python 3** y **FFmpeg** (Windows: `winget install OpenJS.NodeJS Python.Python.3 Gyan.FFmpeg`). El instalador se encarga de esto.
- Los clips de stock no están en el repositorio: `bash megahogar-directo/fetch-stock.sh` los descarga y prepara (licencia gratuita de Pexels).

## Costes y límites

- Voz de ElevenLabs: unos 2 céntimos por Reel. Clips de Pexels, efectos de sonido, GitHub Actions e Instagram API: gratis.
- Los carruseles se publican a mano. No hay música de fondo (se añade desde la app de Instagram al publicar).
- Los clips de stock no son máquinas de la tienda: grabar 10 segundos en el local mejora mucho los vídeos.
- Resultados no garantizados: publicar con constancia, responder comentarios y medir durante 4 semanas.

## Seguridad

- Este repositorio es **público**: cualquiera puede ver el contenido y la cola de publicación (captions y fechas), pero no los secretos.
- Solo quien tenga permisos de escritura puede fusionar cambios, y por tanto aprobar publicaciones.
