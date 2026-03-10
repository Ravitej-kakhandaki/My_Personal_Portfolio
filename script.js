// Cursor
      const cur = document.getElementById("cur"),
        cur2 = document.getElementById("cur2");
      let mx = 0,
        my = 0,
        cx = 0,
        cy = 0;
      if (!("ontouchstart" in window)) {
        document.addEventListener("mousemove", (e) => {
          mx = e.clientX;
          my = e.clientY;
          cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        });
        (function loop() {
          cx += (mx - cx) * 0.1;
          cy += (my - cy) * 0.1;
          cur2.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
          requestAnimationFrame(loop);
        })();
        document
          .querySelectorAll("a,button,.project-card,.cert-item,.stat")
          .forEach((el) => {
            el.addEventListener("mouseenter", () => cur.classList.add("big"));
            el.addEventListener("mouseleave", () =>
              cur.classList.remove("big"),
            );
          });
      } else {
        cur.style.display = "none";
        cur2.style.display = "none";
        document.body.style.cursor = "auto";
      }

      // Nav
      const nav = document.getElementById("nav");
      window.addEventListener("scroll", () =>
        nav.classList.toggle("scrolled", window.scrollY > 50),
      );

      // Hamburger
      function toggleDrawer() {
        const d = document.getElementById("navDrawer"),
          h = document.getElementById("hamburger"),
          o = d.classList.toggle("open");
        h.classList.toggle("open", o);
        document.body.style.overflow = o ? "hidden" : "";
      }
      function closeDrawer() {
        document.getElementById("navDrawer").classList.remove("open");
        document.getElementById("hamburger").classList.remove("open");
        document.body.style.overflow = "";
      }

      // Reveals
      const obs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          }),
        { threshold: 0.1 },
      );
      document
        .querySelectorAll(".reveal,.tl-item,.project-card,.edu-card")
        .forEach((el) => obs.observe(el));

      // Skill bars
      const sObs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting)
              e.target
                .querySelectorAll(".skill-fill")
                .forEach((b) => (b.style.width = b.dataset.w + "%"));
          }),
        { threshold: 0.3 },
      );
      const sg = document.getElementById("skillsGrid");
      if (sg) sObs.observe(sg);

      // Stagger
      document
        .querySelectorAll(".tl-item")
        .forEach((el, i) => (el.style.transitionDelay = i * 0.12 + "s"));
      document
        .querySelectorAll(".project-card")
        .forEach((el, i) => (el.style.transitionDelay = i * 0.08 + "s"));
      document
        .querySelectorAll(".edu-card")
        .forEach((el, i) => (el.style.transitionDelay = i * 0.1 + "s"));

      function openResume() {
        document.getElementById("resumeModal").style.display = "block";
        document.body.style.overflow = "hidden";
      }
      function closeResume() {
        document.getElementById("resumeModal").style.display = "none";
        document.body.style.overflow = "";
      }
    

    
      /* ── HERO CANVAS: Neural network + meteor showers + aurora ── */
      (function () {
        const canvas = document.getElementById("heroCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let W, H, nodes, meteors, raf;

        function resize() {
          W = canvas.width = canvas.offsetWidth;
          H = canvas.height = canvas.offsetHeight;
          initNodes();
        }

        /* ── NODES (neural network) ── */
        const NODE_COUNT = 55;
        function initNodes() {
          nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: 1.2 + Math.random() * 2,
            alpha: 0.3 + Math.random() * 0.5,
            pulse: Math.random() * Math.PI * 2,
          }));
        }

        function drawNetwork() {
          const CONNECT_DIST = 160;
          // connections
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const dx = nodes[i].x - nodes[j].x;
              const dy = nodes[i].y - nodes[j].y;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < CONNECT_DIST) {
                const a = (1 - d / CONNECT_DIST) * 0.18;
                const grad = ctx.createLinearGradient(
                  nodes[i].x,
                  nodes[i].y,
                  nodes[j].x,
                  nodes[j].y,
                );
                grad.addColorStop(0, `rgba(240,192,64,${a})`);
                grad.addColorStop(0.5, `rgba(56,189,248,${a * 0.6})`);
                grad.addColorStop(1, `rgba(240,192,64,${a})`);
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
          // nodes
          nodes.forEach((n) => {
            n.x += n.vx;
            n.y += n.vy;
            n.pulse += 0.025;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;

            const glow = 0.5 + 0.5 * Math.sin(n.pulse);
            // outer glow
            const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
            g.addColorStop(0, `rgba(240,192,64,${0.25 * glow})`);
            g.addColorStop(1, `rgba(240,192,64,0)`);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
            // core dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240,192,64,${n.alpha * glow})`;
            ctx.fill();
          });
        }

        /* ── METEORS ── */
        function spawnMeteor() {
          return {
            x: Math.random() * W * 1.5,
            y: -20,
            len: 80 + Math.random() * 120,
            speed: 4 + Math.random() * 5,
            alpha: 0.5 + Math.random() * 0.5,
            width: 0.5 + Math.random() * 1.2,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            active: true,
          };
        }
        meteors = [];
        setInterval(() => {
          if (meteors.length < 6) meteors.push(spawnMeteor());
        }, 800);

        function drawMeteors() {
          meteors.forEach((m, i) => {
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            if (m.x > W + 100 || m.y > H + 100) {
              meteors.splice(i, 1);
              return;
            }

            const tailX = m.x - Math.cos(m.angle) * m.len;
            const tailY = m.y - Math.sin(m.angle) * m.len;
            const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, `rgba(255,255,255,0)`);
            grad.addColorStop(0.6, `rgba(240,192,64,${m.alpha * 0.4})`);
            grad.addColorStop(1, `rgba(255,255,255,${m.alpha})`);
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = m.width;
            ctx.lineCap = "round";
            ctx.stroke();
            // head sparkle
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.width * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${m.alpha})`;
            ctx.fill();
          });
        }

        /* ── AURORA WAVES at bottom ── */
        let auroraT = 0;
        function drawAurora() {
          auroraT += 0.004;
          const layers = [
            {
              color1: "rgba(240,192,64,",
              color2: "rgba(56,189,248,",
              amp: 60,
              freq: 0.004,
              phase: 0,
              yBase: H * 0.88,
            },
            {
              color1: "rgba(236,72,153,",
              color2: "rgba(240,192,64,",
              amp: 45,
              freq: 0.006,
              phase: 1.5,
              yBase: H * 0.92,
            },
            {
              color1: "rgba(56,189,248,",
              color2: "rgba(236,72,153,",
              amp: 35,
              freq: 0.005,
              phase: 3.0,
              yBase: H * 0.96,
            },
          ];
          layers.forEach((l) => {
            ctx.beginPath();
            ctx.moveTo(0, H);
            for (let x = 0; x <= W; x += 4) {
              const y =
                l.yBase +
                Math.sin(x * l.freq + auroraT + l.phase) * l.amp +
                Math.sin(x * l.freq * 2 + auroraT * 1.3 + l.phase) *
                  (l.amp * 0.4);
              ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, l.yBase - l.amp, 0, H);
            grad.addColorStop(0, l.color1 + "0.12)");
            grad.addColorStop(0.5, l.color2 + "0.06)");
            grad.addColorStop(1, l.color1 + "0)");
            ctx.fillStyle = grad;
            ctx.fill();
          });
        }

        /* ── SCANLINE sweep ── */
        let scanY = 0;
        function drawScan() {
          scanY = (scanY + 0.6) % H;
          const g = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
          g.addColorStop(0, "rgba(240,192,64,0)");
          g.addColorStop(0.5, "rgba(240,192,64,0.04)");
          g.addColorStop(1, "rgba(240,192,64,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, scanY - 40, W, 80);
        }

        function animate() {
          ctx.clearRect(0, 0, W, H);
          drawAurora();
          drawNetwork();
          drawMeteors();
          drawScan();
          raf = requestAnimationFrame(animate);
        }

        resize();
        animate();
        window.addEventListener("resize", () => {
          cancelAnimationFrame(raf);
          resize();
          animate();
        });
      })();