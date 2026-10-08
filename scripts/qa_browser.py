from pathlib import Path
import base64
from playwright.sync_api import sync_playwright, expect

ROOT=Path('/mnt/data/PROJECT_LUCIA_V1_1')
DIST=ROOT/'dist'
errors=[]

css=(DIST/'styles.css').read_text()
react=(DIST/'vendor/react.production.min.js').read_text()
reactdom=(DIST/'vendor/react-dom.production.min.js').read_text()
app=(DIST/'app.js').read_text()

p1='data:image/webp;base64,'+base64.b64encode((DIST/'photos/moment-01.webp').read_bytes()).decode()
p2='data:image/webp;base64,'+base64.b64encode((DIST/'photos/moment-02.webp').read_bytes()).decode()
app=app.replace("./photos/moment-01.webp",p1).replace("./photos/moment-02.webp",p2)

HTML=f'''<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Pre Luciu ✦ malá misia</title><style>{css}</style></head><body><div id="root"></div><script>{react}</script><script>{reactdom}</script><script>{app}</script></body></html>'''

def bind_errors(page,label):
    page.on('console', lambda msg: errors.append(f'{label} console {msg.type}: {msg.text}') if msg.type=='error' else None)
    page.on('pageerror', lambda exc: errors.append(f'{label} pageerror: {exc}'))

def boot(context,label):
    page=context.new_page(); bind_errors(page,label)
    page.add_init_script("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}})")
    page.set_content(HTML, wait_until='load')
    return page

def assert_no_horizontal_overflow(page,label):
    vals=page.evaluate('() => ({sw:document.documentElement.scrollWidth,iw:window.innerWidth,bw:document.body.scrollWidth})')
    if vals['sw']>vals['iw']+1 or vals['bw']>vals['iw']+1: raise AssertionError(f'{label} horizontal overflow: {vals}')

def flow_to_invite(page):
    page.get_by_role('button',name='Začať malú misiu').click()
    expect(page.get_by_text('Trochu osobnejšie.')).to_be_visible()
    for sel in ['img[alt="Momentka troch kamarátok pred zrkadlom"]','img[alt="Čiernobiela momentka dvoch kamarátok pri zrkadle"]']:
        img=page.locator(sel); expect(img).to_be_visible(); assert img.evaluate('(img)=>img.complete && img.naturalWidth>0')
    page.get_by_role('button',name='Pokračovať', exact=True).click()
    for i in range(1,6): page.get_by_role('button',name=f'Chytiť srdiečko {i}').click(force=True)
    expect(page.get_by_text('5 z 5.')).to_be_visible()
    page.get_by_role('button',name='Pokračovať →').click()
    expect(page.get_by_text('Bilancia sedí.',exact=True)).to_be_visible()
    for txt in ['Odvaha napísať','Počet pozvaní','Šanca na dobrú kávu','Bilancia sedí. Zostáva jedna položka.']:
        expect(page.get_by_text(txt,exact=True)).to_be_visible()
    page.get_by_role('button',name='Odomknúť otázku →').click()
    expect(page.get_by_text('Lucia, pôjdeš so mnou niekedy na kávu?',exact=True)).to_be_visible()
    expect(page.get_by_text('A ak chceš bezpečnejší začiatok, pokojne môžeme začať účtovníckym pokecom.',exact=True)).to_be_visible()

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])

    ctx=browser.new_context(viewport={'width':390,'height':844})
    page=boot(ctx,'mobile')
    expect(page).to_have_title('Pre Luciu ✦ malá misia')
    assert_no_horizontal_overflow(page,'mobile intro')
    page.get_by_role('button',name='Začať malú misiu').focus(); page.keyboard.press('Enter')
    expect(page.get_by_text('Trochu osobnejšie.')).to_be_visible(); assert_no_horizontal_overflow(page,'mobile gallery'); page.wait_for_timeout(1000)
    page.screenshot(path=str(ROOT/'mobile-gallery-v1.1.png'),full_page=True)
    page.get_by_role('button',name='Pokračovať', exact=True).click()
    for i in range(1,6): page.get_by_role('button',name=f'Chytiť srdiečko {i}').click(force=True)
    expect(page.get_by_text('5 z 5.')).to_be_visible(); page.get_by_role('button',name='Pokračovať →').click(); page.get_by_role('button',name='Odomknúť otázku →').click()
    expect(page.get_by_text('Lucia, pôjdeš so mnou niekedy na kávu?',exact=True)).to_be_visible(); assert_no_horizontal_overflow(page,'mobile invite')
    page.screenshot(path=str(ROOT/'mobile-invite-v1.1.png'),full_page=True)
    page.get_by_role('button',name='Káva & spoznávanie').click(); expect(page.get_by_text('Tak toto má dobrú bilanciu.',exact=True)).to_be_visible()
    page.get_by_role('button',name='▣ Skopírovať odpoveď').click(); expect(page.get_by_role('button',name='✓ Skopírované')).to_be_visible()
    page.get_by_role('button',name='↻ Spustiť znova').click(); expect(page.get_by_text('Ahoj, Lucia.',exact=True)).to_be_visible(); ctx.close()

    ctx=browser.new_context(viewport={'width':390,'height':844}); page=boot(ctx,'accounting'); flow_to_invite(page)
    page.get_by_role('button',name='♡ Účtovnícky pokec').click(); expect(page.get_by_text('Účtovníctvo má zrazu lepší marketing.',exact=True)).to_be_visible(); expect(page.get_by_text('Môžeme začať odborným pokecom a zistiť, kam sa konverzácia prirodzene posunie. Káva je povolená.',exact=True)).to_be_visible(); ctx.close()

    ctx=browser.new_context(viewport={'width':390,'height':844}); page=boot(ctx,'later'); flow_to_invite(page)
    page.get_by_role('button',name='Možno inokedy').click(); expect(page.get_by_text('Ďakujem, že si si to pozrela.',exact=True)).to_be_visible(); ctx.close()

    ctx=browser.new_context(viewport={'width':1440,'height':900}); page=boot(ctx,'desktop'); page.get_by_role('button',name='Začať malú misiu').click(); expect(page.get_by_text('Trochu osobnejšie.')).to_be_visible(); assert_no_horizontal_overflow(page,'desktop gallery'); page.wait_for_timeout(1000); page.screenshot(path=str(ROOT/'desktop-gallery-v1.1.png'),full_page=True); ctx.close()

    ctx=browser.new_context(viewport={'width':320,'height':568}); page=boot(ctx,'small-mobile'); assert_no_horizontal_overflow(page,'320 intro'); page.get_by_role('button',name='Začať malú misiu').click(); assert_no_horizontal_overflow(page,'320 gallery'); ctx.close()

    ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce'); page=boot(ctx,'reduced-motion'); page.get_by_role('button',name='Začať malú misiu').click(); expect(page.get_by_text('Trochu osobnejšie.')).to_be_visible(); duration=page.locator('.photo-card-main').evaluate('el=>getComputedStyle(el).animationDuration'); assert duration in ('0.001ms','0s','1e-06s'),duration; ctx.close()

    browser.close()

if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print('PASS: Chromium QA completed for mobile, desktop, 320px and reduced-motion flows.')
