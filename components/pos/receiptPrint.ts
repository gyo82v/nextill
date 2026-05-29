"use client";

import type { CheckoutItem } from "@/firebase/checkout";
import { formatMoney } from "@/lib/money";

type ReceiptOptions = {
  items: CheckoutItem[];
  totalMinor: number;
  currency: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function openReceiptPrintWindow({
  items,
  totalMinor,
  currency,
}: ReceiptOptions) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const now = new Date().toLocaleString();

  const rows = items
    .map((item) => {
      const name = item.menu?.name ?? item.name ?? "Item";
      const lineTotal = item.quantity * item.priceMinor;

      return `
        <tr>
          <td style="padding:6px 0; vertical-align:top;">
            <div style="font-weight:600;">${escapeHtml(name)}</div>
            <div style="font-size:12px; color:#555;">
              ${item.quantity} × ${formatMoney(item.priceMinor, currency)}
            </div>
          </td>
          <td style="padding:6px 0; vertical-align:top; text-align:right; white-space:nowrap;">
            ${formatMoney(lineTotal, currency)}
          </td>
        </tr>
      `;
    })
    .join("");

  const printWindow = window.open("", "_blank", "width=420,height=700");

  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Receipt</title>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111;
          }

          h1 {
            font-size: 20px;
            margin: 0 0 6px;
          }

          .meta {
            font-size: 12px;
            color: #555;
            margin-bottom: 16px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }

          .total {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <h1>Receipt</h1>
        <div class="meta">
          <div>Date: ${escapeHtml(now)}</div>
          <div>Items: ${totalItems}</div>
        </div>

        <table>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total">
          <span>Total</span>
          <span>${formatMoney(totalMinor, currency)}</span>
        </div>

        <script>
          window.onload = function () {
            window.focus();
            window.print();
            window.onafterprint = function () {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}