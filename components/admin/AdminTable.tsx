export function AdminTable({
  head,
  children,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>{head}</tr>
          </thead>
          <tbody className="divide-y divide-ink-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
