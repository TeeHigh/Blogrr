import { DotLoader } from "./DotLoader";


export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-blue-600 text-lg font-semibold animate-pulse auth-page-background">
      <img src="/assets/logos/BlueOnTransparent-FULL.png" alt="Blogrr Logo" width={400} />
      <DotLoader />
    </div>
  );
}