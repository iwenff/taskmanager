export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`border rounded shadow p-4 ${className}`}>{children}</div>;
  }
  