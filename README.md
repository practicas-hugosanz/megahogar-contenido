# Megahogar · contenido de Instagram

Todo lo necesario para crear, revisar y publicar los Reels de **@megahogar.es** con ayuda de Claude.
Claude escribe el guion, genera la voz, monta el vídeo con clips reales y prepara la publicación. Vosotros revisáis y aprobáis.

<p align="center">
  <a href="https://github.com/practicas-hugosanz/megahogar-contenido/releases/latest/download/Instalar-Megahogar.bat">
    <img alt="Descargar instalador para Windows" src="https://img.shields.io/badge/%E2%AC%87%20Descargar%20instalador-Windows-E8541E?style=for-the-badge&labelColor=1F2D5F" />
  </a>
</p>

<p align="center"><sub>Haz doble clic en <code>Instalar-Megahogar.bat</code> y sigue las preguntas. Después, en Claude: <i>"hazme un reel de megahogar de..."</i>. Si Windows avisa de que es un archivo desconocido: Más información > Ejecutar de todas formas.</sub></p>

**Panel de seguimiento:** https://practicas-hugosanz.github.io/megahogar-contenido/ (calendario, vídeos, captions, siguiente paso y guía de puesta en marcha).

## El flujo en 5 pasos

```
1. Idea            2. Claude lo crea          3. Revisión              4. Aprobación           5. Publicación
Issue "Idea de     Guion + voz + vídeo +      Se abre un Pull          Se fusiona el Pull      Cada hora, GitHub
Reel" (o se lo     caption en una rama        Request con la lista     Request: el Reel pasa   publica en Instagram
pides a Claude)    nueva                      de comprobación          a "approved"            lo aprobado a su hora
```

Nada se publica sin que alguien lo haya aprobado fusionando el Pull Request.

## Instalación en el ordenador de tu socio (Windows)

**Lo más fácil:** en el [panel](https://practicas-hugosanz.github.io/megahogar-contenido/#instalar), pestaña **Instalar**, pulsa **Descargar instalador** y haz doble clic en `Instalar-Megahogar.bat`. Es equivalente a lo de abajo.

Con esto, desde su propio Claude basta con decir *"hazme un reel de megahogar de..."* y Claude hace el Reel como en este proyecto.

```powershell
git clone https://github.com/practicas-hugosanz/megahogar-contenido.git
cd megahogar-contenido
powershell -ExecutionPolicy Bypass -File instalar.ps1
```

El instalador (léelo antes si quieres: `instalar.ps1`):
1. Comprueba Git, Node.js 22, Python 3 y FFmpeg, y **pregunta** antes de instalar cada uno con winget.
2. Descarga el proyecto en `Documentos\Megahogar\megahogar-contenido`.
3. Instala las herramientas de vídeo (HyperFrames) y, si aceptas, el modelo de voz local y los clips de stock.
4. Añade a Claude la habilidad `megahogar-reel` (en `~\.claude\skills`), que le lleva al proyecto y le hace seguir `CLAUDE.md`.

Después, solo falta **conectar ElevenLabs** en Claude (Ajustes > Conectores) con su cuenta. No pide ni guarda claves y no publica nada en Instagram.

Opciones: `-Yes` (no pregunta), `-SinModelos`, `-SinClips`, `-Destino <carpeta>` y `-Simular` (solo muestra lo que haría).

## Cómo crear un Reel nuevo

1. Clona el repositorio y ábrelo en **Claude Code** (app de escritorio o terminal). Claude lee `CLAUDE.md` y ya conoce la marca, el formato y las reglas.
2. Pídele algo como:
   > Haz un Reel "directo" nuevo sobre cómo elegir una aspiradora, con el mismo formato que los de lavadora, frigorífico y lavavajillas. Propón el guion primero.
3. Claude propone el guion, genera la voz con ElevenLabs, te pide permiso para descargar los clips de stock, monta el vídeo, revisa los fotogramas y añade el caption a `megahogar-reels/publish/queue.json` en estado `draft`.
4. Abre un **Pull Request** con el cambio. Revisa el vídeo y la lista de comprobación de la plantilla.
5. Para aprobarlo, cambia `"status": "draft"` a `"approved"` en la cola (se puede hacer en la propia web de GitHub, con el lápiz) y **fusiona** el Pull Request.

## Qué hay en el repositorio

| Carpeta | Para qué sirve |
|---|---|
| `CLAUDE.md` | Instrucciones que Claude lee solo: marca, estrategia, flujo y reglas. |
| `REVISION.md` | Afirmaciones que alguien de la tienda debe validar antes de publicar. |
| `megahogar-directo/` | **Reels de tips con vídeo real, voz y sonido.** Plantilla principal. |
| `megahogar-reels/` | Reels de ofertas (precio y descuento) y la herramienta que publica en Instagram (`publish/`). |
| `megahogar-carrusel/` | Carrusel de 6 diapositivas del tamaño de TV (se sube a mano). |
| `docs/` y `scripts/` | El panel web (se publica solo en GitHub Pages) y el script que lo construye. |
| `.github/` | Comprobaciones, publicación automática, recordatorio del token y plantillas. |

## Configurar una vez

1. **Cuenta de Instagram Profesional** (Empresa o Creador).
2. **App de Meta** en developers.facebook.com con el producto *Instagram* y el permiso `instagram_business_content_publish` (pasos en `megahogar-reels/LEEME.md`).
3. En el repositorio: **Settings > Secrets and variables > Actions > New repository secret**. Crea dos secretos:
   - `IG_USER_ID`: el ID de la cuenta de Instagram.
   - `IG_ACCESS_TOKEN`: el token de larga duración.
   Los secretos no son visibles para nadie, ni siquiera en un repositorio público. **Nunca** los escribas en un archivo ni en un chat.
4. Prueba el flujo sin publicar: pestaña **Actions > Publicar Reels aprobados > Run workflow** con *simulación* activada.
5. Cada ~50 días hay que renovar el token (el repositorio abre un aviso los días 1 y 20 de cada mes): `node megahogar-reels/publish/instagram.mjs --refresh-token` y actualizar el secreto.

## Requisitos en el ordenador de quien crea los vídeos

- **Claude Code** con el conector de **ElevenLabs** (voz) activado.
- **Node.js 22**, **Python 3** y **FFmpeg** (Windows: `winget install OpenJS.NodeJS Python.Python.3 Gyan.FFmpeg`).
- La primera vez, pedir a Claude: `npx hyperframes skills update`.
- Los clips de stock no están en el repositorio: `bash megahogar-directo/fetch-stock.sh` los descarga y prepara (licencia gratuita de Pexels).

## Costes y límites

- Voz de ElevenLabs: unos 2 céntimos por Reel. Clips de Pexels, efectos de sonido, GitHub Actions e Instagram API: gratis.
- Los carruseles se publican a mano. No hay música de fondo (se añade desde la app de Instagram al publicar).
- Los clips de stock no son vuestras máquinas: grabar 10 segundos en la tienda mejora mucho los vídeos.
- Resultados no garantizados: publicar con constancia, responder comentarios y medir durante 4 semanas.

## Seguridad

- Este repositorio es **público**: cualquiera puede ver el contenido y la cola de publicación (captions y fechas), pero no los secretos.
- Solo quien tenga permisos de escritura puede fusionar cambios, y por tanto aprobar publicaciones.
