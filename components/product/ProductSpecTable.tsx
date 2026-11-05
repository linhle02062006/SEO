import type { SpecItem } from "@/types";

export function ProductSpecTable({ specs }: { specs: SpecItem[] }) {
  if (!specs.length) return null;

  return (
    <div className="mt-4 max-w-3xl overflow-hidden rounded-xl border border-ink-200">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Bảng thông số kỹ thuật sản phẩm</caption>
        <tbody>
          {specs.map((s, i) => (
            <tr key={s.label} className={i % 2 === 0 ? "bg-ink-50" : "bg-white"}>
              <th
                scope="row"
                className="w-2/5 border-b border-ink-100 px-4 py-3 font-medium text-ink-700"
              >
                {s.label}
              </th>
              <td className="border-b border-ink-100 px-4 py-3 text-ink-900">
                {s.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
