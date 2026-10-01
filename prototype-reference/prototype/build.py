import json, glob, os, base64
KAR = base64.b64encode(open('../merk/fonts/karumbi-latin.woff2','rb').read()).decode()
skills = {}
for f in glob.glob('../skills/plugins/*/SKILL.md') + glob.glob('extra-skills/*/SKILL.md'):
    skills[os.path.basename(os.path.dirname(f))] = open(f).read()
js = 'const SKILL_TEKST = ' + json.dumps(skills, ensure_ascii=False).replace('</', '<\\/') + ';\n'
head = '''<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Studio Crave — Klantportaal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Barlow+Condensed:wght@800&display=swap" rel="stylesheet">
<style>
'''
out = head + '/* Karumbi (SMC, SIL Open Font License), Latijnse subset, ingebed */\n@font-face{font-family:"Karumbi";src:url(data:font/woff2;base64,'+KAR+') format("woff2");font-weight:400;font-style:normal;font-display:swap}\n' + open('styles.css').read() + '</style>\n</head>\n<body>\n<div id="app"></div>\n<div id="layer"></div>\n<script>\n'
out += js + open('assets.js').read() + open('config.js').read() + open('hd.js').read() + open('data.js').read() + open('admin.js').read() + open('klant.js').read() + open('app.js').read() + open('extras.js').read() + open('hd-ui.js').read() + open('thema.js').read() + open('plan90.js').read() + open('audit.js').read() + open('mail.js').read() + open('eigentools.js').read() + open('workflow.js').read() + open('identiteit.js').read() + open('uitsnede.js').read()
out += '</script>\n</body>\n</html>\n'
open('tbk-portaal.html','w').write(out)
open('all.js','w').write(js + open('assets.js').read() + open('config.js').read() + open('hd.js').read() + open('data.js').read() + open('admin.js').read() + open('klant.js').read() + open('app.js').read() + open('extras.js').read() + open('hd-ui.js').read() + open('thema.js').read() + open('plan90.js').read() + open('audit.js').read() + open('mail.js').read() + open('eigentools.js').read() + open('workflow.js').read() + open('identiteit.js').read() + open('uitsnede.js').read())
print(len(out))
