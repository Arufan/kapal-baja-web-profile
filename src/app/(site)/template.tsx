export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="route-stage">
      <div className="route-bearing" aria-hidden="true"><span /><i /></div>
      <div className="route-stage__content">{children}</div>
    </div>
  );
}
