"use client";

import type {StaffTicketOptions, CheckoutItem} from "@/types/pos";

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  drink: "Drinks",
  bundle: "Combo",
};

const CATEGORY_ORDER = ["food", "drink", "bundle"] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatQuantity(quantity: number) {
  return quantity > 1 ? `x${quantity}` : "x1";
}

export function openStaffTicketPrintWindow({
  ticketNumber,
  items,
}: StaffTicketOptions) {
  const grouped = new Map<string, CheckoutItem[]>();

  for (const item of items) {
    const category = item.menu?.category || item.category || "food";
    const current = grouped.get(category) ?? [];
    current.push(item);
    grouped.set(category, current);
  }

  const sections = CATEGORY_ORDER.filter((category) => {
    const list = grouped.get(category);
    return !!list && list.length > 0;
  });

  const sectionHtml = sections
    .map((category) => {
      const label = CATEGORY_LABELS[category] ?? category;
      const categoryItems = grouped.get(category) ?? [];

      const rows = categoryItems
        .map((item) => {
          const name = item.menu?.name ?? item.name ?? "Item";

          return `
            <div class="item-row">
              <div class="item-qty">${formatQuantity(item.quantity)}</div>
              <div class="item-name">${escapeHtml(name)}</div>
            </div>
          `;
        })
        .join("");

      return `
        <section class="section">
          <div class="section-title">${escapeHtml(label)}</div>
          <div class="section-items">
            ${rows}
          </div>
        </section>
      `;
    })
    .join("");

  const html = `
    <div class="ticket">
      <div class="ticket-number">#${escapeHtml(ticketNumber)}</div>
      ${sectionHtml}
    </div>
  `;

  const printWindow = window.open("", "_blank", "width=320,height=700");

  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ticket #${escapeHtml(ticketNumber)}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 4mm;
          }

          html,
          body {
            padding: 0;
            margin: 0;
            background: #fff;
            color: #000;
            font-family: Arial, Helvetica, sans-serif;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 12px;
            line-height: 1.25;
          }

          .ticket {
            width: 100%;
          }

          .ticket-number {
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }

          .section {
            padding-top: 8px;
            margin-top: 8px;
            border-top: 1px dashed #000;
          }

          .section:first-of-type {
            border-top: 0;
            padding-top: 0;
            margin-top: 0;
          }

          .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 6px;
          }

          .section-items {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .item-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }

          .item-qty {
            min-width: 28px;
            flex-shrink: 0;
            font-weight: 700;
          }

          .item-name {
            flex: 1;
            min-width: 0;
            word-break: break-word;
          }
        </style>
      </head>
      <body>
        ${html}
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