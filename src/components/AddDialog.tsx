import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBG } from '../context/BattlegroundContext';
import type { MapPoint, Faction, PowerupType } from '../types';
import { ROUTE_ORANGE, ROUTE_YELLOW, ROUTE_GREEN, ROUTE_CYAN, ROUTE_PURPLE, ROUTE_PINK } from '../utils/constants';

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
    title: 'Route Style',
    items: [
      { key: `rte-${ROUTE_ORANGE}`, label: '● Orange' },
      { key: `rte-${ROUTE_YELLOW}`, label: '● Yellow' },
      { key: `rte-${ROUTE_GREEN}`, label: '● Green' },
      { key: `rte-${ROUTE_CYAN}`, label: '● Cyan' },
      { key: `rte-${ROUTE_PURPLE}`, label: '● Purple' },
      { key: `rte-${ROUTE_PINK}`, label: '● Pink' },
      { key: `rte-${ROUTE_ORANGE}-d`, label: '◌ Orange (Dotted)' },
      { key: `rte-${ROUTE_YELLOW}-d`, label: '◌ Yellow (Dotted)' },
      { key: `rte-${ROUTE_GREEN}-d`, label: '◌ Green (Dotted)' },
      { key: `rte-${ROUTE_CYAN}-d`, label: '◌ Cyan (Dotted)' },
      { key: `rte-${ROUTE_PURPLE}-d`, label: '◌ Purple (Dotted)' },
      { key: `rte-${ROUTE_PINK}-d`, label: '◌ Pink (Dotted)' },
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
      const rteParts = key.substring(4);
      const dotted = rteParts.endsWith('-d');
      const color = dotted ? rteParts.slice(0, -2) : rteParts;
      const name = prompt('Route name:', 'New Route');
      if (!name) { onClose(); return; }
      dispatch({ type: 'ADD_ROUTE', bgId, route: { n: name, pts: [[x, y], [Math.min(x + 15, 95), y]], c: color, ...(dotted ? { d: true } : {}) } });
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

  const btnClass = "block w-full py-1.5 px-2.5 bg-transparent border border-[var(--border-default)] rounded text-[var(--text-primary)] cursor-pointer text-left mb-[3px] transition-all duration-[120ms] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-accent)]";
  const subClass = "block w-full py-[5px] px-2.5 bg-transparent border border-[var(--border-default)] rounded text-[var(--text-secondary)] cursor-pointer text-left mb-0.5 transition-all duration-[120ms] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)]";

  return createPortal(
    <div
      ref={dlgRef}
      className="fixed z-[100] bg-[var(--dlg-bg)] border border-[var(--dlg-border)] rounded-md p-2 min-w-[160px] shadow-[0_4px_20px_#0004]"
      style={{ left: position.x, top: position.y }}
    >
      {submenu ? (
        <>
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-[.5px] mb-1.5">{SUBMENUS[submenu].title}</div>
          {SUBMENUS[submenu].items.map(item => (
            <button key={item.key} className={subClass} onClick={() => addMarker(item.key)}>
              {item.label}
            </button>
          ))}
          <button className={`${subClass} text-[#6699cc] border-[#3a5a8a] hover:bg-[#0f1e3544]`} onClick={() => setSubmenu(null)}>← Back</button>
        </>
      ) : (
        <>
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-[.5px] mb-1.5">Add Marker at ({Math.round(mapPoint.x)}, {Math.round(mapPoint.y)})</div>
          <button className={btnClass} onClick={() => setSubmenu('gy')}>☩ Graveyard</button>
          <button className={btnClass} onClick={() => setSubmenu('buf')}>◆ Power-up</button>
          <button className={btnClass} onClick={() => setSubmenu('obj')}>★ Objective</button>
          <button className={btnClass} onClick={() => setSubmenu('rte')}>⟶ Route</button>
        </>
      )}
    </div>,
    document.body
  );
}
