import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Check,
  Clipboard,
  Coffee,
  Heart,
  MessageCircleHeart,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

type Scene = 'intro' | 'gallery' | 'game' | 'balance' | 'invite' | 'ending'
type Choice = 'coffee' | 'accounting' | 'later'

type Burst = {
  heartId: number
  token: number
}

const HEARTS = [
  { id: 1, x: '8%', y: '12%', delay: 0, size: 31 },
  { id: 2, x: '68%', y: '10%', delay: 0.07, size: 28 },
  { id: 3, x: '42%', y: '39%', delay: 0.14, size: 34 },
  { id: 4, x: '13%', y: '68%', delay: 0.21, size: 29 },
  { id: 5, x: '73%', y: '69%', delay: 0.28, size: 32 },
]

const answerText: Record<Choice, string> = {
  coffee: 'Ahoj, Dušan. Tú kávu môžeme skúsiť 🙂',
  accounting: 'Ahoj, Dušan. Účtovnícky pokec beriem — ale tú kávu k tomu asi tiež 🙂',
  later: 'Ahoj, Dušan. Ďakujem za pozvanie, ale zatiaľ by som to nechala tak.',
}

const endings: Record<Choice, { eyebrow: string; title: string; body: string }> = {
  coffee: {
    eyebrow: 'MISIA SPLNENÁ',
    title: 'Tak toto má dobrú bilanciu.',
    body: 'Budem rád, keď sa dohodneme normálne v správe. Žiadny tlak — len káva a pohodový rozhovor.',
  },
  accounting: {
    eyebrow: 'ODBORNÁ SEKCIA ODOMKNUTÁ',
    title: 'Účtovníctvo má zrazu lepší marketing.',
    body: 'Môžeme začať odborným pokecom a zistiť, kam sa konverzácia prirodzene posunie. Káva je povolená.',
  },
  later: {
    eyebrow: 'ÚPLNE V POHODE',
    title: 'Ďakujem, že si si to pozrela.',
    body: 'Žiadne presviedčanie ani druhé kolo. Aj „nie“ alebo „nie teraz“ je úplne férová odpoveď.',
  },
}

const transition = { duration: 0.58, ease: [0.16, 1, 0.3, 1] as const }

function FloatingAmbience() {
  const reduceMotion = useReducedMotion()
  const orbs = useMemo(
    () => [
      { left: '4%', top: '13%', size: 250, delay: 0 },
      { left: '73%', top: '8%', size: 330, delay: 1.1 },
      { left: '48%', top: '71%', size: 290, delay: 2 },
    ],
    [],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: i === 1 ? 'rgba(204,184,255,.12)' : 'rgba(246,183,209,.11)',
          }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -20, 8, 0], x: [0, 12, -8, 0], scale: [1, 1.06, 0.98, 1] }
          }
          transition={{ duration: 10 + i * 2, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={`spark-${i}`}
          className="sparkle"
          style={{ left: `${(i * 37) % 94 + 2}%`, top: `${(i * 53) % 88 + 4}%` }}
          animate={reduceMotion ? undefined : { opacity: [0.18, 0.8, 0.18], scale: [0.7, 1.35, 0.7] }}
          transition={{ duration: 2.6 + (i % 4), repeat: Infinity, delay: i * 0.11 }}
        />
      ))}
    </div>
  )
}

function GalleryBackdrop({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="photo-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/photos/moment-01.webp" alt="" className="photo-backdrop-a" />
          <img src="/photos/moment-02.webp" alt="" className="photo-backdrop-b" />
          <div className="photo-backdrop-shade" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StepPill({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
      <span>Malá misia</span>
      <span className="h-1 w-1 rounded-full bg-white/30" />
      <span>{step}/5</span>
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState<Scene>('intro')
  const [caught, setCaught] = useState<number[]>([])
  const [burst, setBurst] = useState<Burst | null>(null)
  const [choice, setChoice] = useState<Choice | null>(null)
  const [copied, setCopied] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!burst) return
    const timer = window.setTimeout(() => setBurst(null), 720)
    return () => window.clearTimeout(timer)
  }, [burst])

  const catchHeart = (id: number) => {
    if (caught.includes(id)) return
    setCaught((current) => [...current, id])
    setBurst({ heartId: id, token: Date.now() })
  }

  const choose = (selected: Choice) => {
    setChoice(selected)
    setCopied(false)
    setScene('ending')
  }

  const copyAnswer = async () => {
    if (!choice) return
    try {
      await navigator.clipboard.writeText(answerText[choice])
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const restart = () => {
    setCaught([])
    setBurst(null)
    setChoice(null)
    setCopied(false)
    setScene('intro')
  }

  const burstHeart = burst ? HEARTS.find((heart) => heart.id === burst.heartId) : null

  return (
    <main className="app-shell noise flex items-center justify-center">
      <FloatingAmbience />
      <GalleryBackdrop active={scene === 'gallery'} />

      <div className="relative z-10 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {scene === 'intro' && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={transition}
              className="glass-card relative overflow-hidden rounded-[36px] px-6 py-10 text-center shadow-glass sm:px-10 sm:py-14"
            >
              <div aria-hidden className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-pink-300/10 blur-3xl" />
              <motion.div
                className="mx-auto mb-7 grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/[0.08] shadow-glow"
                animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="h-10 w-10 fill-pink-200/70 text-pink-100" strokeWidth={1.3} />
              </motion.div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.30em] text-pink-100/70">Niečo malé a netradičné</p>
              <h1 className="font-display text-5xl font-semibold leading-[.95] tracking-[-0.03em] text-white sm:text-7xl">Ahoj, Lucia.</h1>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-white/67 sm:text-base">
                Namiesto obyčajnej správy som pripravil krátku misiu. Zaberie asi minútu a na konci je jedna jednoduchá otázka.
              </p>
              <button
                type="button"
                onClick={() => setScene('gallery')}
                className="primary-button group mx-auto mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold sm:text-[15px]"
              >
                Začať malú misiu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-5 text-xs text-white/38">Bez registrácie, bez trackingu, len malý digitálny experiment.</p>
            </motion.section>
          )}

          {scene === 'gallery' && (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, y: 22, scale: 0.99, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, scale: 0.99, filter: 'blur(7px)' }}
              transition={transition}
              className="glass-card overflow-hidden rounded-[36px] p-5 shadow-glass sm:p-8"
            >
              <StepPill step={1} />
              <div className="mx-auto max-w-xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100/60">Malé vizuálne intermezzo</p>
                <h2 className="mt-3 font-display text-5xl font-semibold leading-none sm:text-6xl">Trochu osobnejšie.</h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/58">
                  Dve momentky, ktoré sem jednoducho pasujú. Potom už ideš rovno na misiu.
                </p>
              </div>

              <div className="photo-stage mx-auto mt-7 max-w-2xl" aria-label="Dve momentky">
                <motion.figure
                  className="photo-card photo-card-main"
                  initial={{ opacity: 0, y: 24, rotate: -7, scale: 0.94, filter: 'blur(7px)' }}
                  animate={{ opacity: 1, y: 0, rotate: -3.2, scale: 1, filter: 'blur(0px)' }}
                  transition={{ ...transition, delay: 0.08 }}
                >
                  <img
                    src="/photos/moment-01.webp"
                    alt="Momentka troch kamarátok pred zrkadlom"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption>moment 01</figcaption>
                </motion.figure>

                <motion.figure
                  className="photo-card photo-card-strip"
                  initial={{ opacity: 0, y: 28, rotate: 7, scale: 0.93, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotate: 3.4, scale: 1, filter: 'blur(0px)' }}
                  transition={{ ...transition, delay: 0.18 }}
                >
                  <img
                    src="/photos/moment-02.webp"
                    alt="Čiernobiela momentka dvoch kamarátok pri zrkadle"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption>moment 02</figcaption>
                </motion.figure>
                <motion.div
                  className="photo-glow"
                  aria-hidden
                  animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <div className="mt-7 text-center">
                <p className="mb-4 text-sm text-white/45">Dobre. Teraz už tá malá misia.</p>
                <button
                  type="button"
                  onClick={() => setScene('game')}
                  className="primary-button group inline-flex min-h-13 items-center gap-2 rounded-full px-7 text-sm font-bold"
                >
                  Pokračovať <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
            </motion.section>
          )}

          {scene === 'game' && (
            <motion.section
              key="game"
              initial={{ opacity: 0, y: 22, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.99 }}
              transition={transition}
              className="glass-card rounded-[36px] p-5 shadow-glass sm:p-8"
            >
              <StepPill step={2} />
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100/60">Heart collector</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold leading-none sm:text-5xl">Nájdi 5 srdiečok.</h2>
                </div>
                <div className="counter-pill shrink-0 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/76" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={caught.length}
                      initial={{ opacity: 0.35, scale: 0.72, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.2, y: -5 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      className="inline-block min-w-[2.4rem] text-center"
                    >
                      {caught.length}/5
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="progress-track mb-5" aria-hidden>
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${(caught.length / 5) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                />
              </div>

              <div className="game-field">
                <div className="absolute inset-x-0 top-5 text-center text-xs text-white/36">Klikni alebo ťukni na všetky žiariace srdiečka.</div>

                <AnimatePresence>
                  {HEARTS.filter((heart) => !caught.includes(heart.id)).map((heart) => (
                    <motion.button
                      key={heart.id}
                      type="button"
                      aria-label={`Chytiť srdiečko ${heart.id}`}
                      className="heart-button"
                      style={{ left: heart.x, top: heart.y }}
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: reduceMotion ? 0 : [0, -6, 0] }}
                      whileTap={reduceMotion ? undefined : { scale: 0.86 }}
                      exit={{ opacity: 0, scale: 1.55, filter: 'blur(8px)' }}
                      transition={{
                        opacity: { delay: heart.delay, duration: 0.35 },
                        scale: { delay: heart.delay, duration: 0.35 },
                        y: reduceMotion ? { duration: 0 } : { duration: 2.8 + heart.id * 0.1, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      onClick={() => catchHeart(heart.id)}
                    >
                      <Heart
                        className="fill-pink-200/85 text-pink-50 drop-shadow-[0_0_18px_rgba(255,220,235,.45)]"
                        style={{ width: heart.size, height: heart.size }}
                        strokeWidth={1.15}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>

                {burst && burstHeart && (
                  <div
                    key={burst.token}
                    className="heart-burst"
                    style={{ left: burstHeart.x, top: burstHeart.y }}
                    aria-hidden
                  >
                    <span className="burst-ring" />
                    {Array.from({ length: 8 }).map((_, index) => (
                      <span
                        key={index}
                        className="burst-dot"
                        style={{ '--i': index } as CSSProperties}
                      />
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {caught.length === 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, backdropFilter: 'blur(0px)' }}
                      animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(14px)' }}
                      exit={{ opacity: 0 }}
                      transition={{ ...transition, delay: 0.12 }}
                      className="absolute inset-0 grid place-items-center bg-[#1a101e]/48 p-7"
                    >
                      <div className="max-w-sm text-center">
                        <motion.div
                          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pink-100 text-[#3b1834] shadow-glow"
                          initial={{ scale: 0.4, rotate: -16 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 340, damping: 19, delay: 0.18 }}
                        >
                          <Check className="h-7 w-7" />
                        </motion.div>
                        <h3 className="font-display text-4xl font-semibold">5 z 5.</h3>
                        <p className="mt-2 text-sm leading-6 text-white/62">Misia splnená. Teraz prichádza odborná časť… približne.</p>
                        <button
                          type="button"
                          onClick={() => setScene('balance')}
                          className="primary-button mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-bold"
                        >
                          Pokračovať <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {scene === 'balance' && (
            <motion.section
              key="balance"
              initial={{ opacity: 0, y: 22, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.99 }}
              transition={transition}
              className="glass-card rounded-[36px] p-6 shadow-glass sm:p-9"
            >
              <StepPill step={3} />
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/[0.07]">
                  <Sparkles className="h-7 w-7 text-pink-100" strokeWidth={1.4} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100/60">Srdcová bilancia</p>
                <h2 className="mt-3 font-display text-5xl font-semibold leading-none sm:text-6xl">Bilancia sedí.</h2>
              </div>

              <div className="mx-auto mt-8 max-w-xl divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/12 bg-white/[0.055]">
                {[
                  ['Odvaha napísať', '100 %'],
                  ['Počet pozvaní', '1'],
                  ['Šanca na dobrú kávu', '?'],
                ].map(([label, value], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...transition, delay: i * 0.12 }}
                    className="flex items-center justify-between px-5 py-5 sm:px-6"
                  >
                    <span className="text-sm text-white/60">{label}</span>
                    <span className="font-display text-2xl font-semibold text-white">{value}</span>
                  </motion.div>
                ))}
              </div>

              <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-6 text-white/55">
                Bilancia sedí. Zostáva jedna položka.
              </p>

              <div className="mt-8 text-center">
                <button type="button" onClick={() => setScene('invite')} className="primary-button inline-flex min-h-13 items-center gap-2 rounded-full px-7 text-sm font-bold">
                  Odomknúť otázku <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.section>
          )}

          {scene === 'invite' && (
            <motion.section
              key="invite"
              initial={{ opacity: 0, y: 22, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.99 }}
              transition={transition}
              className="glass-card overflow-hidden rounded-[36px] p-6 shadow-glass sm:p-10"
            >
              <StepPill step={4} />
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100/60">Jedna malá otázka</p>
                <h2 className="mt-4 font-display text-[3rem] font-semibold leading-[.95] tracking-[-0.035em] sm:text-7xl">
                  Lucia, pôjdeš so mnou niekedy na kávu?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/63 sm:text-base">
                  A ak chceš bezpečnejší začiatok, pokojne môžeme začať účtovníckym pokecom.
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => choose('coffee')}
                  className="primary-button flex min-h-16 items-center justify-center gap-3 rounded-2xl px-5 text-sm font-bold"
                >
                  <Coffee className="h-5 w-5" /> Káva & spoznávanie
                </button>
                <button
                  type="button"
                  onClick={() => choose('accounting')}
                  className="secondary-button flex min-h-16 items-center justify-center gap-3 rounded-2xl px-5 text-sm font-semibold"
                >
                  <MessageCircleHeart className="h-5 w-5 text-pink-100" /> Účtovnícky pokec
                </button>
                <button
                  type="button"
                  onClick={() => choose('later')}
                  className="secondary-button min-h-14 rounded-2xl px-5 text-sm text-white/72 sm:col-span-2"
                >
                  Možno inokedy
                </button>
              </div>
              <p className="mt-5 text-center text-xs leading-5 text-white/34">Každá odpoveď je férová odpoveď.</p>
            </motion.section>
          )}

          {scene === 'ending' && choice && (
            <motion.section
              key="ending"
              initial={{ opacity: 0, y: 22, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={transition}
              className="glass-card rounded-[36px] p-6 text-center shadow-glass sm:p-10"
            >
              <StepPill step={5} />
              <motion.div
                className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-white/17 bg-white/[0.08] shadow-glow"
                animate={choice !== 'later' && !reduceMotion ? { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] } : undefined}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {choice === 'later' ? <Sparkles className="h-8 w-8 text-white/70" /> : <Heart className="h-9 w-9 fill-pink-200/80 text-pink-100" strokeWidth={1.2} />}
              </motion.div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100/60">{endings[choice].eyebrow}</p>
              <h2 className="mx-auto mt-3 max-w-xl font-display text-5xl font-semibold leading-[.98] sm:text-6xl">{endings[choice].title}</h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">{endings[choice].body}</p>

              <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-white/11 bg-black/10 p-4 text-left sm:p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Pripravená odpoveď</p>
                <p className="text-sm leading-6 text-white/76">{answerText[choice]}</p>
                <button
                  type="button"
                  onClick={copyAnswer}
                  className="secondary-button mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  {copied ? 'Skopírované' : 'Skopírovať odpoveď'}
                </button>
              </div>

              <button type="button" onClick={restart} className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-white/42 transition hover:text-white/70">
                <RotateCcw className="h-4 w-4" /> Spustiť znova
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
