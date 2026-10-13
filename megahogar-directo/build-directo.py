#!/usr/bin/env python3
"""Genera index.html (Reel "directo": texto cinético + vídeo real + voz + sonido) a partir de data/<slug>.json.

Uso:  python build-directo.py lavadora
      (render-directo.sh lo ejecuta y renderiza cada Reel)

Cada JSON define: voz (mp3), duración total, gancho (vídeo + palabras con su tiempo),
giro, bloques 3 y 4 (filas de texto + vídeo en recuadro) y cierre. Los tiempos salen
de la transcripción de la locución.
"""
import json
import math
import os
import sys

root = os.path.dirname(os.path.abspath(__file__))


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def words(text):
    return "".join(f'<span class="w">{esc(w)}</span>' for w in text.split(" "))


def lines_for(text, size, upper):
    per_char = 0.47 if upper else 0.42
    return max(1, math.ceil(len(text) * per_char * size / 930))


class Beat:
    def __init__(self, bid, y0=250):
        self.id = bid
        self.y = y0
        self.html = []
        self.js = []
        self.n = 0

    def add_rows(self, rows):
        for r in rows:
            self.n += 1
            kind = r.get("kind", "big")
            rid = f"{self.id}r{self.n}"
            t = r["t"]
            if kind == "small":
                size = r.get("size", 76)
                nl = lines_for(r["text"], size, False)
                h = int(nl * size * 1.15)
                self.html.append(
                    f'<div class="small line" id="{rid}" style="top:{self.y}px;font-size:{size}px;font-weight:400">{esc(r["text"])}</div>'
                )
                self.js.append(f'tl.from("#{rid}", {{ y: 40, opacity: 0, duration: 0.3, ease: "power3.out" }}, {t});')
                self.y += h + 14
            else:
                size = r.get("size", 160)
                nl = lines_for(r["text"], size, True)
                h = int(nl * size * 0.98)
                style = f"top:{self.y}px;font-size:{size}px"
                if kind == "navy":
                    style += ";color:var(--navy)"
                inner = words(r["text"])
                if kind == "strike":
                    inner = f'<span class="strike-wrap">{inner}<span class="strike" id="{rid}s"></span></span>'
                if kind == "hl":
                    inner = f'<span class="hl" id="{rid}h"><span class="hlword">{inner}</span></span>'
                self.html.append(f'<div class="line" id="{rid}" style="{style}">{inner}</div>')
                st = r.get("stagger", 0.15)
                self.js.append(
                    f'tl.from("#{rid} .w", {{ y: 130, opacity: 0, duration: 0.3, ease: "back.out(2)", stagger: {st} }}, {t});'
                )
                if kind == "strike":
                    self.js.append(f'tl.to("#{rid}s", {{ width: "108%", duration: 0.3, ease: "power2.out" }}, {r["ts"]});')
                if kind == "hl":
                    self.js.append(f'tl.set("#{rid}h", {{ "--hl": 0 }}, 0);')
                    self.js.append(f'tl.to("#{rid}h", {{ "--hl": 1, duration: 0.35, ease: "power2.out" }}, {t + 0.05});')
                self.y += h + 18
        return self


def build(slug):
    cfg = json.load(open(os.path.join(root, "data", f"{slug}.json"), encoding="utf-8"))
    css = open(os.path.join(root, "templates", "directo.css"), encoding="utf-8").read()
    total = cfg["total"]
    hook, twist, b3c, b4c, b5c = cfg["hook"], cfg["twist"], cfg["b3"], cfg["b4"], cfg["b5"]
    w2, w3, w4, w5 = twist["wipe"], b3c["wipe"], b4c["wipe"], b5c["wipe"]
    sfx = []

    def whoosh(t):
        sfx.append(("whoosh-short", t, 0.57, 0.45))

    # Beat 1
    hook_words = "".join(f'<span class="w">{esc(w)}</span>' for w, _ in hook["words"])
    b1 = (
        f'<div class="beat b1" id="beat1"><video id="v-hook" class="vid full" src="{hook["clip"]}" muted playsinline '
        f'data-start="0" data-duration="{w2 + 0.5:.2f}" data-media-start="{hook.get("ms", 0)}" data-track-index="0"></video>'
        f'<div class="shade"></div><div class="line shadowtxt" style="top:{hook.get("top", 1000)}px;font-size:{hook.get("size", 190)}px;line-height:1.08">{hook_words}</div></div>'
    )
    js = []
    for i, (_, t) in enumerate(hook["words"]):
        js.append(f'tl.from(hw[{i}], {{ y: 120, opacity: 0, rotation: 5, duration: 0.3, ease: "back.out(2)" }}, {t});')
    js_hook = "const hw = document.querySelectorAll('#beat1 .w');\n      " + "\n      ".join(js)
    js_hook += f'\n      tl.fromTo("#v-hook", {{ scale: 1.12 }}, {{ scale: 1, duration: {w2 + 0.5:.2f}, ease: "power1.out" }}, 0);'

    # Beat 2
    tag = twist.get("tag")
    b2 = Beat("b2", 700 if tag else 600).add_rows(twist["rows"])
    tag_html = f'<div class="tag" id="tag2" style="top:{540 if tag else 0}px">{esc(tag[0])}</div>' if tag else ""
    beat2 = f'<div class="beat b2" id="beat2">{tag_html}{"".join(b2.html)}</div>'
    js_b2 = [f'tl.to("#beat2", {{ clipPath: "inset(0 0 0% 0)", duration: 0.4, ease: "power3.inOut" }}, {w2});']
    if tag:
        js_b2.append(f'tl.from("#tag2", {{ x: -500, duration: 0.4, ease: "back.out(1.6)" }}, {tag[1]});')
    js_b2 += b2.js
    whoosh(w2 - 0.05)
    sfx.append(("impact-bass-1", twist["rows"][0]["t"] - 0.05, 2.1, 0.4))

    # Beats 3 y 4 con vídeo en recuadro
    def inset(bid, vid, cfg_b, start, end):
        return (
            f'<div class="inset" id="inset-{bid}"><video id="{vid}" class="vid" src="{cfg_b["clip"]}" muted playsinline '
            f'data-start="{start:.2f}" data-duration="{end - start:.2f}" data-media-start="{cfg_b.get("ms", 0)}" data-track-index="0"></video></div>'
        )

    b3 = Beat("b3").add_rows(b3c["rows"])
    b4_check = Beat("b4").add_rows(b4c["rows"])
    for nm, bb in (("b3", b3), ("b4", b4_check)):
        if bb.y > 1000:
            print(f"AVISO: el bloque {nm} llega a y={bb.y} y chocará con el vídeo (máx. 1000). Reduce tamaños o texto.")
    beat3 = f'<div class="beat b3" id="beat3">{"".join(b3.html)}{inset("b3", "v-b3", b3c, w3 + 0.2, w4 + 0.5)}</div>'
    js_b3 = [
        f'tl.to("#beat3", {{ clipPath: "inset(0 0% 0 0)", duration: 0.4, ease: "power3.inOut" }}, {w3});',
        f'tl.from("#inset-b3", {{ y: 200, opacity: 0, duration: 0.45, ease: "power3.out" }}, {w3 + 0.3});',
    ] + b3.js
    whoosh(w3 - 0.05)

    b4 = Beat("b4").add_rows(b4c["rows"])
    beat4 = f'<div class="beat b4" id="beat4">{"".join(b4.html)}{inset("b4", "v-b4", b4c, w4 + 0.2, w5 + 0.5)}</div>'
    js_b4 = [
        f'tl.to("#beat4", {{ clipPath: "inset(0% 0 0 0)", duration: 0.4, ease: "power3.inOut" }}, {w4});',
        f'tl.from("#inset-b4", {{ y: 200, opacity: 0, duration: 0.45, ease: "power3.out" }}, {w4 + 0.3});',
    ] + b4.js
    whoosh(w4 - 0.05)
    for r in b3c["rows"]:
        if r.get("kind") == "strike":
            sfx.append(("click", r["ts"] - 0.02, 0.37, 0.7))

    # Beat 5
    b5 = Beat("b5", 380).add_rows(b5c["rows"])
    hy = b5.y + 70
    beat5 = (
        f'<div class="beat b5" id="beat5">{"".join(b5.html)}<div class="handle" id="handle" style="top:{hy}px">@megahogar.es</div>'
        f'<img id="logo" src="assets/logo-megahogar.png" alt="Megahogar Electrodomésticos" style="top:{hy + 200}px" /></div>'
    )
    js_b5 = [
        f'tl.to("#beat5", {{ clipPath: "inset(0 0 0 0%)", duration: 0.4, ease: "power3.inOut" }}, {w5});',
        f'tl.from("#handle", {{ scale: 0.6, opacity: 0, duration: 0.45, ease: "back.out(2)" }}, {b5c["handleT"]});',
        f'tl.from("#logo", {{ y: 40, opacity: 0, duration: 0.45, ease: "power3.out" }}, {b5c["logoT"]});',
    ] + b5.js
    whoosh(w5 - 0.05)
    sfx.append(("sparkle", b5c["handleT"], 1.7, 0.4))

    hides = [
        f'tl.set("#beat1", {{ visibility: "hidden" }}, {w2 + 0.5});',
        f'tl.set("#beat2", {{ visibility: "hidden" }}, {w3 + 0.5});',
        f'tl.set("#beat3", {{ visibility: "hidden" }}, {w4 + 0.5});',
        f'tl.set("#beat4", {{ visibility: "hidden" }}, {w5 + 0.5});',
    ]

    audio = [f'<audio id="vo" src="{cfg["voice"]}" data-start="0" data-track-index="1" data-volume="1"></audio>']
    for i, (name, t, d, v) in enumerate(sfx):
        audio.append(
            f'<audio id="sfx{i}" src="assets/sfx/{name}.mp3" data-start="{max(t, 0):.2f}" data-duration="{d}" data-track-index="{i + 2}" data-volume="{v}"></audio>'
        )

    html = f"""<!doctype html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>{css}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1080" data-height="1920">
      {b1}
      {beat2}
      {beat3}
      {beat4}
      {beat5}
      {"".join(audio)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
      {js_hook}
      {chr(10).join("      " + j for j in js_b2).strip()}
      {chr(10).join("      " + j for j in js_b3).strip()}
      {chr(10).join("      " + j for j in js_b4).strip()}
      {chr(10).join("      " + j for j in js_b5).strip()}
      {chr(10).join("      " + j for j in hides).strip()}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
    open(os.path.join(root, "index.html"), "w", encoding="utf-8").write(html)
    return total


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Uso: python build-directo.py <slug>")
    print("index.html generado para", sys.argv[1], "·", build(sys.argv[1]), "s")
