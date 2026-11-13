"use client";

// The SalienT stage inside Rave Mode (Update 6.43): a 3D rave with the SalienT
// cast for songs that have one (SALIENT_SONGS). The stage is prebuilt into
// public/rave/salient/salient-rave.js (source: rave-src/salient) and only reads
// the song's clock from The Rave's own player.

import { useEffect, useRef, useState } from "react";

export const SALIENT_SONGS = new Set(["Ominous"]);
const BASE = "/rave/salient/";
let loading = null;
function loadScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.SalientRave) return Promise.resolve(window.SalientRave);
  if (!loading) {
    loading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = BASE + "salient-rave.js?v=6.43"; s.async = true;
      s.onload = () => (window.SalientRave ? res(window.SalientRave) : rej(new Error("stage missing")));
      s.onerror = () => { loading = null; rej(new Error("stage did not load")); };
      document.head.appendChild(s);
    });
  }
  return loading;
}

export function salientSupported() {
  try { const c = document.createElement("canvas"); return !!c.getContext("webgl2"); } catch (e) { return false; }
}

// getTime: the song's position in seconds, as heard
export default function SalientRave({ getTime, onReady, onFail, calm }) {
  const hostRef = useRef(null);
  const [prog, setProg] = useState({ v: 0, name: "" });
  const [ready, setReady] = useState(false);
  const live = useRef({ getTime, onReady, onFail });
  live.current = { getTime, onReady, onFail };

  useEffect(() => {
    let stage = null, gone = false;
    const forced = /[?&]warden\b/.test(window.location.search) ? true : undefined;
    loadScript().then((SR) => {
      if (gone) return;
      stage = SR.mount(hostRef.current, {
        base: BASE, calm, warden: forced,
        getTime: () => live.current.getTime(),
        onProgress: (v, name) => setProg({ v, name }),
        onReady: () => { setReady(true); live.current.onReady && live.current.onReady(); },
        onError: () => live.current.onFail && live.current.onFail(),
      });
    }).catch(() => live.current.onFail && live.current.onFail());
    return () => { gone = true; if (stage) stage.destroy(); };
  }, [calm]);

  return (
    <div className="rv-sal" aria-hidden="true">
      <div ref={hostRef} className="rv-sal-host" />
      {!ready && (
        <div className="rv-sal-load">
          <div className="mono rv-kicker">SALIENT STAGE</div>
          <div className="rv-sal-bar"><i style={{ width: Math.round(prog.v * 100) + "%" }} /></div>
          <div className="mono rv-sal-msg">{prog.name ? prog.name + " is in the building" : "Loading the cast…"}</div>
        </div>
      )}
    </div>
  );
}
