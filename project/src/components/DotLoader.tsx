export function DotLoader() {
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <span className="w-3 h-3 bg-primary shadow-xl shadow-secondary-light rounded-full dot-loader-bounce [animation-delay:-0.3s]" />
      <span className="w-3 h-3 bg-primary shadow-xl shadow-secondary-light rounded-full dot-loader-bounce [animation-delay:-0.15s]" />
      <span className="w-3 h-3 bg-primary shadow-xl shadow-secondary-light rounded-full dot-loader-bounce" />
    </div>
  );
}