import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LOGO_GRID = [
  [0,0,0,1,1,1,1,0],  // row 0  — top cap (right-offset)
  [0,0,0,1,1,1,1,0],  // row 1
  [0,1,1,0,0,1,1,0],  // row 2  — left wall opens
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],  // row 9
  [0,0,1,1,1,1,0,0],  // row 10 — bottom cap
  [0,0,1,1,1,1,0,0],  // row 11
];

function buildMazeTex(): THREE.CanvasTexture {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const cx = cv.getContext('2d')!;

  // Very dark background
  cx.fillStyle = '#040408';
  cx.fillRect(0, 0, S, S);

  const drawRect = (x: number, y: number, w: number, h: number, alpha: number, dash: number, gap: number) => {
    cx.save();
    cx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    cx.lineWidth = 1.8;
    cx.setLineDash([dash, gap]);
    cx.strokeRect(x + 0.5, y + 0.5, w, h);
    cx.restore();
  };

  // 4 nested rectangles, bright white
  drawRect(6,  6,  S-13,  S-13,  0.88, 5, 6);
  drawRect(22, 22, S-45,  S-45,  0.65, 4, 7);
  drawRect(42, 42, S-85,  S-85,  0.45, 4, 9);
  drawRect(66, 66, S-133, S-133, 0.28, 3, 11);

  // Corner dots — outer ring
  [[8,8],[S-9,8],[8,S-9],[S-9,S-9]].forEach(([dx,dy]) => {
    cx.fillStyle = 'rgba(255,255,255,1)';
    cx.beginPath(); cx.arc(dx, dy, 4.5, 0, Math.PI*2); cx.fill();
  });
  // Corner dots — second ring
  [[24,24],[S-25,24],[24,S-25],[S-25,S-25]].forEach(([dx,dy]) => {
    cx.fillStyle = 'rgba(255,255,255,0.75)';
    cx.beginPath(); cx.arc(dx, dy, 3, 0, Math.PI*2); cx.fill();
  });

  // Passage connectors (all 4 sides)
  cx.strokeStyle = 'rgba(255,255,255,0.55)';
  cx.lineWidth = 1.5;
  cx.setLineDash([4, 5]);
  const connectors: [number,number,number,number][] = [
    [S/2, 6,   S/2, 22],
    [S-6, S/2, S-22, S/2],
    [S/2, S-6, S/2, S-22],
    [6,   S/2, 22,  S/2],
  ];
  connectors.forEach(([x1,y1,x2,y2]) => {
    cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke();
  });

  cx.setLineDash([]);
  return new THREE.CanvasTexture(cv);
}

function buildGroundGrid(): THREE.Points {
  const GCOLS = 60, GROWS = 50, GSPACING = 1.05;
  const pos: number[] = [];
  for (let i = 0; i < GCOLS; i++) {
    for (let j = 0; j < GROWS; j++) {
      pos.push(
        (i - GCOLS / 2) * GSPACING,
        -5.6,
        j * GSPACING * 0.85 + 0.3,
      );
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.10,
    color: 0xffffff,
    transparent: true,
    opacity: 0.60,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export default function ZiiroLogo3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 600;
    const H = el.clientHeight || 700;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 500);
    camera.position.set(0.4, -3, 17);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Higher ambient so the maze texture shows clearly
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(4, 8, 12);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x3040aa, 0.25);
    fill.position.set(-8, -4, -6);
    scene.add(fill);

    const TILE  = 0.82;
    const DEPTH = 0.32;
    const GAP   = 0.07;
    const STEP  = TILE + GAP;
    const ROWS  = LOGO_GRID.length;
    const COLS  = LOGO_GRID[0].length;

    const mazeTex = buildMazeTex();

    const faceMat = new THREE.MeshStandardMaterial({
      map: mazeTex,
      roughness: 0.65,
      metalness: 0.05,
    });
    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x080812,
      roughness: 0.95,
      metalness: 0.05,
    });
    const boxMats = [sideMat, sideMat, sideMat, sideMat, faceMat, faceMat];

    // White dashed edges
    const dashMat = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.052,
      gapSize: 0.052,
      transparent: true,
      opacity: 0.82,
    });

    const logoGroup = new THREE.Group();
    const offX = -((COLS - 1) * STEP) / 2;
    const offY =  ((ROWS - 1) * STEP) / 2;

    // Build tiles and collect world positions for group outlines
    type TilePos = { x: number; y: number; ri: number; ci: number };
    const tilePositions: TilePos[] = [];

    for (let ri = 0; ri < ROWS; ri++) {
      for (let ci = 0; ci < COLS; ci++) {
        if (!LOGO_GRID[ri][ci]) continue;

        const x = ci * STEP + offX;
        const y = -(ri * STEP) + offY;
        tilePositions.push({ x, y, ri, ci });

        const boxGeo = new THREE.BoxGeometry(TILE, TILE, DEPTH);
        const tile   = new THREE.Mesh(boxGeo, boxMats);
        tile.position.set(x, y, 0);
        logoGroup.add(tile);

        const eGeo  = new THREE.EdgesGeometry(boxGeo);
        const lines = new THREE.LineSegments(eGeo, dashMat.clone());
        lines.computeLineDistances();
        tile.add(lines);
      }
    }

    // Group outline: computes bounding box for a set of tiles and draws a dashed outline box
    const addGroupOutline = (tiles: TilePos[], pad = 0.10) => {
      if (!tiles.length) return;
      const xs = tiles.map(t => t.x);
      const ys = tiles.map(t => t.y);
      const minX = Math.min(...xs) - TILE / 2 - pad;
      const maxX = Math.max(...xs) + TILE / 2 + pad;
      const minY = Math.min(...ys) - TILE / 2 - pad;
      const maxY = Math.max(...ys) + TILE / 2 + pad;
      const w = maxX - minX;
      const h = maxY - minY;

      const outlineMat = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.10,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.55,
      });

      const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, DEPTH + pad * 2));
      const lines = new THREE.LineSegments(geo, outlineMat);
      lines.position.set((minX + maxX) / 2, (minY + maxY) / 2, 0);
      lines.computeLineDistances();
      logoGroup.add(lines);
    };

    // Left column group (cols 1-2, rows 2-9)
    const leftGroup = tilePositions.filter(t => t.ci <= 2 && t.ri >= 2 && t.ri <= 9);
    // Right+top group (cols 3-6, rows 0-9)
    const rightTopGroup = tilePositions.filter(t => t.ci >= 3 && t.ri <= 9);

    addGroupOutline(leftGroup);
    addGroupOutline(rightTopGroup);

    logoGroup.position.set(0, 1.2, 0);
    scene.add(logoGroup);

    scene.add(buildGroundGrid());

    let rafId: number;
    let t = 0;
    let targetRotY = 0;
    let targetRotX = -0.04;
    let currentRotY = 0;
    let currentRotX = -0.04;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.004;

      const idleY = Math.sin(t * 0.55) * 0.05;
      const idleX = Math.sin(t * 0.38) * 0.025 - 0.04;

      currentRotY += (targetRotY + idleY - currentRotY) * 0.06;
      currentRotX += (targetRotX + idleX - currentRotX) * 0.06;

      logoGroup.rotation.y = currentRotY;
      logoGroup.rotation.x = currentRotX;

      renderer.render(scene, camera);
    };
    animate();

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      targetRotY = ((e.clientX - r.left) / r.width  - 0.5) * 0.30;
      targetRotX = -((e.clientY - r.top)  / r.height - 0.5) * 0.20 - 0.04;
    };
    const onLeave = () => {
      targetRotY = 0;
      targetRotX = -0.04;
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    const onResize = () => {
      if (!el) return;
      const nW = el.clientWidth;
      const nH = el.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);

      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m: THREE.Material) => m.dispose());
        }
      });
      mazeTex.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
