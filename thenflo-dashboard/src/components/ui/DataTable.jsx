import React from "react";

/**
 * Generic table shell. `columns` is [{ key, header, render?, className? }].
 * `rows` is an array of records; `rowKey` extracts a unique key.
 * Pass onRowClick to make rows interactive.
 */
export default function DataTable({ columns, rows, rowKey, onRowClick }) {
  return (
    <div className="tf-scroll overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-5 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink3"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-line ${onRowClick ? "cursor-pointer hover:bg-surfaceHover" : ""}`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-3 ${c.className || ""}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
