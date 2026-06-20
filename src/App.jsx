import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Starfield from './components/Starfield';
import Planets from './components/Planets';
import ScrollThread from './components/ScrollThread';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Advantages from './components/Advantages';
import Cases from './components/Cases';
import Packages from './components/Packages';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SectionDivider from './components/SectionDivider';
import Sun from './components/Sun';
import MusicToggle from './components/MusicToggle';
import { useMagnetic } from './hooks/useMagnetic';
import { useIsMobile } from './hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  // На мобильных не монтируем тяжёлые декоративные слои (планеты, нить-орб):
  // они не несут смысла, но грузят поток и скролл. Стиль сохраняем за счёт
  // звёзд, солнца и градиентов.
  const isMobile = useIsMobile();

  useMagnetic(loaded);

  useEffect(() => {
    if (!loaded) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // пересчёт триггеров после полной загрузки макета.
    // Раньше пин «Клиентского пути» считал свои позиции до того, как
    // вёрстка/шрифты/картинки устаканились — отсюда «вылезает слишком рано
    // и всё летает». Дёргаем refresh на нескольких этапах готовности макета.
    const refresh = () => ScrollTrigger.refresh();
    const timers = [
      setTimeout(refresh, 300),
      setTimeout(refresh, 900),
      setTimeout(refresh, 1800),
    ];
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }

    // Высота страницы меняется уже после первого рендера: лениво грузится
    // тяжёлая WebGL-сцена Hero, картинки, шрифты. Если не пересчитать триггеры,
    // пин «Клиентского пути» считает свою позицию по старой высоте и срабатывает
    // раньше времени. Дёргаем refresh (с debounce) на каждое изменение высоты body.
    let roTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(refresh, 200);
    });
    ro.observe(document.body);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(roTimer);
      ro.disconnect();
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Cursor />
      <Starfield />
      <Sun />
      <div className="noise" />
      <Navbar />
      <main>
        {!isMobile && <Planets />}
        {!isMobile && <ScrollThread />}
        <Hero />
        <Stats />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Advantages />
        <SectionDivider />
        <Cases />
        <SectionDivider />
        <Packages />
        <SectionDivider />
        <Process />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <MusicToggle />
    </>
  );
}
