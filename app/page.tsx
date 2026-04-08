'use client';

import { useEffect } from 'react';


export default function HomePage() {
  useEffect(() => {
    const API_URL = '/api/candidatures';

    /* ── COUNT-UP ANIMATION ── */
    function countUp(el: HTMLElement, target: number, duration: number = 1500) {
      let start = 0;
      let step = target / 60;
      let suffix = el.dataset.suffix || '';
      let timer = setInterval(function() {
        start += step;
        if (start >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
          return;
        }
        el.textContent = Math.floor(start) + suffix;
      }, duration / 60);
    }

    // IntersectionObserver for stats
    const statsEl = document.querySelector('.stats-grid');
    let statsObserver: IntersectionObserver | null = null;
    if (statsEl) {
      let fired = false;
      statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            document.querySelectorAll('.stat-n').forEach(function(el) {
              const htmlEl = el as HTMLElement;
              const target = parseInt(htmlEl.dataset.target || '0', 10);
              if (!isNaN(target) && target > 0) {
                countUp(htmlEl, target, 1500);
              }
            });
            statsObserver?.disconnect();
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statsEl);
    }

    /* ── FORM VALIDATION & SUBMISSION ── */
    const form = document.getElementById('inscriptionForm') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', async function(e: SubmitEvent) {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
        const requiredFields = ['nom_complet', 'age', 'tel', 'region', 'ville', 'niveau'];
        let valid = true;

        // Clear previous errors
        document.querySelectorAll('.form-input, .form-select').forEach(function(el) {
          el.classList.remove('error');
        });

        const data = {
          nom: (document.getElementById('nom_complet') as HTMLInputElement).value,
          prenom: '',
          telephone: (document.getElementById('tel') as HTMLInputElement).value,
          ville: (document.getElementById('ville') as HTMLInputElement).value,
          region: (document.getElementById('region') as HTMLSelectElement).value,
          age: (document.getElementById('age') as HTMLInputElement).value,
          email: (document.getElementById('email') as HTMLInputElement).value,
          niveau: (document.getElementById('niveau') as HTMLSelectElement).value,
          motivations: Array.from(document.querySelectorAll('input[name="motivations"]:checked')).map(function(cb){ return (cb as HTMLInputElement).value; }).join(', '),
          notes: (document.getElementById('message') as HTMLTextAreaElement).value
        };

        requiredFields.forEach(function(id) {
          const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
          if (!el) return;
          if (!el.value || el.value.trim() === '') {
            el.classList.add('error');
            valid = false;
          }
        });

        // Phone Validation (Maroc)
        const phoneEl = document.getElementById('tel') as HTMLInputElement;
        const phoneRegex = /^(\+212|00212|0)[5-9]\d{8}$/;
        if (phoneEl && !phoneRegex.test(phoneEl.value.replace(/\s/g,''))) {
          phoneEl.classList.add('error');
          valid = false;
        }

        if (!valid) {
          const firstError = document.querySelector('.error') as HTMLElement;
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
          return;
        }

        // Loading state
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const json = await res.json();

          if (!res.ok) throw new Error(json.error || 'Erreur lors de l\'envoi');

          // Show success
          form.style.display = 'none';
          const msg = document.getElementById('successMsg') as HTMLElement;
          if (msg) {
            msg.style.display = 'block';
            msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

        } catch (err: any) {
          alert(err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    }

    // Remove error on input
    document.querySelectorAll('.form-input, .form-select').forEach(function(el) {
      el.addEventListener('input', function() { el.classList.remove('error'); });
      el.addEventListener('change', function() { el.classList.remove('error'); });
    });

    /* ── NAVBAR active link on scroll ── */
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function(link) {
            (link as HTMLElement).style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              (link as HTMLElement).style.color = 'var(--orange)';
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function(s) { sectionObserver.observe(s); });

    return () => {
      statsObserver?.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;600&family=Space+Mono&family=Noto+Naskh+Arabic:wght@700&display=swap');
/* ── RESET ── */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --bg:      #0D0D0D;
  --surface: #141414;
  --border:  #1E1E1E;
  --orange:  #E8472A;
  --orange2: #FF6A45;
  --yellow:  #F0C040;
  --text:    #F0EDE8;
  --muted:   #555555;
}

html { scroll-behavior: smooth; }

body {
  background: #080808;
  font-family: 'Barlow', sans-serif;
  color: var(--text);
  overflow-x: hidden;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━ */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: rgba(13,13,13,0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 5vw, 48px);
  z-index: 1000;
}

.nav-brand {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 20px;
  color: var(--orange);
  text-decoration: none;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
  list-style: none;
}

.nav-links a {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--muted);
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 0;
  width: 0; height: 1px;
  background: var(--orange);
  transition: width 0.25s ease;
}

.nav-links a:hover { color: var(--text); }
.nav-links a:hover::after { width: 100%; }

.nav-cta {
  background: var(--orange);
  color: #fff !important;
  font-family: 'Barlow Condensed', sans-serif !important;
  font-weight: 700;
  font-size: 13px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 2px;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}
.nav-cta::after { display: none !important; }
.nav-cta:hover { background: var(--orange2) !important; color: #fff !important; transform: translateY(-1px); }

.nav-logo {
  height: 30px;
  width: auto;
  filter: brightness(0) invert(1);
  display: block;
  transition: opacity 0.2s;
}
.nav-logo:hover { opacity: 0.75; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━ */
#hero {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

/* Streaks animation */
.streaks {
  position: absolute; inset: 0;
  z-index: 1; pointer-events: none; overflow: hidden;
}
.streak {
  position: absolute;
  width: 3px; height: 180%; top: -40%;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(232,71,42,0.0) 20%,
    rgba(232,71,42,0.6) 50%,
    rgba(232,71,42,0.0) 80%,
    transparent 100%);
  transform: rotate(25deg);
  animation: streakMove 3.5s ease-in-out infinite;
  filter: blur(1px);
}
.streak:nth-child(1) { left:15%; width:2px; animation-delay:0s;   animation-duration:3.2s; opacity:0.7; }
.streak:nth-child(2) { left:35%; width:4px; animation-delay:0.8s; animation-duration:4.0s; opacity:0.5; }
.streak:nth-child(3) { left:55%; width:2px; animation-delay:1.6s; animation-duration:3.6s; opacity:0.4; }
.streak:nth-child(4) { left:75%; width:3px; animation-delay:2.4s; animation-duration:4.4s; opacity:0.3; }
.streak:nth-child(5) { left:88%; width:1px; animation-delay:0.4s; animation-duration:5.0s; opacity:0.25; }

@keyframes streakMove {
  0%   { transform: rotate(25deg) translateY(-100%); opacity:0; }
  10%  { opacity:1; }
  90%  { opacity:1; }
  100% { transform: rotate(25deg) translateY(60%);  opacity:0; }
}

/* Glow */
.glow {
  position: absolute; top: -140px; right: -80px;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,71,42,0.12) 0%, rgba(232,71,42,0.04) 40%, transparent 70%);
  pointer-events: none; z-index: 2;
  animation: glowPulse 4s ease-in-out infinite;
}
@keyframes glowPulse {
  0%,100% { opacity:0.7; transform:scale(1); }
  50%      { opacity:1;   transform:scale(1.08); }
}

.deco {
  position: absolute; bottom: -100px; right: -100px;
  width: 380px; height: 380px; border-radius: 50%;
  border: 1px solid rgba(232,71,42,0.18);
  pointer-events: none; z-index: 2;
}
.deco::before {
  content: ''; position: absolute; inset: 22px;
  border-radius: 50%; border: 1px solid rgba(232,71,42,0.09);
}

/* Logos bar */
.logos {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: clamp(10px,2vw,14px) clamp(16px,4vw,40px);
  display: flex; align-items: center; flex-wrap: wrap;
  justify-content: center; gap: clamp(12px,3vw,28px);
  position: relative; z-index: 5;
}
.logo-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.logo-img {
  height: clamp(24px,4vw,36px); width: auto;
  max-width: clamp(60px,12vw,100px); object-fit: contain;
  filter: grayscale(1) brightness(1.3) contrast(0.85);
}
.logo-sep { color: var(--muted); font-size: clamp(14px,2vw,20px); font-weight: 300; opacity: 0.4; }
.logo-label { font-family: 'Space Mono', monospace; font-size: clamp(6px,1vw,7px); color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

/* Hero content */
.hero-content {
  flex: 1;
  padding: clamp(48px,8vw,80px) clamp(20px,6vw,80px) clamp(60px,8vw,100px);
  position: relative; z-index: 5;
  display: flex; flex-direction: column; justify-content: center;
  max-width: 1000px;
}

.badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
.badge {
  font-family: 'Space Mono', monospace; font-size: 9px;
  text-transform: uppercase; letter-spacing: 1.5px;
  padding: 3px 9px; border-radius: 2px;
}
.bg { color: var(--orange2); background: rgba(232,71,42,0.08); border: 1px solid rgba(232,71,42,0.28); }
.bc { color: #888; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); }
.br { color: #fff; background: rgba(232,71,42,0.90); border: none; }

.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: clamp(56px, 9vw, 100px);
  line-height: 0.88;
  text-transform: uppercase;
  color: var(--text);
  letter-spacing: -3px;
  margin-bottom: 18px;
}

.hero-ar {
  font-family: 'Noto Naskh Arabic', serif;
  font-size: clamp(16px,2.5vw,22px);
  color: var(--text); opacity: 0.35;
  direction: rtl; text-align: left;
  margin-bottom: 36px;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, rgba(232,71,42,0.6), transparent);
  margin-bottom: 36px;
  max-width: 400px;
}

.hero-desc {
  font-family: 'Barlow', sans-serif;
  font-weight: 300; font-size: clamp(14px,2vw,17px);
  color: #999; line-height: 1.7;
  max-width: 520px; margin-bottom: 36px;
}

.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.btn-primary {
  background: var(--orange); color: #fff;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
  font-size: 16px; text-transform: uppercase; letter-spacing: 1px;
  padding: 14px 32px; border-radius: 2px; border: none;
  text-decoration: none; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: inline-block;
}
.btn-primary:hover { background: var(--orange2); transform: translateY(-2px); }

.btn-ghost {
  background: transparent; color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
  font-size: 16px; text-transform: uppercase; letter-spacing: 1px;
  padding: 14px 32px; border-radius: 2px;
  border: 1px solid var(--border); text-decoration: none;
  display: inline-block; transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: var(--orange); color: var(--text); }

/* Scroll arrow */
.scroll-arrow {
  position: absolute;
  bottom: 28px; left: 50%;
  transform: translateX(-50%);
  color: rgba(240,237,232,0.35);
  font-size: 22px;
  text-decoration: none;
  animation: bounce 2s ease-in-out infinite;
  z-index: 10;
}
@keyframes bounce {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(10px); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   CONTENT WRAPPER
━━━━━━━━━━━━━━━━━━━━━━━━ */
.section {
  width: 100%; max-width: 1100px;
  margin: 0 auto;
  padding: clamp(48px,8vw,80px) clamp(20px,6vw,80px);
}

.section-kicker {
  font-family: 'Space Mono', monospace; font-size: 9px;
  text-transform: uppercase; color: var(--orange);
  letter-spacing: 2px; margin-bottom: 12px;
}
.section-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: clamp(32px,5vw,56px); text-transform: uppercase;
  color: var(--text); letter-spacing: -1px;
  line-height: 1; margin-bottom: 10px;
}
.section-sub {
  font-family: 'Barlow', sans-serif; font-weight: 300;
  font-size: clamp(13px,1.8vw,15px); color: #777;
  margin-bottom: 40px; max-width: 560px; line-height: 1.7;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION: PROGRAMME (terminal)
━━━━━━━━━━━━━━━━━━━━━━━━ */
#programme { background: #080808; }

.term {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.term-head {
  background: #0A0A0A; height: 36px;
  display: flex; align-items: center;
  padding: 0 16px; gap: 6px;
  border-bottom: 1px solid var(--border);
}
.td { width: 10px; height: 10px; border-radius: 50%; }
.td.r { background: rgba(232,71,42,0.80); }
.td.y { background: rgba(240,192,64,0.55); }
.td.g { background: rgba(80,200,80,0.45); }
.tlabel {
  font-family: 'Space Mono', monospace; font-size: 10px;
  color: var(--muted); margin-left: 8px;
}
.term-body {
  padding: clamp(16px,3vw,28px) clamp(16px,3vw,28px);
  font-family: 'Space Mono', monospace;
  font-size: clamp(11px,1.5vw,13px);
  line-height: 2.4; overflow-x: auto;
}
.tg { color: var(--orange); }
.tw { color: var(--text); }
.tc { color: #888; }
.ty { color: var(--yellow); }
.tm { color: var(--muted); }
.cur {
  display: inline-block; width: 8px; height: 14px;
  background: var(--orange); vertical-align: middle;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity:0; } }

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION: RÉSULTATS (stats)
━━━━━━━━━━━━━━━━━━━━━━━━ */
#pourquoi { background: var(--bg); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--border);
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.stat {
  padding: clamp(20px,3vw,36px) 0;
  text-align: center;
  border-right: 1px solid var(--border);
  position: relative;
  background: var(--surface);
}
.stat::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: var(--orange);
}
.stat:last-child { border-right: none; }
.stat-n {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800; font-size: clamp(32px,5vw,52px);
  color: var(--orange); line-height: 1;
}
.stat-l {
  font-family: 'Space Mono', monospace; font-size: clamp(7px,1vw,9px);
  text-transform: uppercase; color: var(--muted); margin-top: 8px;
  line-height: 1.5;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION: POSTULER (form)
━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ── FIX OVERLAYS ── */
.streaks, .glow, .deco, .deco2, .poster::before, .cta::before {
  pointer-events: none !important;
  user-select: none !important;
}

#postuler { 
  background: var(--surface); 
  border-top: 3px solid var(--orange);
  position: relative;
  z-index: 50 !important;
}

#postuler .section::before {
  content: ''; position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(232,71,42,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,71,42,0.025) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  position: relative; z-index: 52;
}
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full { grid-column: 1 / -1; }

.form-label {
  font-family: 'Space Mono', monospace; font-size: 8px;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted);
}

.form-input, .form-select, .form-textarea {
  background: #0A0A0A; border: 1px solid var(--border);
  border-radius: 2px; padding: 13px 16px;
  font-family: 'Barlow', sans-serif; font-size: 14px;
  color: var(--text); outline: none; width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;
  z-index: 60 !important;
  pointer-events: auto !important;
  cursor: text !important;
}
.form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(232,71,42,0.10);
}
.form-input.error, .form-select.error {
  border-color: var(--orange) !important;
  animation: shake 0.35s ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  60%      { transform: translateX(6px); }
}

/* Hide spinners */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button { -webkit-appearance:none; appearance:none; margin:0; }
input[type=number] { -moz-appearance:textfield; appearance:textfield; }

.form-select { appearance: none; cursor: pointer; }
.form-select option { background: #141414; color: var(--text); }
.form-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

/* Motivation radio */
.radio-group { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.radio-item { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.radio-item input[type=radio], .radio-item input[type=checkbox] { display: none; }
.radio-box {
  width: 16px; height: 16px; border: 1px solid var(--border);
  border-radius: 2px; flex-shrink: 0; position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.radio-item input:checked ~ .radio-box { border-color: var(--orange); background: rgba(232,71,42,0.15); }
.radio-item input:checked ~ .radio-box::after {
  content: ''; position: absolute; inset: 3px;
  background: var(--orange); border-radius: 1px;
}
.radio-text { font-family: 'Barlow', sans-serif; font-size: 13px; color: #888; }

.form-divider {
  grid-column: 1 / -1; height: 1px;
  background: linear-gradient(to right, transparent, var(--border) 30%, var(--border) 70%, transparent);
  margin: 4px 0;
}

.form-submit-row {
  grid-column: 1 / -1;
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  margin-top: 10px; flex-wrap: wrap;
}
.form-note {
  font-family: 'Space Mono', monospace; font-size: 8px;
  color: var(--muted); line-height: 2;
}
.form-note span { color: var(--orange); }
.submit-btn {
  background: var(--orange); color: #fff; border: none; cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
  font-size: 17px; text-transform: uppercase; letter-spacing: 1px;
  padding: 15px 36px; border-radius: 2px;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}
.submit-btn:hover { background: var(--orange2); }
.submit-btn:active { transform: scale(0.98); }

/* Success state */
#successMsg {
  display: none;
  background: #0A0A0A; border: 1px solid var(--orange);
  border-radius: 4px; padding: 56px 40px;
  text-align: center;
  position: relative; z-index: 1;
}
.success-icon {
  font-size: 64px; color: var(--orange);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900; margin-bottom: 20px;
  display: block;
}
.success-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: 40px; text-transform: uppercase; color: var(--text);
  letter-spacing: -1px; margin-bottom: 12px;
}
.success-sub { font-family: 'Barlow', sans-serif; font-size: 15px; color: var(--muted); margin-bottom: 14px; }
.success-ar { font-family: 'Noto Naskh Arabic', serif; font-size: 18px; color: var(--text); opacity: 0.4; direction: rtl; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━ */
.site-footer {
  background: #0A0A0A;
  border-top: 1px solid var(--border);
  padding: clamp(28px,5vw,48px) clamp(20px,6vw,64px);
}
.footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; gap: 40px;
  justify-content: space-between; align-items: flex-start;
}
.footer-col { display: flex; flex-direction: column; gap: 8px; }

.footer-brand-name {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: 20px; text-transform: uppercase; color: var(--text);
  letter-spacing: 0.5px;
}
.footer-brand-sub {
  font-family: 'Space Mono', monospace; font-size: 9px;
  color: var(--muted); text-transform: uppercase; letter-spacing: 1px;
}

.footer-partners-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}
.footer-partner-sep {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  opacity: 0.4;
}
.footer-partner-logo {
  height: 14px;
  width: auto;
  filter: grayscale(1) brightness(1.4) contrast(0.8);
  opacity: 0.6;
}
.footer-partner-text {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.footer-copy {
  font-family: 'Space Mono', monospace; font-size: 9px;
  color: var(--muted); margin-top: 6px; line-height: 1.8;
}

.footer-nav { display: flex; flex-direction: column; gap: 12px; }
.footer-nav a {
  font-family: 'Space Mono', monospace; font-size: 9px;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--muted); text-decoration: none;
  transition: color 0.2s;
}
.footer-nav a:hover { color: var(--orange); }

.footer-contact { display: flex; flex-direction: column; gap: 8px; }
.footer-phone {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: clamp(20px,3vw,28px);
  color: var(--orange); letter-spacing: 0.5px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-phone:hover { color: var(--orange2); }
.footer-email {
  font-family: 'Space Mono', monospace; font-size: 10px;
  color: var(--muted); text-decoration: none;
  transition: color 0.2s;
}
.footer-email:hover { color: var(--text); }
.footer-wa {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Space Mono', monospace; font-size: 9px;
  color: var(--muted); text-decoration: none;
  margin-top: 4px; transition: color 0.2s;
}
.footer-wa:hover { color: #25D366; }
.footer-wa svg { width: 16px; height: 16px; fill: currentColor; }

.footer-bottom {
  max-width: 1100px; margin: 32px auto 0;
  padding-top: 20px; border-top: 1px solid var(--border);
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 10px;
}
.footer-bottom-text {
  font-family: 'Space Mono', monospace; font-size: 8px;
  color: var(--muted); opacity: 0.5;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━
   RESPONSIVE
━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .navbar { padding: 0 20px; }
  .hero-title { font-size: clamp(48px, 10vw, 86px); letter-spacing: -2px; }
  .hero-content { padding: 48px 20px 80px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(3) { border-top: 1px solid var(--border); }
  .stat:nth-child(4) { border-top: 1px solid var(--border); }
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full { grid-column: 1; }
  .form-divider { grid-column: 1; }
  .form-submit-row { flex-direction: column; align-items: stretch; }
  .submit-btn { text-align: center; width: 100%; }
  .footer-inner { flex-direction: column; text-align: center; align-items: center; }
  .footer-nav { align-items: center; }
  .footer-contact { align-items: center; }
  .footer-bottom { justify-content: center; text-align: center; }
}

@media (max-width: 480px) {
  .hero-title { font-size: clamp(38px, 9vw, 52px); letter-spacing: -1px; }
  .logo-sep { display: none; }
  .logos { gap: 16px; }
  .badge-row { flex-wrap: wrap; gap: 6px; }
  .hero-actions { flex-direction: column; }
  .btn-primary, .btn-ghost { text-align: center; width: 100%; }
  .section { padding: 40px 16px; }
  .term-body { font-size: 10px; line-height: 1.9; }
}
      `}</style>
      
      {/* ━━━━ NAVBAR ━━━━ */}
<nav className="navbar" role="navigation" aria-label="Navigation principale">
  <a href="#hero" className="nav-brand"><img src="/logo.png" alt="TEC Groupe" className="nav-logo" /></a>
  <ul className="nav-links" role="list">
    <li><a href="#programme">Programme</a></li>
    <li><a href="#pourquoi">Résultats</a></li>
    <li><a href="#postuler">Candidater</a></li>
  </ul>
  <a href="#postuler" className="nav-cta">POSTULER →</a>
</nav>

      {/* ━━━━ HERO ━━━━ */}
<section id="hero" aria-label="Section principale">

  <div className="streaks" aria-hidden="true">
    <div className="streak"></div>
    <div className="streak"></div>
    <div className="streak"></div>
    <div className="streak"></div>
    <div className="streak"></div>
  </div>
  <div className="glow" aria-hidden="true"></div>
  <div className="deco" aria-hidden="true"></div>

    {/* Logos */}
  <div className="logos">
    <div className="logo-wrap">
      <img className="logo-img" src="/logo.png" alt="TEC Groupe" />
      <span className="logo-label">Opérateur</span>
    </div>

    <span className="logo-sep" aria-hidden="true">×</span>
    <div className="logo-wrap">
      <img className="logo-img" src="logo_aqj__1_-removebg-preview.png" alt="AQJ" />
      <span className="logo-label">Partenaire</span>
    </div>
    <span className="logo-sep" aria-hidden="true">|</span>
    <div className="logo-wrap">
      <img className="logo-img" src="/logounfm_fc561731bb.png" alt="UNFM" />
      <span className="logo-label">Partenaire</span>
    </div>
    <span className="logo-sep" aria-hidden="true">|</span>
    <div className="logo-wrap">
      <img className="logo-img" src="/LOGO_ANAPEC.png" alt="ANAPEC" />
      <span className="logo-label">Partenaire</span>
    </div>
    <div className="logo-wrap">
      <img className="logo-img" src="/c1335743-7b7d-4ea7-b575-2b30671e5be1.png" alt="swisscontact" />
      <span className="logo-label">Partenaire</span>
    </div>
    
    
  </div>

    {/* Hero Content */}
  <div className="hero-content">
    <div className="badge-row">
      <span className="badge bg">// GROUPE_06</span>
      <span className="badge bc">FRANÇAIS PRO</span>
      <span className="badge br">⚠ 16 PLACES</span>
    </div>

    <h1 className="hero-title">INSCRIPTION<br />EN LIGNE</h1>
    <div className="hero-ar" aria-label="التسجيل عبر الإنترنت — الفوج السادس">التسجيل عبر الإنترنت — الفوج السادس</div>

    <div className="divider" aria-hidden="true"></div>

    <p className="hero-desc">
      Formation 100% gratuite à Béni-Mellal · 16 places disponibles<br />
      Sélection sur entretien individuel — Session 2026
    </p>

    <div className="hero-actions">
      <a href="#postuler" className="btn-primary">POSTULER MAINTENANT →</a>
      <a href="#programme" className="btn-ghost">Voir le programme</a>
    </div>
  </div>

    {/* Scroll arrow */}
  <a href="#programme" className="scroll-arrow" aria-label="Défiler vers le bas">↓</a>
</section>

{/* ━━━━ PROGRAMME ━━━━ */}
<div id="programme" style={{ background: '#080808' }}>
  <div className="section">
    <div className="section-kicker">// Status</div>
    <h2 className="section-title">LE PROGRAMME</h2>
    <p className="section-sub">Le programme TRAINENIG EDGE CONSULTING intègre une formation en Français Professionnel au sein d'un cycle complet de coaching, pour faciliter l'accès des jeunes au monde de l'entreprise et à l'indépendance économique.</p>

    <div className="term" role="region" aria-label="Terminal de statut">
      <div className="term-head">
        <div className="td r"></div><div className="td y"></div><div className="td g"></div>
        <span className="tlabel">status.sh</span>
      </div>
      <div className="term-body">
        <div><span className="tg">$ </span><span className="tw">registration --check-availability</span></div>
        <div><span className="tc">✓  Session 2026 active</span></div>
        <div><span className="tc">✓  Lieu : Béni-Mellal</span></div>
        <div><span className="ty">⚠  Dernier délai : 15 Avril</span></div>
        <div><span className="tm">#  Remplissez le formulaire ci-dessous</span></div>
        <div><span className="tg">›  </span><span className="cur" aria-hidden="true"></span></div>
      </div>
    </div>
  </div>
</div>

{/* ━━━━ RÉSULTATS ━━━━ */}
<div id="pourquoi" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
  <div className="section">
    <div className="section-kicker">// Chiffres clés</div>
    <h2 className="section-title">NOS RÉSULTATS</h2>
    <p className="section-sub">5 promotions réussies, des résultats prouvés sur le terrain à Béni-Mellal et la région.</p>

    <div className="stats-grid" role="list">
      <div className="stat" role="listitem">
        <div className="stat-n" data-target="100" data-suffix="%">100%</div>
        <div className="stat-l">Gratuit</div>
      </div>
      <div className="stat" role="listitem">
        <div className="stat-n" data-target="4" data-suffix="">4</div>
        <div className="stat-l">Mois de<br />formation</div>
      </div>
      <div className="stat" role="listitem">
        <div className="stat-n" data-target="" data-suffix="">G06</div>
        <div className="stat-l">Promotion<br />en cours</div>
      </div>
      <div className="stat" role="listitem">
        <div className="stat-n" data-target="16" data-suffix="">16</div>
        <div className="stat-l">Places<br />disponibles</div>
      </div>
    </div>
  </div>
</div>

{/* ━━━━ FORMULAIRE ━━━━ */}
<div id="postuler" style={{ background: 'var(--surface)', borderTop: '3px solid var(--orange)' }}>
  <div className="section">
    <div className="section-kicker">// Dossier de candidature</div>
    <h2 className="section-title">FORMULAIRE DE SÉLECTION</h2>
    <p className="section-sub">Veuillez remplir vos informations réelles pour être contacté pour l'entretien.</p>

        {/* FORM */}
    <form id="inscriptionForm" noValidate>
      <div className="form-grid">
                {/* ROW 1 */}
        <div className="form-group">
          <label className="form-label" htmlFor="nom_complet">NOM COMPLET *</label>
          <input type="text" id="nom_complet" name="nom_complet" className="form-input" placeholder="ex: Ahmed El Mansouri" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="age">ÂGE *</label>
          <input type="number" id="age" name="age" className="form-input" placeholder="ex: 24" min="18" max="45" required />
        </div>
                {/* ROW 2 */}
        <div className="form-group">
          <label className="form-label" htmlFor="tel">TÉLÉPHONE (WHATSAPP) *</label>
          <input type="tel" id="tel" name="telephone" className="form-input" placeholder="0600000000" required style={{ pointerEvents: 'auto', cursor: 'text', position: 'relative', zIndex: '10' }} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">EMAIL</label>
          <input type="email" id="email" name="email" className="form-input" placeholder="ex: ahmed@gmail.com" />
        </div>
                {/* ROW 3 */}
        <div className="form-group">
          <label className="form-label" htmlFor="region">RÉGION *</label>
          <select id="region" name="region" className="form-select" required>
            <option value="">Choisir...</option>
            <option>Béni Mellal-Khénifra</option>
            <option>Casablanca-Settat</option>
            <option>Marrakech-Safi</option>
            <option>Souss-Massa</option>
            <option>Drâa-Tafilalet</option>
            <option>Fès-Meknès</option>
            <option>Rabat-Salé-Kénitra</option>
            <option>Tanger-Tétouan-Al Hoceïma</option>
            <option>Oriental</option>
            <option>Guelmim-Oued Noun</option>
            <option>Laâyoune-Sakia El Hamra</option>
            <option>Dakhla-Oued Ed-Dahab</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ville">VILLE *</label>
          <input type="text" id="ville" name="ville" className="form-input" placeholder="ex: Béni Mellal" required />
        </div>
        <div className="form-group full">
          <label className="form-label" htmlFor="niveau">Niveau d'études *</label>
          <select id="niveau" className="form-select" required>
            <option value="">Choisir...</option>
            <option value="bac">Bac (Baccalauréat)</option>
            <option value="bac+1">Bac +1</option>
            <option value="bac+2">Bac +2 (DUT / BTS / DEUST)</option>
            <option value="bac+3">Bac +3 (Licence)</option>
            <option value="bac+4">Bac +4 (Master 1)</option>
            <option value="bac+5">Bac +5 (Master 2 / Ingénieur)</option>
            <option value="doctorat">Doctorat</option>
            <option value="ofppt">Formation Professionnelle (OFPPT)</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="form-divider"></div>

        <div className="form-group full">
          <label className="form-label">Pourquoi voulez-vous rejoindre cette formation ?</label>
          <div className="radio-group">
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="emploi" />
              <span className="radio-box"></span>
              <span className="radio-text">Trouver un emploi (salarié ou indépendant)</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="blocage" />
              <span className="radio-box"></span>
              <span className="radio-text">Surmonter le blocage après le diplôme</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="softskills" />
              <span className="radio-box"></span>
              <span className="radio-text">Développer mes soft skills &amp; confiance en moi</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="projet" />
              <span className="radio-box"></span>
              <span className="radio-text">Créer mon propre projet / auto-emploi</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="employabilite" />
              <span className="radio-box"></span>
              <span className="radio-text">Améliorer mon employabilité sur le marché</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="coach" />
              <span className="radio-box"></span>
              <span className="radio-text">Être accompagné(e) par un coach professionnel</span>
            </label>
            <label className="radio-item">
              <input type="checkbox" name="motivations" value="autre" />
              <span className="radio-box"></span>
              <span className="radio-text">Autre</span>
            </label>
          </div>
        </div>

        <div className="form-group full">
          <label className="form-label" htmlFor="message">Message Additionnel (Optionnel)</label>
          <textarea id="message" className="form-textarea" placeholder="Parlez-nous brièvement de votre parcours..."></textarea>
        </div>

        <div className="form-submit-row">
          <div className="form-note">
            En cliquant, vous acceptez d'être contacté<br />
            par <span>TEC GROUPE</span> pour un entretien.
          </div>
          <button type="submit" className="submit-btn">Envoyer Candidature →</button>
        </div>
      </div>
    </form>

        {/* Success message */}
    <div id="successMsg" role="alert" aria-live="polite">
      <span className="success-icon" aria-hidden="true">✓</span>
      <div className="success-title">Candidature envoyée ✓</div>
      <p className="success-sub">Notre équipe vous contactera sous 48h</p>
      <p className="success-ar">سنتواصل معك قريباً</p>
    </div>
  </div>
</div>

{/* ━━━━ FOOTER ━━━━ */}
<footer className="site-footer" role="contentinfo">
  <div className="footer-inner">
        {/* LEFT */}
    <div className="footer-col">
      <div className="footer-brand-name">Training Edge Consulting</div>
      <div className="footer-partners-row">
        <span className="footer-brand-sub">× C4EE × AQJ × Anapec × Swisscontact × HSLU Lucerne</span>
        <span className="footer-partner-sep">·</span>
        
      </div>
      <div className="footer-copy">© 2026 — Béni-Mellal, Maroc</div>
    </div>

        {/* CENTER */}
    <nav className="footer-nav" aria-label="Liens du site">
      <a href="#hero">Accueil</a>
      <a href="#programme">Programme</a>
      <a href="#pourquoi">Résultats</a>
      <a href="#postuler">Candidater</a>
    </nav>

        {/* RIGHT */}
    <div className="footer-contact">
      <a href="tel:+212608635578" className="footer-phone">+212 608 635 578</a>
      <a href="mailto:trainingedgeconsulting@gmail.com" className="footer-email">trainingedgeconsulting@gmail.com</a>
      <a href="https://wa.me/212608635578" target="_blank" rel="noopener noreferrer" className="footer-wa" aria-label="Contacter sur WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  </div>

  <div className="footer-bottom">
    <span className="footer-bottom-text">TRAINING EDGE CONSULTING — Formation Groupe 06 · 2026 · Béni-Mellal</span>
    <span className="footer-bottom-text">Tous droits réservés · Training Edge Consulting</span>
  </div>
</footer>

{/* ━━━━ JAVASCRIPT ━━━━ */}


    </>
  );
}
