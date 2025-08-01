import { DotLoader } from './DotLoader';

function OverlayLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <DotLoader />
    </div>
  );
}

export default OverlayLoader