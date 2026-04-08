import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBG } from '../context/BattlegroundContext';
import type { MapPoint, Faction, PowerupType } from '../types';

interface Props {
  position: { x: number; y: number };
  mapPoint: MapPoint;
  onClose: () => void;
}

interface SubMenuItem {
  key: string;
  label: string;
}

interface SubMenu {
  title: string;
  items: SubMenuItem[];
}

type SubMenuType = 'gy' | 'buf' | 'rte' | 'obj';

const SUBMENUS: Record<SubMenuType, SubMenu> = {
  gy: {
    title: 'Graveyard Faction',
    items: [
      { key: 'gy-alliance', label: 'Alliance GY' },
      { key: 'gy-horde', label: 'Horde GY' },
      { key: 'gy-neutral', label: 'Neutral GY' },
    ]
  },
  buf: {
    title: 'Power-up Type',
    items: [
      { key: 'buf-speed', label: '⚡ Speed' },
      { key: 'buf-berserk', label: '⚔ Berserking' },
      { key: 'buf-restore', label: '♥ Restoration' },
    ]
  },
  rte: {
    title: 'Route Color',
    items: [
      { key: 'rte-#ffd700', label: '● Primary (Gold)' },
      { key: 'rte-#4499ff', label: '● Secondary (Blue)' },
      { key: 'rte-#88ff44', label: '● Alternate (Green)' },
      { key: 'rte-#ff4444', label: '● Horde (Red)' },
      { key: 'rte-#cc88ff', label: '● Special (Purple)' },
    ]
  },
  obj: {
    title: 'Objective Type',
    items: [
      { key: 'obj-node', label: '★ Capture Node' },
      { key: 'obj-flag-alliance', label: '⚑ Flag (Alliance)' },
      { key: 'obj-flag-horde', label: '⚑ Flag (Horde)' },
      { key: 'obj-flag-neutral', label: '⚑ Flag (Neutral)' },
      { key: 'obj-tower', label: '▲ Tower' },
      { key: 'obj-base-alliance', label: '⚑ Base (Alliance)' },
      { key: 'obj-base-horde', label: '⚑ Base (Horde)' },
      { key: 'obj-orb', label: '● Orb' },
      { key: 'obj-zone', label: '○ Zone' },
    ]
  },
};

export default function AddDialog({ position, mapPoint, onClose }: Props) {
  const { state, dispatch } = useBG();
  const [submenu, setSubmenu] = useState<SubMenuType | null>(null);
  const dlgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dlgRef.current && !dlgRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  const x = Math.round(mapPoint.x * 10) / 10;
  const y = Math.round(mapPoint.y * 10) / 10;

  const addMarker = (key: string) => {
    const parts = key.split('-');
    const type = parts[0]!;
    const sub = parts[1]!;
    const fac = parts[2] as Faction | undefined;
    const bgId = state.curBG;

    if (type === 'rte') {
      const color = key.substring(4);
      const name = prompt('Route name:', 'New Route');
      if (!name) { onClose(); return; }
      dispatch({ type: 'ADD_ROUTE', bgId, route: { n: name, pts: [[x, y], [Math.min(x + 15, 95), y]], c: color } });
      onClose();
      return;
    }

    if (type === 'gy') {
      const name = prompt('Graveyard name:', sub.charAt(0).toUpperCase() + sub.slice(1) + ' GY');
      if (!name) { onClose(); return; }
      dispatch({ type: 'ADD_MARKER', bgId, layer: 'graveyards', marker: { n: name, x, y, f: sub as Faction } });
    } else if (type === 'buf') {
      const name = prompt('Power-up name:', sub.charAt(0).toUpperCase() + sub.slice(1) + ' Buff');
      if (!name) { onClose(); return; }
      dispatch({ type: 'ADD_MARKER', bgId, layer: 'powerups', marker: { n: name, x, y, t: sub as PowerupType } });
    } else if (type === 'obj') {
      const name = prompt('Objective name:', 'New ' + sub.charAt(0).toUpperCase() + sub.slice(1));
      if (!name) { onClose(); return; }
      const obj = { n: name, x, y, t: sub as 'node' | 'flag' | 'tower' | 'base' | 'orb' | 'zone', ...(fac ? { f: fac } : {}) };
      dispatch({ type: 'ADD_MARKER', bgId, layer: 'objectives', marker: obj });
    }
    onClose();
  };

  return createPortal(
    <div
      ref={dlgRef}
      className="add-dlg"
      style={{ left: position.x, top: position.y, position: 'fixed' }}
    >
      {submenu ? (
        <>
          <div className="add-dlg-title">{SUBMENUS[submenu].title}</div>
          {SUBMENUS[submenu].items.map(item => (
            <button key={item.key} className="add-dlg-sub" onClick={() => addMarker(item.key)}>
              {item.label}
            </button>
          ))}
          <button className="add-dlg-sub add-dlg-back" onClick={() => setSubmenu(null)}>← Back</button>
        </>
      ) : (
        <>
          <div className="add-dlg-title">Add Marker at ({Math.round(mapPoint.x)}, {Math.round(mapPoint.y)})</div>
          <button className="add-dlg-btn" onClick={() => setSubmenu('gy')}>☩ Graveyard</button>
          <button className="add-dlg-btn" onClick={() => setSubmenu('buf')}>◆ Power-up</button>
          <button className="add-dlg-btn" onClick={() => setSubmenu('obj')}>★ Objective</button>
          <button className="add-dlg-btn" onClick={() => setSubmenu('rte')}>⟶ Route</button>
        </>
      )}
    </div>,
    document.body
  );
}
