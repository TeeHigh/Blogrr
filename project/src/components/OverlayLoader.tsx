import { DotLoader } from './DotLoader';

function OverlayLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center">
      <DotLoader />
    </div>
  );
}

export default OverlayLoader