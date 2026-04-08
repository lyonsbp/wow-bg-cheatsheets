import { useBG } from '../context/BattlegroundContext';

export default function LayerBar() {
  const { state, dispatch } = useBG();
  const { layers, editMode, squigglyMode } = state;

  return (
    <div className="layer-bar">
      <span className="layer-lbl">Layers:</span>
      <span
        className={`ltog gy${layers.gy ? ' on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'gy' })}
      >
        <span className="ldot"></span>Graveyards
      </span>
      <span
        className={`ltog buf${layers.buf ? ' on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'buf' })}
      >
        <span className="ldot"></span>Power-ups
      </span>
      <span
        className={`ltog rte${layers.rte ? ' on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'rte' })}
      >
        <span className="ldot"></span>Routes
      </span>
      <span
        className={`ltog rte${squigglyMode ? ' on' : ''}`}
        title="MS Paint style routes"
        onClick={() => dispatch({ type: 'TOGGLE_SQUIGGLY' })}
      >
        <span className="ldot"></span>Squiggly
      </span>
      <span
        className={`ltog obj${layers.obj ? ' on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', key: 'obj' })}
      >
        <span className="ldot"></span>Objectives
      </span>
      <span style={{ marginLeft: 'auto' }}></span>
      <span
        className={`ltog edt${editMode ? ' on' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_EDIT' })}
      >
        <span className="ldot"></span>Edit Mode
      </span>
    </div>
  );
}
