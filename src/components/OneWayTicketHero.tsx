import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link } from 'react-router-dom'

/** Tunable sequence timings — boot hooks reserved for Frame 5. */
export const SEQUENCE_TIMING = {
  tearFallMs: 900,
  /** Start emerge shortly after the tear so the gap is already opening. */
  droneEmergeDelayMs: 160,
  cutAutoCompleteAt: 0.9,
  perforSnapPx: 18,
  gapMaxPx: 14,
  droneEnterMs: 780,
  droneFlightMs: 900,
  droneHoverMs: 640,
  droneDropMs: 720,
  droneExitMs: 700,
  impactShakeMs: 320,
  bootCharMs: 45,
  bootLinePauseMs: 280,
  glitchIntervalMs: 3200,
  glitchBurstMs: 180,
} as const

const TICKET = {
  event: 'FLYTBASE HIRING HACKATHON',
  from: 'WHERE YOU ARE',
  to: 'HIRED',
  flight: 'HACKATHON · JUL 25',
  gate: 'BUSINESS DEVELOPMENT',
  boarding: 'EVERY SATURDAY',
  seat: 'NO INTERVIEW REQUIRED',
  /** Fare-class joke + boarding-order joke — max two extras. */
  class: 'NO CLASS SYSTEM',
  seq: '001 OF ∞',
  /** Company · MMDD · role initials */
  code: 'FB · 0725 · BD',
  stubEvent: 'HACKATHON',
  stubDate: 'JUL 25',
  cutHint: 'CUT HERE TO BOARD',
  tagline: 'ONE TICKET. SKIP THE PROCESS. GET HIRED.',
  subline: 'No multi-round interviews, no waiting weeks - just show up Saturday!',
  tearHintLine1: 'Hold And Tear',
  tearHintLine2: 'The Ticket!',
} as const

/**
 * Vertical perforation in `boarding-pass-ticket.jpg`
 * (dashed line between main body and stub) ≈ x/1024.
 */
const PERF_X = 0.811

type Phase = 'ticket' | 'cutting' | 'falling' | 'drone' | 'delivered'
type DroneBeat = 'enter' | 'fly' | 'hover' | 'drop' | 'exit'

/** Pixel drone — provided body art + original spinning blades on the four motors. */
function PixelDrone() {
  return (
    <div className="pixel-drone" aria-hidden="true">
      <img
        className="pixel-drone__body"
        src="/pixel-drone-body.png"
        alt=""
        width={972}
        height={791}
        draggable={false}
        decoding="async"
      />
      <svg
        className="pixel-drone__blades"
        viewBox="0 0 972 791"
        width="972"
        height="791"
        aria-hidden="true"
      >
        {/* Same blade style as before — horizontal ink bars, spinning via CSS */}
        <rect className="pixel-drone__rotor pixel-drone__rotor--l" x="-167" y="68" width="507" height="68" />
        <rect className="pixel-drone__rotor pixel-drone__rotor--r" x="587" y="-5" width="507" height="68" />
        <rect className="pixel-drone__rotor pixel-drone__rotor--l" x="-179" y="454" width="507" height="68" />
        <rect className="pixel-drone__rotor pixel-drone__rotor--r" x="685" y="370" width="507" height="68" />
      </svg>
    </div>
  )
}

function TicketPrint() {
  return (
    <img
      className="boarding-pass__art"
      src="/boarding-pass-ticket.jpg"
      alt="FlytBase Hiring Hackathon boarding pass: From Not Hired to Hired. Boarding every Saturday. Virtual."
      width={3072}
      height={993}
      draggable={false}
      decoding="async"
    />
  )
}

const GLITCH_LINE = 'Hack To'

/** Pixel CRT payload — screen boots glitch copy after landing. */
function CrtMonitor({
  variant = 'landed',
  shaking = false,
  powered = false,
}: {
  variant?: 'carried' | 'landed'
  shaking?: boolean
  powered?: boolean
}) {
  return (
    <div
      className={`crt crt--${variant}${shaking ? ' is-impact' : ''}${powered ? ' is-powered' : ''}`}
      role={powered ? 'group' : 'img'}
      aria-label={powered ? undefined : 'CRT monitor, powered off'}
    >
      <div className="crt-art-wrap">
        <img
          className="crt-art"
          src="/pixel-crt-monitor.png"
          alt=""
          width={833}
          height={974}
          draggable={false}
          aria-hidden="true"
        />
        {powered && (
          <div className="crt-screen-overlay">
            <div className="crt-scanlines crt-scanlines--overlay" aria-hidden="true" />
            <div className="crt-screen-copy">
              <p className="crt-glitch is-bursting" data-text={GLITCH_LINE} aria-hidden="true">
                {GLITCH_LINE}
              </p>
              <Link className="crt-hire-btn" to="/roles">
                Get Hired!
                <svg
                  className="crt-hire-btn__cursor"
                  viewBox="0 0 12 16"
                  width="14"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    d="M1.5 1.5v12.2l3.1-3.1 1.8 4.3 2.1-.9-1.8-4.2H11Z"
                    fill="#faf8f2"
                    stroke="#1a1b41"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ImpactDust() {
  return (
    <div className="impact-dust" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className={`impact-dust__bit impact-dust__bit--${i}`} />
      ))}
    </div>
  )
}

/** Small random-looking clouds flanking the CRT (no cropping). */
const CRT_CLOUDS = [
  { top: '4%', left: '-14%', width: '15%', duration: '12s', delay: '0s', opacity: 0.9 },
  { top: '28%', left: '-22%', width: '11%', duration: '15s', delay: '-3s', opacity: 0.72 },
  { top: '52%', left: '-8%', width: '13%', duration: '10s', delay: '-6s', opacity: 0.8 },
  { top: '14%', left: '12%', width: '9%', duration: '13s', delay: '-1s', opacity: 0.65 },
  { top: '6%', left: '78%', width: '14%', duration: '14s', delay: '-2s', opacity: 0.88 },
  { top: '34%', left: '86%', width: '10%', duration: '11s', delay: '-5s', opacity: 0.7 },
  { top: '58%', left: '74%', width: '12%', duration: '16s', delay: '-8s', opacity: 0.76 },
  { top: '18%', left: '68%', width: '8%', duration: '9s', delay: '-4s', opacity: 0.62 },
  /* Bottom-right corner of the computer scene */
  { top: '78%', left: '88%', width: '16%', duration: '13s', delay: '0s', opacity: 0.92 },
] as const

function CrtClouds() {
  return (
    <div className="crt-clouds" aria-hidden="true">
      {CRT_CLOUDS.map((cloud, i) => (
        <img
          key={i}
          className={`crt-cloud crt-cloud--${i}`}
          src="/pixel-cloud.png"
          alt=""
          width={865}
          height={307}
          draggable={false}
          decoding="async"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.width,
            opacity: cloud.opacity,
            ['--cloud-duration' as string]: cloud.duration,
            ['--cloud-delay' as string]: cloud.delay,
          }}
        />
      ))}
    </div>
  )
}

function leftClip(progress: number, gapPx: number, width: number): string {
  const w = width > 0 ? width : 640
  const perf = PERF_X * 100
  const gap = Math.min(4, (gapPx / w) * 100)
  const y = Math.max(progress, 0.001) * 100
  return `polygon(0% 0%, ${perf - gap}% 0%, ${perf - gap}% ${y}%, ${perf}% ${y}%, ${perf}% 100%, 0% 100%)`
}

function rightClip(progress: number, gapPx: number, width: number): string {
  const w = width > 0 ? width : 640
  const perf = PERF_X * 100
  const gap = Math.min(4, (gapPx / w) * 100)
  const y = Math.max(progress, 0.001) * 100
  return `polygon(${perf + gap}% 0%, 100% 0%, 100% 100%, ${perf}% 100%, ${perf}% ${y}%, ${perf + gap}% ${y}%)`
}

function leftTornClip(): string {
  const p = PERF_X * 100
  return `polygon(0% 0%, ${p - 0.8}% 0%, ${p}% 3%, ${p - 1.4}% 7%, ${p}% 12%, ${p - 0.9}% 18%, ${p}% 24%, ${p - 1.6}% 31%, ${p}% 38%, ${p - 1}% 45%, ${p}% 52%, ${p - 1.5}% 60%, ${p}% 68%, ${p - 0.8}% 76%, ${p}% 84%, ${p - 1.3}% 92%, ${p}% 100%, 0% 100%)`
}

function rightTornClip(): string {
  const p = PERF_X * 100
  return `polygon(${p + 0.8}% 0%, 100% 0%, 100% 100%, ${p}% 100%, ${p + 1.3}% 92%, ${p}% 84%, ${p + 0.8}% 76%, ${p}% 68%, ${p + 1.5}% 60%, ${p}% 52%, ${p + 1}% 45%, ${p}% 38%, ${p + 1.6}% 31%, ${p}% 24%, ${p + 0.9}% 18%, ${p}% 12%, ${p + 1.4}% 7%, ${p}% 3%, ${p + 0.8}% 0%)`
}

export function OneWayTicketHero() {
  const [phase, setPhase] = useState<Phase>('ticket')
  const [droneBeat, setDroneBeat] = useState<DroneBeat | null>(null)
  const [cutProgress, setCutProgress] = useState(0)
  const [ticketSize, setTicketSize] = useState({ w: 0, h: 0 })
  const [pathD, setPathD] = useState('')
  const [shaking, setShaking] = useState(false)
  const [showDust, setShowDust] = useState(false)
  const [crtPowered, setCrtPowered] = useState(false)
  const [showTicketHalves, setShowTicketHalves] = useState(false)

  const stageRef = useRef<HTMLElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<Phase>('ticket')
  const cuttingRef = useRef(false)
  const progressRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })
  const pathPointsRef = useRef<{ x: number; y: number }[]>([])
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const setPhaseBoth = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  useEffect(() => {
    const el = ticketRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const next = { w: rect.width, h: rect.height }
      sizeRef.current = next
      setTicketSize(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [phase])

  const startDroneSequence = useCallback(() => {
    clearTimers()
    setCrtPowered(false)
    setPhaseBoth('drone')
    setDroneBeat('enter')
    // Clear the torn ticket as soon as the drone comes through the gap.
    setShowTicketHalves(false)

    const t = SEQUENCE_TIMING
    const queue = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(fn, ms))
    }

    queue(t.droneEnterMs, () => setDroneBeat('fly'))
    queue(t.droneEnterMs + t.droneFlightMs, () => setDroneBeat('hover'))
    queue(t.droneEnterMs + t.droneFlightMs + t.droneHoverMs, () => {
      setDroneBeat('drop')
      // Impact effects fire when the CRT actually hits, not at release.
      const impactAt = Math.floor(t.droneDropMs * 0.78)
      queue(impactAt, () => {
        setShowDust(true)
        setShaking(true)
        queue(t.impactShakeMs, () => setShaking(false))
        queue(220, () => setShowDust(false))
      })
      // Boot once the monitor has settled on the pad.
      queue(t.droneDropMs + 80, () => setCrtPowered(true))
    })
    queue(
      t.droneEnterMs + t.droneFlightMs + t.droneHoverMs + t.droneDropMs,
      () => setDroneBeat('exit'),
    )
    queue(
      t.droneEnterMs + t.droneFlightMs + t.droneHoverMs + t.droneDropMs + t.droneExitMs,
      () => {
        setDroneBeat(null)
        setPhaseBoth('delivered')
      },
    )
  }, [clearTimers, setPhaseBoth])

  const completeCut = useCallback(() => {
    if (phaseRef.current === 'falling' || phaseRef.current === 'drone' || phaseRef.current === 'delivered') {
      return
    }
    cuttingRef.current = false
    progressRef.current = 1
    setCutProgress(1)

    const rect = ticketRef.current?.getBoundingClientRect()
    const w = rect?.width || ticketSize.w || 1
    const h = rect?.height || ticketSize.h || 1
    const perfPx = PERF_X * w
    pathPointsRef.current = [
      { x: perfPx, y: 0 },
      { x: perfPx, y: h },
    ]
    setPathD(`M ${perfPx} 0 L ${perfPx} ${h}`)

    setPhaseBoth('falling')
    setShowTicketHalves(true)
    clearTimers()
    // Emerge from the tear gap while the halves are still peeling apart.
    timersRef.current.push(
      window.setTimeout(() => startDroneSequence(), SEQUENCE_TIMING.droneEmergeDelayMs),
    )
  }, [clearTimers, setPhaseBoth, startDroneSequence, ticketSize.h, ticketSize.w])

  useEffect(() => () => clearTimers(), [clearTimers])

  const updateCutFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const ticket = ticketRef.current
      if (!ticket || !cuttingRef.current) return

      const rect = ticket.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const perfPx = PERF_X * rect.width

      const snappedX =
        perfPx +
        Math.max(
          -SEQUENCE_TIMING.perforSnapPx,
          Math.min(SEQUENCE_TIMING.perforSnapPx, x - perfPx),
        )
      const clampedY = Math.max(0, Math.min(rect.height, y))
      const next = Math.max(progressRef.current, clampedY / rect.height)

      progressRef.current = next
      setCutProgress(next)

      const pts = pathPointsRef.current
      const last = pts[pts.length - 1]
      if (!last || Math.hypot(snappedX - last.x, clampedY - last.y) > 2) {
        pts.push({ x: snappedX, y: clampedY })
        setPathD(
          pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '),
        )
      }

      if (next >= SEQUENCE_TIMING.cutAutoCompleteAt) {
        completeCut()
      }
    },
    [completeCut],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (cuttingRef.current && phaseRef.current === 'cutting') {
        updateCutFromPoint(e.clientX, e.clientY)
      }
    }

    const onUp = () => {
      cuttingRef.current = false
      if (
        phaseRef.current === 'cutting' &&
        progressRef.current > 0.05 &&
        progressRef.current < SEQUENCE_TIMING.cutAutoCompleteAt
      ) {
        setPhaseBoth('ticket')
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [setPhaseBoth, updateCutFromPoint])

  const onTicketPointerDown = (e: ReactPointerEvent) => {
    if (phaseRef.current !== 'ticket' && phaseRef.current !== 'cutting') return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    cuttingRef.current = true
    setPhaseBoth('cutting')

    if (pathPointsRef.current.length === 0) {
      const ticket = ticketRef.current
      if (ticket) {
        const rect = ticket.getBoundingClientRect()
        const perfPx = PERF_X * rect.width
        const y = Math.max(0, e.clientY - rect.top)
        pathPointsRef.current = [{ x: perfPx, y: Math.min(y, 8) }]
      }
    }
    updateCutFromPoint(e.clientX, e.clientY)
  }

  const gapPx = cutProgress * SEQUENCE_TIMING.gapMaxPx
  const isSplit = cutProgress > 0.01 || phase === 'falling'
  const carryingCrt = droneBeat === 'enter' || droneBeat === 'fly' || droneBeat === 'hover'
  const showCutCable = droneBeat === 'drop' || droneBeat === 'exit'
  const showLandedCrt =
    droneBeat === 'drop' || droneBeat === 'exit' || phase === 'delivered'
  // Drone stays visible through drop + exit (payload detaches on drop).
  const droneVisible = phase === 'drone' && droneBeat !== null

  return (
    <section
      ref={stageRef}
      className={['one-way-hero', 'one-way-hero--cut', shaking ? 'is-shaking' : '']
        .filter(Boolean)
        .join(' ')}
      aria-label="One-way ticket to hired"
    >
      <div className="cut-stage">
        {showTicketHalves && (
          <>
            <div
              className="boarding-pass boarding-pass--half boarding-pass--fall-left"
              style={{ clipPath: leftTornClip() }}
              aria-hidden="true"
            >
              <TicketPrint />
            </div>
            <div
              className="boarding-pass boarding-pass--half boarding-pass--fall-right"
              style={{ clipPath: rightTornClip() }}
              aria-hidden="true"
            >
              <TicketPrint />
            </div>
          </>
        )}

        {phase !== 'falling' && phase !== 'drone' && phase !== 'delivered' && (
          <div className="boarding-pass-wrap">
            <p className="ticket-tagline">{TICKET.tagline}</p>

            <div
              className={[
                'boarding-pass-shell',
                phase === 'cutting' ? 'is-cutting' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {(phase === 'ticket' || (phase === 'cutting' && cutProgress < 0.12)) && (
                <div className="ticket-tear-callout" aria-hidden="true">
                  <svg
                    className="ticket-tear-connector"
                    viewBox="0 0 280 180"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <marker
                        id="tear-arrowhead"
                        markerWidth="12"
                        markerHeight="12"
                        refX="9"
                        refY="5"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path
                          d="M1.4 1.1 C0.7 2.8 0.7 7.2 1.4 8.9 C2.8 7.8 6.4 6 9.4 5 C6.4 4 2.8 2.2 1.4 1.1 Z"
                          fill="#ffcc00"
                        />
                      </marker>
                    </defs>
                    <path
                      className="ticket-tear-connector__path"
                      d="M 218 48 C 175 68, 138 95, 155 118 C 172 140, 215 132, 200 105 C 188 82, 135 74, 102 68"
                      markerEnd="url(#tear-arrowhead)"
                    />
                  </svg>
                  <p className="ticket-tear-hint">
                    <strong className="ticket-tear-hint__line">{TICKET.tearHintLine1}</strong>
                    <strong className="ticket-tear-hint__line">{TICKET.tearHintLine2}</strong>
                  </p>
                </div>
              )}

              <div
                ref={ticketRef}
                className={`boarding-pass${!isSplit ? ' boarding-pass--whole' : ' boarding-pass--cutting'}`}
                onPointerDown={onTicketPointerDown}
              >
                <div className={isSplit ? 'boarding-pass__sizer' : undefined}>
                {!isSplit && <TicketPrint />}
                {isSplit && (
                  <div className="boarding-pass__sizer-inner" aria-hidden="true">
                    <TicketPrint />
                  </div>
                )}
              </div>

              {isSplit && (
                <>
                  <div
                    className="boarding-pass__layer boarding-pass__layer--left"
                    style={{ clipPath: leftClip(cutProgress, gapPx, ticketSize.w) }}
                  >
                    <TicketPrint />
                  </div>
                  <div
                    className="boarding-pass__layer boarding-pass__layer--right"
                    style={{ clipPath: rightClip(cutProgress, gapPx, ticketSize.w) }}
                  >
                    <TicketPrint />
                  </div>
                </>
              )}

              <svg className="cut-path-svg" aria-hidden="true">
                <path d={pathD} className="cut-path-line" />
              </svg>
              </div>
            </div>

            <p className="ticket-subline">{TICKET.subline}</p>
          </div>
        )}

        {droneVisible && (
          <div className={`drone-scene is-${droneBeat}`} aria-hidden="true">
            <div className="drone-rig">
              <div className="drone-bob">
                <PixelDrone />
                {carryingCrt && (
                  <div className="drone-payload">
                    <div className="drone-cable" />
                    <CrtMonitor variant="carried" />
                  </div>
                )}
                {showCutCable && <div className="drone-cable drone-cable--cut" />}
              </div>
            </div>
          </div>
        )}

        {showLandedCrt && (
          <div className="crt-delivery">
            <CrtClouds />
            <div className={`crt-land-slot${droneBeat === 'drop' ? ' is-dropping' : ' is-landed'}`}>
              <CrtMonitor variant="landed" shaking={shaking} powered={crtPowered} />
              {showDust && <ImpactDust />}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
