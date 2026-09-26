"""
Teardown :: single file build

Inlines every stylesheet and script into one self contained HTML file at
dist/teardown.html, so the whole site can be emailed, dropped on any static
host, or opened from a USB stick with no server.

Also writes dist/teardown-embed.html, the same page with the outer document
tags removed, for hosts that supply their own html/head/body shell.

    python build.py

The multi file version in this folder stays the one you edit.
"""

import base64
import mimetypes
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'index.html')
OUT_DIR = os.path.join(ROOT, 'dist')
OUT = os.path.join(OUT_DIR, 'teardown.html')
OUT_EMBED = os.path.join(OUT_DIR, 'teardown-embed.html')


def read(rel):
    path = os.path.join(ROOT, rel.replace('/', os.sep))
    if not os.path.isfile(path):
        sys.exit('missing file referenced by index.html: ' + rel)
    with open(path, encoding='utf-8') as fh:
        return fh.read()


def inline_font_urls(css, css_path):
    # url('fonts/x.woff2') inside a stylesheet is relative to that
    # stylesheet's own folder, not to index.html, so resolve from there and
    # the single-file build stays genuinely self-contained (no separate
    # assets/fonts/ folder needed alongside it) rather than just referencing
    # a path that only happens to work next to the multi-file source tree.
    css_dir = os.path.dirname(css_path)

    def sub(m):
        rel = m.group(2)
        if rel.startswith(('http://', 'https://', 'data:')):
            return m.group(0)
        path = os.path.normpath(os.path.join(ROOT, css_dir, rel))
        if not os.path.isfile(path):
            sys.exit('missing font referenced by ' + css_path + ': ' + rel)
        # mimetypes.guess_type doesn't reliably know .woff2 across platforms
        mime = 'font/woff2' if path.endswith('.woff2') else (mimetypes.guess_type(path)[0] or 'application/octet-stream')
        with open(path, 'rb') as fh:
            b64 = base64.b64encode(fh.read()).decode('ascii')
        return 'url(data:' + mime + ';base64,' + b64 + ')'

    return re.sub(r"url\((['\"]?)([^'\")]+\.woff2?)\1\)", sub, css)


def main():
    html = read('index.html')

    # <link rel="stylesheet" href="..."> -> <style>
    def css_sub(m):
        href = m.group(1)
        if href.startswith(('http://', 'https://', 'data:')):
            return m.group(0)
        css = inline_font_urls(read(href), href)
        return '<style>\n/* ' + href + ' */\n' + css + '\n</style>'

    html = re.sub(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', css_sub, html)

    # <script src="..."></script> -> <script>
    def js_sub(m):
        src = m.group(1)
        if src.startswith(('http://', 'https://')):
            return m.group(0)
        body = read(src)
        # a literal </script> inside a string would close the tag early
        body = body.replace('</script>', '<\\/script>')
        return '<script>\n/* ' + src + ' */\n' + body + '\n</script>'

    html = re.sub(r'<script[^>]*src="([^"]+)"[^>]*>\s*</script>', js_sub, html)

    # Look for un-inlined assets in the MARKUP only. Scanning the whole
    # document also matches src=/href= inside the JavaScript we just inlined:
    # panel.js builds a source link as '<a href="' + esc(s.url) + '"', which
    # is runtime markup, not a build-time asset. Reporting that trains you to
    # ignore the warning, which is worse than not having it.
    markup = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S)
    markup = re.sub(r'<style\b[^>]*>.*?</style>', '', markup, flags=re.S)
    leftover = re.findall(r'(?:src|href)="(?!https?:|data:|#)([^"]+)"', markup)
    if leftover:
        print('warning: still referencing external files: ' + ', '.join(sorted(set(leftover))))

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(html)

    kb = os.path.getsize(OUT) / 1024
    print('built {}  ({:.0f} KB, single file)'.format(os.path.relpath(OUT, ROOT), kb))

    # embed variant: styles and body only, for a host that wraps it in its own
    # document. Keeps the <style> blocks, drops doctype/html/head/body/meta.
    styles = re.findall(r'<style>.*?</style>', html, re.S)
    body = re.search(r'<body[^>]*>(.*)</body>', html, re.S)
    if not body:
        sys.exit('could not isolate <body> for the embed build')

    embed = ('\n'.join(styles) + '\n' + body.group(1).strip() + '\n')
    with open(OUT_EMBED, 'w', encoding='utf-8') as fh:
        fh.write(embed)

    stray = re.search(r'<(?:!doctype|html|head|body)\b', embed, re.I)
    if stray:
        print('warning: embed build still contains a ' + stray.group(0) + ' tag')

    kb2 = os.path.getsize(OUT_EMBED) / 1024
    print('built {}  ({:.0f} KB, embed)'.format(os.path.relpath(OUT_EMBED, ROOT), kb2))


if __name__ == '__main__':
    main()
