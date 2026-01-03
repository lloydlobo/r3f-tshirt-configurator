import { useEffect, useLayoutEffect, useRef } from "react"
import reactLogo from "./assets/react.svg"
import { Camera, ArrowLeft, Highlighter, ShoppingCart } from "lucide-react"
import { gsap } from "gsap"
import { state } from "./store"
import { useSnapshot } from "valtio"

function Logo() {
  return <img src={reactLogo} className="logo react" alt="React logo" />
}

export function Overlay() {
  const snap = useSnapshot(state)
  const transition = { duration: 0.8, ease: "power3.out" } // spring transition

  const headerRef = useRef(null)
  const cartIconRef = useRef(null)

  const sectionRef = useRef(null)
  const sectionTitleRef = useRef(null)
  const sectionContentRef = useRef(null)

  const customizerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(headerRef.current, { opacity: 0, y: -100 }, { opacity: 1, y: 0, ...transition })
      gsap.to(cartIconRef.current, {
        opacity: snap.intro ? 1 : 0,
        x: snap.intro ? 0 : 100,
        pointerEvents: snap.intro ? "auto" : "none",
        ...transition,
      })

      // Animate section
      if (snap.intro) {
        gsap.fromTo(sectionRef.current, { x: -100, opacity: 0, ...transition }, { x: 0, opacity: 1, ...transition })
        gsap.fromTo(sectionTitleRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1 })
        gsap.fromTo(sectionContentRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
      } else {
        gsap.fromTo(customizerRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, ...transition })
      }
    }, [snap.intro])
    return () => ctx.revert()
  }, [snap.intro]) // avoid double-renders and Strict Mode issues

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <header ref={headerRef} style={{ position: "relative" }}>
        <Logo width="40" height="40" />
        <div ref={cartIconRef}>
          <ShoppingCart size="3em" />
        </div>
      </header>

      {snap.intro ? (
        <section ref={sectionRef}>
          <div className="section--container">
            {/* <motion.div key="title" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", damping: 5, stiffness: 40, restDelta: 0.001, duration: 0.3 }} > */}
            <div key="title" ref={sectionTitleRef}>
              <h1>LET'S DO IT</h1>
            </div>
            <div className="support--content">
              <div key="p" ref={sectionContentRef}>
                <p>
                  Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Unleash your imagination</strong> and define your own
                  style.
                </p>
                <button style={{ background: snap.color }} onClick={() => (state.intro = false)}>
                  CUSTOMIZE IT <Highlighter size="1.3em" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section ref={customizerRef}>
          <Customizer />
        </section>
      )}
    </div>
  )
}

function Customizer() {
  const snap = useSnapshot(state)
  return (
    <div className="customizer">
      <div className="color-options">
        {snap.colors.map((color) => (
          <div key={color} className="circle" style={{ background: color }} onClick={() => (state.color = color)}></div>
        ))}
      </div>

      <div className="decals">
        <div className="decals--container">
          {snap.decals.map((decal) => (
            <div key={decal} className="decal" onClick={() => (state.decal = decal)}>
              <img src={`${decal}_thumb.png`} alt="brand" />
            </div>
          ))}
        </div>
      </div>

      <button
        className="share"
        style={{ background: snap.color }}
        onClick={() => {
          const link = document.createElement("a")
          link.setAttribute("download", "canvas.png")
          link.setAttribute("href", document.querySelector("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream"))
          link.click()
        }}
      >
        DOWNLOAD
        <Camera size="1.3em" />
      </button>

      <button className="exit" style={{ background: snap.color }} onClick={() => (state.intro = true)}>
        GO BACK
        <ArrowLeft size="1.3em" />
      </button>
    </div>
  )
}
