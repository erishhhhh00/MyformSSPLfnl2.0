import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const NeonBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a15);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2, 8);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Create flowing neon curves
        const curves: { curve: THREE.CatmullRomCurve3; mesh: THREE.Line; color: THREE.Color; speed: number; offset: number }[] = [];

        const colors = [
            new THREE.Color(0xff00ff), // Magenta
            new THREE.Color(0x00ffff), // Cyan
            new THREE.Color(0xff0080), // Pink
            new THREE.Color(0x0080ff), // Blue
            new THREE.Color(0x8000ff), // Purple
        ];

        // Create multiple flowing curves
        for (let i = 0; i < 15; i++) {
            const points: THREE.Vector3[] = [];
            const segments = 100;
            const offsetY = (Math.random() - 0.5) * 4;
            const offsetZ = (Math.random() - 0.5) * 6;
            const amplitude = 0.5 + Math.random() * 1.5;
            const frequency = 0.5 + Math.random() * 1;

            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = (t - 0.5) * 30;
                const y = Math.sin(t * Math.PI * frequency * 2) * amplitude + offsetY;
                const z = Math.cos(t * Math.PI * frequency) * amplitude * 0.5 + offsetZ - 5;
                points.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const curvePoints = curve.getPoints(200);
            const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

            const color = colors[i % colors.length];
            const material = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6 + Math.random() * 0.4,
                linewidth: 2,
            });

            const line = new THREE.Line(geometry, material);
            scene.add(line);

            curves.push({
                curve,
                mesh: line,
                color,
                speed: 0.0002 + Math.random() * 0.0005,
                offset: Math.random() * Math.PI * 2,
            });
        }

        // Create glowing particles along curves
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const curveIndex = Math.floor(Math.random() * curves.length);
            const t = Math.random();
            const point = curves[curveIndex].curve.getPoint(t);

            particlePositions[i * 3] = point.x + (Math.random() - 0.5) * 0.5;
            particlePositions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.5;
            particlePositions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.5;

            const color = curves[curveIndex].color;
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Create ambient glow spheres
        for (let i = 0; i < 5; i++) {
            const glowGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: colors[i],
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 5,
                -5 + (Math.random() - 0.5) * 5
            );
            scene.add(glow);
        }

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;

            // Animate curves
            curves.forEach((curveData, index) => {
                const positions = curveData.mesh.geometry.attributes.position.array as Float32Array;
                const points = curveData.curve.points;

                for (let i = 0; i < points.length; i++) {
                    const wave = Math.sin(time * 2 + i * 0.1 + curveData.offset) * 0.1;
                    points[i].y += wave * 0.01;
                }

                // Update curve geometry
                const newPoints = curveData.curve.getPoints(200);
                for (let i = 0; i < newPoints.length; i++) {
                    positions[i * 3] = newPoints[i].x;
                    positions[i * 3 + 1] = newPoints[i].y + Math.sin(time + i * 0.05) * 0.05;
                    positions[i * 3 + 2] = newPoints[i].z;
                }
                curveData.mesh.geometry.attributes.position.needsUpdate = true;

                // Pulse opacity
                const material = curveData.mesh.material as THREE.LineBasicMaterial;
                material.opacity = 0.5 + Math.sin(time * 2 + curveData.offset) * 0.3;
            });

            // Animate particles
            const particlePos = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                particlePos[i * 3] += Math.sin(time + i) * 0.002;
                particlePos[i * 3 + 1] += Math.cos(time + i * 0.5) * 0.002;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Rotate camera slightly
            camera.position.x = Math.sin(time * 0.1) * 0.5;
            camera.position.y = 2 + Math.cos(time * 0.15) * 0.3;
            camera.lookAt(0, 0, -2);

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
        />
    );
};

export default NeonBackground;
