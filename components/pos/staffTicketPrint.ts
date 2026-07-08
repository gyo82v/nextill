"use client";

import i18n from "@/i18n";
import type { StaffTicketOptions, CheckoutItem } from "@/types/pos";


function tPos(key: string, options?: Record<string, unknown>) {
  return i18n.getFixedT(i18n.language, "pos")(key, options);
}

const CATEGORY_ORDER = ["food", "bundle", "dessert", "drink"] as const;

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

function getCategoryLabel(category: string) {
  return tPos(`ticket.categories.${category}`, {
    defaultValue: category,
  });
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
    .map((category, index) => {
      const label = getCategoryLabel(category);
      const categoryItems = grouped.get(category) ?? [];

      const rows = categoryItems
        .map((item) => {
          const name =
            item.menu?.name ?? item.name ?? tPos("ticket.fallbackItem");

          return `
            <div class="item-row">
              <div class="item-qty">${formatQuantity(item.quantity)}</div>
              <div class="item-name">${escapeHtml(name)}</div>
            </div>
          `;
        })
        .join("");

      const divider =
        index === 0
          ? ""
          : `
            <div class="section-divider" aria-hidden="true">
              <span class="divider-icon">✂</span>
              <span class="divider-line"></span>
              <span class="divider-icon">✂</span>
            </div>
          `;

      return `
        <section class="section">
          ${divider}
          <div class="section-content">
            <div class="section-title">${escapeHtml(label)}</div>
            <div class="section-items">
              ${rows}
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  const ticketTitle = `${ticketNumber}`;

  const html = `
    <div class="ticket">
      <div class="ticket-number">${escapeHtml(ticketTitle)}</div>
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
        <title>${escapeHtml(ticketTitle)}</title>
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
            font-size: 22px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 14px;
            letter-spacing: 1px;
          }

          .section {
            margin-top: 30px;
            padding-top: 18px;
          }

          .section:first-of-type {
            margin-top: 0;
            padding-top: 0;
          }

          .section-divider {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            min-height: 18px;
          }

          .divider-line {
            flex: 1;
            border-top: 2px dashed #000;
          }

          .divider-icon {
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
          }

          .section-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 56px;
          }

          .section-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }

          .section-items {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .item-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .item-qty {
            min-width: 32px;
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



/*

"use client";

import i18n from "@/i18n";
import type { StaffTicketOptions, CheckoutItem } from "@/types/pos";


function tPos(key: string, options?: Record<string, unknown>) {
  return i18n.getFixedT(i18n.language, "pos")(key, options);
}

const CATEGORY_ORDER = ["food", "bundle", "dessert", "drink"] as const;

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

function getCategoryLabel(category: string) {
  return tPos(`ticket.categories.${category}`, {
    defaultValue: category,
  });
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
    .map((category, index) => {
      const label = getCategoryLabel(category);
      const categoryItems = grouped.get(category) ?? [];

      const rows = categoryItems
        .map((item) => {
          const name =
            item.menu?.name ?? item.name ?? tPos("ticket.fallbackItem");

          return `
            <div class="item-row">
              <div class="item-qty">${formatQuantity(item.quantity)}</div>
              <div class="item-name">${escapeHtml(name)}</div>
            </div>
          `;
        })
        .join("");

      const divider =
        index === 0
          ? ""
          : `
            <div class="section-divider" aria-hidden="true">
              <span class="divider-icon">✂</span>
              <span class="divider-line"></span>
              <span class="divider-icon">✂</span>
            </div>
          `;

      return `
        <section class="section">
          ${divider}
          <div class="section-content">
            <div class="section-title">${escapeHtml(label)}</div>
            <div class="section-items">
              ${rows}
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  const ticketTitle = `${ticketNumber}`;

  const html = `
    <div class="ticket">
      <div class="ticket-number">${escapeHtml(ticketTitle)}</div>
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
        <title>${escapeHtml(ticketTitle)}</title>
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
            font-size: 22px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 14px;
            letter-spacing: 1px;
          }

          .section {
            margin-top: 30px;
            padding-top: 18px;
          }

          .section:first-of-type {
            margin-top: 0;
            padding-top: 0;
          }

          .section-divider {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            min-height: 18px;
          }

          .divider-line {
            flex: 1;
            border-top: 2px dashed #000;
          }

          .divider-icon {
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
          }

          .section-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 56px;
          }

          .section-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }

          .section-items {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .item-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .item-qty {
            min-width: 32px;
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


*/