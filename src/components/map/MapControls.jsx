const btnClass = "w-8 h-8 rounded-md bg-bg/90 border border-border-light text-text-muted text-base cursor-pointer flex items-center justify-center font-mono backdrop-blur-sm hover:text-white transition-colors";

export default function MapControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute bottom-3 right-3 flex flex-col gap-1">
      <button onClick={onZoomIn} className={btnClass}>+</button>
      <button onClick={onZoomOut} className={btnClass}>{'\u2212'}</button>
      <button onClick={onReset} className={btnClass}>{'\u2302'}</button>
    </div>
  );
}
