import React from "react";
import "./InvoicePreview.css";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);

const fmtDate = (d) =>
  new Date(d || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// Exact CSS mirroring InvoicePreview.css — CSS vars resolved, no external deps needed
const PRINT_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  /* Force background colors/images to print without needing the browser toggle */
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
  body{font-family:'Poppins','Segoe UI',Arial,sans-serif;font-size:0.88rem;color:#1e293b;background:#fff}
  .inv-document{width:210mm;min-height:297mm;background:#fff;padding:14mm 14mm 12mm;box-sizing:border-box}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem}
  .inv-logo-wrap{flex:1}
  .inv-logo{height:64px;width:auto;object-fit:contain;display:block}
  .inv-header-right{text-align:right}
  .inv-title-text{font-size:2.2rem;font-weight:800;letter-spacing:0.12em;color:#0f172a;margin:0 0 0.5rem;line-height:1}
  .inv-meta-table{border-collapse:collapse;margin-left:auto}
  .inv-meta-label{font-size:0.78rem;color:#64748b;font-weight:500;padding:0.15rem 0.5rem 0.15rem 0;text-align:right}
  .inv-meta-value{font-size:0.85rem;font-weight:700;color:#0f172a;padding:0.15rem 0;text-align:left;min-width:120px}
  .inv-divider{display:block;border:none;border-top:2px solid #0047ab;margin:1rem 0}
  .inv-bill-section{margin-bottom:1.5rem}
  .inv-section-label{font-size:0.72rem;font-weight:700;letter-spacing:0.1em;color:#0047ab;text-transform:uppercase;margin:0 0 0.4rem;display:block}
  .inv-customer-name{font-size:1rem;font-weight:700;color:#0f172a;margin:0 0 0.2rem}
  .inv-customer-address{font-size:0.84rem;color:#334155;margin:0 0 0.2rem;line-height:1.5;white-space:pre-line}
  .inv-customer-phone{font-size:0.84rem;color:#475569;margin:0}
  .inv-services-table{width:100%;border-collapse:collapse;margin-bottom:0}
  .inv-services-table thead tr{background:#0047ab;color:#fff}
  .inv-services-table th{padding:0.65rem 0.75rem;font-size:0.78rem;background-color:#0047ab;color:#fff;font-weight:700;letter-spacing:0.04em;text-transform:uppercase}
  .inv-th-no{width:6%;text-align:center}
  .inv-th-desc{width:46%;text-align:left}
  .inv-th-price{width:16%;text-align:right}
  .inv-th-qty{width:10%;text-align:center}
  .inv-th-total{width:22%;text-align:right}
  .inv-services-table tbody tr{border-bottom:1px solid #e2e8f0}
  .inv-services-table tbody td{padding:0.7rem 0.75rem;font-size:0.86rem;color:#334155;vertical-align:middle}
  .inv-td-center{text-align:center}
  .inv-td-right{text-align:right;font-weight:600}
  .inv-empty-row td{padding:0.5rem 0.75rem;border-bottom:1px solid #f1f5f9}
  .inv-summary-wrap{display:flex;justify-content:flex-end;margin:0.25rem 0 1rem}
  .inv-summary-table{border-collapse:collapse;min-width:260px}
  .inv-sum-label{font-size:0.84rem;font-weight:500;color:#475569;padding:0.4rem 1.25rem 0.4rem 0}
  .inv-sum-value{font-size:0.88rem;font-weight:600;color:#0f172a;text-align:right;padding:0.4rem 0;min-width:110px}
  .inv-sum-value.paid{color:#16a34a}
  .inv-sum-due-row{border-top:2px solid #0047ab}
  .inv-sum-due-row .due-label{font-weight:700;color:#0f172a;padding-top:0.55rem}
  .inv-sum-due-row .due-value{font-size:1rem;font-weight:800;color:#dc2626;padding-top:0.55rem}
  .inv-bottom-sections{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1rem 0}
  .inv-terms p,.inv-payment-method p{font-size:0.82rem;color:#475569;margin:0.2rem 0;line-height:1.55}
  .inv-pm-key{font-weight:700;color:#1e293b;display:inline-block;min-width:100px}
  .inv-footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:1.25rem}
  .inv-thankyou{font-size:0.9rem;font-weight:800;letter-spacing:0.08em;color:#0047ab;text-transform:uppercase;margin:0 0 0.5rem}
  .inv-company-details p{font-size:0.78rem;color:#64748b;margin:0.1rem 0}
  .inv-footer-right{text-align:right}
  .inv-signature{height:56px;width:auto;object-fit:contain;display:block;margin-left:auto;margin-bottom:0.25rem}
  .inv-signatory-name{font-size:0.84rem;font-weight:700;color:#0f172a;margin:0}
  .inv-signatory-title{font-size:0.78rem;color:#64748b;margin:0}
  @page{size:A4 portrait;margin:8mm}
`;

const InvoicePreview = ({ invoice, onClose }) => {
  const total = Number(invoice.totalAmount || 0);
  const paid = Number(invoice.paidAmount || 0);
  const due = Number(invoice.dueAmount ?? total - paid);
  const serviceLabel =
    invoice.serviceDescription ||
    [invoice.mainCategory, invoice.subCategory].filter(Boolean).join(" — ") ||
    "Financial Consulting Services";

  const handleDownload = () => {
    const origin = window.location.origin;
    const logoSrc = `${origin}/invlogo.jpeg`;
    const signSrc = `${origin}/sign-invoice.png`;

    // ── Shared inline style strings (derived from InvoicePreview.css) ──────────
    const S = {
      body:       "box-sizing:border-box;margin:0;padding:0;font-family:'Poppins','Segoe UI',Arial,sans-serif;font-size:0.88rem;color:#1e293b;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact",
      doc:        "box-sizing:border-box;width:210mm;min-height:297mm;background:#fff;padding:14mm 14mm 12mm",
      hdr:        "display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem",
      logoWrap:   "flex:1",
      logo:       "height:10rem;width:auto;object-fit:contain;display:block",
      hdrRight:   "text-align:right",
      title:      "font-size:3.5rem;font-weight:800;letter-spacing:0;color:#0047ab;margin:0 0 0.5rem;line-height:1",
      metaTable:  "border-collapse:collapse;margin-left:auto;text-align:start",
      metaLabel:  "font-size:0.78rem;color:#64748b;font-weight:500;padding:0.67em;text-align:left",
      metaValue:  "font-size:0.85rem;font-weight:700;color:#0f172a;padding:0.67em;text-align:left;min-width:120px",
      divider:    "display:block;border:none;border-top:2px solid #0047ab;margin:1rem 0",
      billSec:    "margin-bottom:1.5rem",
      secLabel:   "display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;color:#0047ab;text-transform:uppercase;margin:0 0 0.4rem",
      custName:   "font-size:1rem;font-weight:700;color:#0f172a;margin:0 0 0.2rem",
      custAddr:   "font-size:0.84rem;color:#334155;margin:0 0 0.2rem;line-height:1.5;white-space:pre-line",
      custPhone:  "font-size:0.84rem;color:#475569;margin:0",
      svcTable:   "width:100%;border-collapse:collapse;margin-bottom:0",
      svcThead:   "background:#0047ab;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact",
      svcTh:      "padding:0.65rem 0.75rem;font-size:0.78rem;background-color:#0047ab;color:#fff;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;-webkit-print-color-adjust:exact;print-color-adjust:exact",
      thNo:       "width:6%;text-align:center",
      thDesc:     "width:46%;text-align:left",
      thPrice:    "width:16%;text-align:right",
      thQty:      "width:10%;text-align:center",
      thTotal:    "width:22%;text-align:right",
      svcTbodyTr: "border-bottom:1px solid #e2e8f0",
      svcTd:      "padding:0.7rem 0.75rem;font-size:0.86rem;color:#334155;vertical-align:middle",
      tdCenter:   "text-align:center;padding:0.7rem 0.75rem;font-size:0.86rem;color:#334155;vertical-align:middle",
      tdRight:    "text-align:right;font-weight:600;padding:0.7rem 0.75rem;font-size:0.86rem;color:#334155;vertical-align:middle",
      emptyTd:    "padding:0.5rem 0.75rem;border-bottom:1px solid #f1f5f9",
      sumWrap:    "display:flex;justify-content:flex-end;margin:0.25rem 0 1rem",
      sumTable:   "border-collapse:collapse;min-width:260px",
      sumLabel:   "font-size:0.84rem;font-weight:500;color:#475569;padding:1.67%",
      sumValue:   "font-size:0.88rem;font-weight:600;color:#0f172a;text-align:right;padding:1.67%;min-width:110px",
      sumPaid:    "font-size:0.88rem;font-weight:600;color:#16a34a;text-align:right;padding:1.67%;min-width:110px",
      dueRow:     "border-top:2px solid #0047ab",
      dueLabel:   "font-weight:700;color:#0f172a;padding-top:0.55rem;font-size:0.84rem",
      dueValue:   "font-size:1rem;font-weight:800;color:#dc2626;text-align:right;padding-top:0.55rem;min-width:110px",
      btmSecs:    "display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1rem 0",
      termsP:     "font-size:0.82rem;color:#475569;margin:0.2rem 0;line-height:1.55",
      pmKey:      "font-weight:700;color:#1e293b;display:inline-block;min-width:100px",
      footer:     "display:flex;justify-content:space-between;align-items:flex-end;margin-top:1.25rem",
      thankYou:   "font-size:0.9rem;font-weight:800;letter-spacing:0.08em;color:#0047ab;text-transform:uppercase;margin:0 0 0.5rem",
      coP:        "font-size:0.78rem;color:#64748b;margin:0.1rem 0",
      ftrRight:   "text-align:right",
      sig:        "height:56px;width:auto;object-fit:contain;display:block;margin-left:auto;margin-bottom:0.25rem",
      sigName:    "font-size:0.84rem;font-weight:700;color:#0f172a;margin:0",
      sigTitle:   "font-size:0.78rem;color:#64748b;margin:0",
    };

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Invoice-${invoice.invoiceId || "BB"}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0} @page{size:A4 portrait;margin:8mm}</style>
</head>
<body style="${S.body}">
<div style="${S.doc}">

  <!-- Header -->
  <div style="${S.hdr}">
    <div style="${S.logoWrap}"><img src="${logoSrc}" style="${S.logo}" alt="BanksBuddy"/></div>
    <div style="${S.hdrRight}">
      <h1 style="${S.title}">INVOICE</h1>
      <table style="${S.metaTable}"><tbody>
        <tr><td style="${S.metaLabel}">Invoice No.</td><td style="${S.metaValue}">${invoice.invoiceId || "—"}</td></tr>
        <tr><td style="${S.metaLabel}">Date</td><td style="${S.metaValue}">${fmtDate(invoice.invoiceDate)}</td></tr>
      </tbody></table>
    </div>
  </div>

  <!-- Divider -->
  <hr style="${S.divider}"/>

  <!-- Bill To -->
  <div style="${S.billSec}">
    <span style="${S.secLabel}">BILL TO</span>
    <p style="${S.custName}">${invoice.customerName || "—"}</p>
    ${invoice.billingAddress ? `<p style="${S.custAddr}">${invoice.billingAddress}</p>` : ""}
    <p style="${S.custPhone}">${invoice.customerPhone || ""}</p>
  </div>

  <!-- Services Table -->
  <table style="${S.svcTable}">
    <thead><tr style="${S.svcThead}">
      <th style="${S.svcTh};${S.thNo}">No.</th>
      <th style="${S.svcTh};${S.thDesc}">Description of Services</th>
      <th style="${S.svcTh};${S.thPrice}">Price</th>
      <th style="${S.svcTh};${S.thQty}">Qty</th>
      <th style="${S.svcTh};${S.thTotal}">Total</th>
    </tr></thead>
    <tbody>
      <tr style="${S.svcTbodyTr}">
        <td style="${S.tdCenter}">1</td>
        <td style="${S.svcTd}">${serviceLabel}</td>
        <td style="${S.tdRight}">${fmt(total)}</td>
        <td style="${S.tdCenter}">1</td>
        <td style="${S.tdRight}">${fmt(total)}</td>
      </tr>
      <tr><td colspan="5" style="${S.emptyTd}">&nbsp;</td></tr>
      <tr><td colspan="5" style="${S.emptyTd}">&nbsp;</td></tr>
    </tbody>
  </table>

  <!-- Summary -->
  <div style="${S.sumWrap}">
    <table style="${S.sumTable}"><tbody>
      <tr><td style="${S.sumLabel}">Sub Total</td><td style="${S.sumValue}">${fmt(total)}</td></tr>
      <tr><td style="${S.sumLabel}">Paid Amount</td><td style="${S.sumPaid}">${fmt(paid)}</td></tr>
      <tr style="${S.dueRow}">
        <td style="${S.dueLabel}">Due Amount</td>
        <td style="${S.dueValue}">${fmt(due)}</td>
      </tr>
    </tbody></table>
  </div>

  <!-- Divider -->
  <hr style="${S.divider}"/>

  <!-- Terms + Payment -->
  <div style="${S.btmSecs}">
    <div>
      <span style="${S.secLabel}">TERMS AND CONDITIONS</span>
      <p style="${S.termsP}">This receipt confirms both service and payment acknowledgement.</p>
      <p style="${S.termsP}">Please make the payment to the account below.</p>
      <p style="${S.termsP}">We accept bank transfer, credit card, or cheque.</p>
    </div>
    <div>
      <span style="${S.secLabel}">PAYMENT METHOD</span>
      <p style="${S.termsP}"><span style="${S.pmKey}">Bank</span> Axis Bank</p>
      <p style="${S.termsP}"><span style="${S.pmKey}">Account Name</span> Ashwin Kumar Singh</p>
      <p style="${S.termsP}"><span style="${S.pmKey}">Account No.</span> 921010041248628</p>
    </div>
  </div>

  <!-- Divider -->
  <hr style="${S.divider}"/>

  <!-- Footer -->
  <div style="${S.footer}">
    <div>
      <p style="${S.thankYou}">THANK YOU FOR YOUR BUSINESS</p>
      <p style="${S.coP}">Western Business Centre, Residency Area, Indore MP - 452001</p>
      <p style="${S.coP}">+91-6377956633 &nbsp;|&nbsp; www.banksbuddy.in</p>
    </div>
    <div style="${S.ftrRight}">
      <img src="${signSrc}" style="${S.sig}" alt="Signature"/>
      <p style="${S.sigName}">Ashwin Kumar Singh</p>
      <p style="${S.sigTitle}">CEO &amp; Founder</p>
    </div>
  </div>

</div>
</body></html>`;


    // Hidden iframe — sized to A4 so layout renders correctly, then prints
    const iframe = document.createElement("iframe");
    // Give it real A4 pixel dimensions (96dpi: 210mm ≈ 794px, 297mm ≈ 1123px)
    iframe.style.cssText = [
      "position:fixed",
      "top:-9999px",
      "left:-9999px",
      "width:794px",
      "height:1123px",
      "border:0",
      "opacity:0",
      "pointer-events:none",
    ].join(";");
    document.body.appendChild(iframe);

    const iDoc = iframe.contentWindow.document;
    iDoc.open();
    iDoc.write(html);
    iDoc.close();

    const doPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error("Print error:", e);
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      }, 2000);
    };

    const imgs = iDoc.images;
    if (!imgs || imgs.length === 0) { setTimeout(doPrint, 500); return; }

    let loaded = 0;
    const onDone = () => { loaded++; if (loaded >= imgs.length) setTimeout(doPrint, 300); };
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].complete) onDone();
      else { imgs[i].onload = onDone; imgs[i].onerror = onDone; }
    }
  };

  return (
    <div className="inv-overlay" onClick={onClose}>
      <div className="inv-action-bar no-print" onClick={(e) => e.stopPropagation()}>
        <button className="inv-close-btn" onClick={onClose}>
          <span>✕</span> Close
        </button>
        <div className="inv-action-right">
          <button className="inv-pdf-btn" onClick={handleDownload}>
            ⬇&nbsp;Download PDF
          </button>
        </div>
      </div>

      <div className="inv-document" id="invoice-print-area" onClick={(e) => e.stopPropagation()}>
        <div className="inv-header">
          <div className="inv-logo-wrap">
            <img src="/invlogo.jpeg" alt="BanksBuddy" className="inv-logo" />
          </div>
          <div className="inv-header-right">
            <h1 className="inv-title-text">INVOICE</h1>
            <table className="inv-meta-table">
              <tbody>
                <tr>
                  <td className="inv-meta-label">Invoice No.</td>
                  <td className="inv-meta-value">{invoice.invoiceId || "—"}</td>
                </tr>
                <tr>
                  <td className="inv-meta-label">Date</td>
                  <td className="inv-meta-value">{fmtDate(invoice.invoiceDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="inv-divider" />

        <div className="inv-bill-section">
          <div className="inv-bill-to">
            <p className="inv-section-label">BILL TO</p>
            <p className="inv-customer-name">{invoice.customerName || "—"}</p>
            {invoice.billingAddress && (
              <p className="inv-customer-address">{invoice.billingAddress}</p>
            )}
            <p className="inv-customer-phone">{invoice.customerPhone || ""}</p>
          </div>
        </div>

        <table className="inv-services-table">
          <thead>
            <tr>
              <th className="inv-th-no">No.</th>
              <th className="inv-th-desc">Description of Services</th>
              <th className="inv-th-price">Price</th>
              <th className="inv-th-qty">Qty</th>
              <th className="inv-th-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="inv-td-center">1</td>
              <td>{serviceLabel}</td>
              <td className="inv-td-right">{fmt(total)}</td>
              <td className="inv-td-center">1</td>
              <td className="inv-td-right">{fmt(total)}</td>
            </tr>
            <tr className="inv-empty-row"><td colSpan="5">&nbsp;</td></tr>
            <tr className="inv-empty-row"><td colSpan="5">&nbsp;</td></tr>
          </tbody>
        </table>

        <div className="inv-summary-wrap">
          <table className="inv-summary-table">
            <tbody>
              <tr>
                <td className="inv-sum-label">Sub Total</td>
                <td className="inv-sum-value">{fmt(total)}</td>
              </tr>
              <tr>
                <td className="inv-sum-label">Paid Amount</td>
                <td className="inv-sum-value paid">{fmt(paid)}</td>
              </tr>
              <tr className="inv-sum-due-row">
                <td className="inv-sum-label due-label">Due Amount</td>
                <td className="inv-sum-value due-value">{fmt(due)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="inv-divider" />

        <div className="inv-bottom-sections">
          <div className="inv-terms">
            <p className="inv-section-label">TERMS AND CONDITIONS</p>
            <p>This receipt confirms both service and payment acknowledgement.</p>
            <p>Please make the payment to the account below.</p>
            <p>We accept bank transfer, credit card, or cheque.</p>
          </div>
          <div className="inv-payment-method">
            <p className="inv-section-label">PAYMENT METHOD</p>
            <p><span className="inv-pm-key">Bank</span> Axis Bank</p>
            <p><span className="inv-pm-key">Account Name</span> Ashwin Kumar Singh</p>
            <p><span className="inv-pm-key">Account No.</span> 921010041248628</p>
          </div>
        </div>

        <div className="inv-divider" />

        <div className="inv-footer">
          <div className="inv-footer-left">
            <p className="inv-thankyou">THANK YOU FOR YOUR BUSINESS</p>
            <div className="inv-company-details">
              <p>Western Business Centre, Residency Area, Indore MP - 452001</p>
              <p>+91-6377956633 &nbsp;|&nbsp; www.banksbuddy.in</p>
            </div>
          </div>
          <div className="inv-footer-right">
            <img src="/sign-invoice.png" alt="Signature" className="inv-signature" />
            <p className="inv-signatory-name">Ashwin Kumar Singh</p>
            <p className="inv-signatory-title">CEO &amp; Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
