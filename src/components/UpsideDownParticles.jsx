import { useEffect, useRef } from 'react';

/**
 * UpsideDownParticles
 * Canvas-based floating "Mind Flayer spore" particles that drift slowly
 * upward, mimicking the Upside Down atmosphere from Stranger Things.
 */
export default function UpsideDownParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = (x, y) => ({
            x: x ?? Math.random() * canvas.width,
            y: y ?? Math.random() * canvas.height,
            radius: Math.random() * 2.5 + 0.5,
            // Spores drift mostly upward with gentle horizontal drift
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(Math.random() * 0.5 + 0.1),
            opacity: Math.random() * 0.6 + 0.15,
            // Each particle flickers with its own phase & speed
            flickerPhase: Math.random() * Math.PI * 2,
            flickerSpeed: Math.random() * 0.03 + 0.005,
            // Color: mostly white/grey, occasional red tint
            hue: Math.random() < 0.12 ? `rgba(220, 80, 80,` : `rgba(220, 220, 220,`,
        });

        // Initialise a dense cloud of particles scattered across the screen
        const init = () => {
            const count = Math.floor((canvas.width * canvas.height) / 6000);
            particles = Array.from({ length: count }, () => createParticle());
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                // Sinusoidal flicker
                p.flickerPhase += p.flickerSpeed;
                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.flickerPhase));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                // Soft glow by drawing a blurred circle underneath
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
                gradient.addColorStop(0, `${p.hue}${alpha})`);
                gradient.addColorStop(1, `${p.hue}0)`);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Solid inner core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `${p.hue}${Math.min(alpha * 1.5, 1)})`;
                ctx.fill();

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around top → respawn at bottom
                if (p.y + p.radius < 0) {
                    p.y = canvas.height + p.radius;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -p.radius) p.x = canvas.width + p.radius;
                if (p.x > canvas.width + p.radius) p.x = -p.radius;
            });

            animationId = requestAnimationFrame(draw);
        };

        resize();
        init();
        draw();

        const onResize = () => {
            resize();
            init();
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
