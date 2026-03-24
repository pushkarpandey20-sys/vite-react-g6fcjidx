import React, { useState, useEffect, useCallback } from 'react';

const S = `
.slider-wrap { position: relative; overflow: hidden; border-radius: 20px; }
.slider-track { display: flex; transition: transform .5s cubic-bezier(.4,0,.2,1); will-change: transform; }
.slide { flex-shrink: 0; width: 100%; position: relative; }
.slider-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer;
  background: rgba(255,255,255,.18); backdrop-filter: blur(6px);
  color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center;
  z-index: 10; transition: all .2s; border: 1px solid rgba(255,255,255,.3);
}
.slider-btn:hover { background: rgba(255,255,255,.32); transform: translateY(-50%) scale(1.1); }
.slider-prev { left: 14px; }
.slider-next { right: 14px; }
.slider-dots { display: flex; justify-content: center; gap: 7px; margin-top: 14px; }
.sdot {
  width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer;
  background: rgba(212,160,23,.3); transition: all .3s; padding: 0;
}
.sdot.active { background: #FF6B00; width: 24px; border-radius: 4px; }
`;

export default function Slider({ slides, autoPlay = true, interval = 4000, showDots = true, showArrows = true, height = '340px' }) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % count), [count]);
  const prev = () => setCurrent(c => (c - 1 + count) % count);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, next]);

  return (
    <>
      <style>{S}</style>
      <div className="slider-wrap" style={{ height }}>
        <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="slide" style={{ height }}>
              {slide}
            </div>
          ))}
        </div>

        {showArrows && count > 1 && (
          <>
            <button className="slider-btn slider-prev" onClick={prev}>‹</button>
            <button className="slider-btn slider-next" onClick={next}>›</button>
          </>
        )}
      </div>

      {showDots && count > 1 && (
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`sdot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}
    </>
  );
}
