// Add dynamic item rows, handle form submission, and display receipt

document.addEventListener('DOMContentLoaded', function() {
    const itemsList = document.getElementById('items-list');
    const addItemBtn = document.getElementById('add-item');
    const form = document.getElementById('receipt-form');
    const receiptOutput = document.getElementById('receipt-output');

    function createItemRow() {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <input type="text" placeholder="Item Name" class="item-name" required>
            <input type="number" placeholder="Quantity" class="item-qty" min="1" value="1" required>
            <input type="number" placeholder="Price per unit" class="item-price" min="0.01" step="0.01" required>
            <button type="button" class="remove-item">&times;</button>
        `;
        row.querySelector('.remove-item').onclick = () => row.remove();
        return row;
    }

    addItemBtn.onclick = function() {
        itemsList.appendChild(createItemRow());
    };

    // Add one item row by default
    addItemBtn.click();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Gather data
        const customer = {
            name: document.getElementById('customer-name').value,
            contact: document.getElementById('customer-contact').value
        };
        const items = Array.from(itemsList.querySelectorAll('.item-row')).map(row => ({
            name: row.querySelector('.item-name').value,
            quantity: parseInt(row.querySelector('.item-qty').value),
            price: parseFloat(row.querySelector('.item-price').value)
        }));
        const discountCode = document.getElementById('discount-code').value;
        fetch('http://localhost:5000/api/receipts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer, items, discount_code: discountCode })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (ok) {
                renderReceipt(data.receipt);
            } else {
                receiptOutput.innerHTML = `<div style="color:red;">${data.error || 'Error generating receipt.'}</div>`;
            }
        })
        .catch(err => {
            receiptOutput.innerHTML = `<div style="color:red;">Network error.</div>`;
        });
        return false;
    });

    // Export as PDF
    function exportReceiptAsPDF(receipt) {
        if (typeof window.jspdf === 'undefined') {
            alert('jsPDF library not loaded.');
            return;
        }
        const doc = new window.jspdf.jsPDF();
        let y = 10;
        doc.setFontSize(16);
        doc.text(`Receipt #${receipt.id}`, 10, y);
        y += 10;
        doc.setFontSize(10);
        doc.text(`Date: ${new Date(receipt.date).toLocaleString()}`, 10, y);
        y += 7;
        doc.text(`Customer: ${receipt.customer.name} (${receipt.customer.contact})`, 10, y);
        y += 10;
        doc.text('Items:', 10, y);
        y += 7;
        doc.text('Name         Qty   Unit Price   Subtotal', 10, y);
        y += 5;
        for (const item of receipt.items) {
            doc.text(
                `${item.name.padEnd(12)} ${item.quantity.toString().padEnd(4)} $${item.price.toFixed(2).padEnd(10)} $${(item.price*item.quantity).toFixed(2)}`,
                10, y
            );
            y += 5;
        }
        y += 5;
        doc.text(`Subtotal: $${receipt.subtotal.toFixed(2)}`, 10, y);
        y += 5;
        doc.text(`Tax: $${receipt.tax.toFixed(2)}`, 10, y);
        y += 5;
        if (receipt.discount > 0) {
            doc.text(`Discount: -$${receipt.discount.toFixed(2)}`, 10, y);
            y += 5;
        }
        doc.text(`Total: $${receipt.total.toFixed(2)}`, 10, y);
        doc.save(`receipt_${receipt.id}.pdf`);
    }

    // Use invoice1.html template as a string inside app.js
    const templateContent = `
    <style>
    body{
    margin-top:20px;
    color: #484b51;
}
.text-secondary-d1 {
    color: #728299!important;
}
.page-header {
    margin: 0 0 1rem;
    padding-bottom: 1rem;
    padding-top: .5rem;
    border-bottom: 1px dotted #e2e2e2;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
}
.page-title {
    padding: 0;
    margin: 0;
    font-size: 1.75rem;
    font-weight: 300;
}
.brc-default-l1 {
    border-color: #dce9f0!important;
}

.ml-n1, .mx-n1 {
    margin-left: -.25rem!important;
}
.mr-n1, .mx-n1 {
    margin-right: -.25rem!important;
}
.mb-4, .my-4 {
    margin-bottom: 1.5rem!important;
}

hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid rgba(0,0,0,.1);
}

.text-grey-m2 {
    color: #888a8d!important;
}

.text-success-m2 {
    color: #86bd68!important;
}

.font-bolder, .text-600 {
    font-weight: 600!important;
}

.text-110 {
    font-size: 110%!important;
}
.text-blue {
    color: #478fcc!important;
}
.pb-25, .py-25 {
    padding-bottom: .75rem!important;
}

.pt-25, .py-25 {
    padding-top: .75rem!important;
}
.bgc-default-tp1 {
    background-color: rgba(121,169,197,.92)!important;
}
.bgc-default-l4, .bgc-h-default-l4:hover {
    background-color: #f3f8fa!important;
}
.page-header .page-tools {
    -ms-flex-item-align: end;
    align-self: flex-end;
}

.btn-light {
    color: #757984;
    background-color: #f5f6f9;
    border-color: #dddfe4;
}
.w-2 {
    width: 1rem;
}

.text-120 {
    font-size: 120%!important;
}
.text-primary-m1 {
    color: #4087d4!important;
}

.text-danger-m1 {
    color: #dd4949!important;
}
.text-blue-m2 {
    color: #68a3d5!important;
}
.text-150 {
    font-size: 150%!important;
}
.text-60 {
    font-size: 60%!important;
}
.text-grey-m1 {
    color: #7b7d81!important;
}
.align-bottom {
    vertical-align: bottom!important;
}










    </style>
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
<div class="page-content container">
    <div class="page-header text-blue-d2">
        <h1 class="page-title text-secondary-d1">
            Invoice
            <small class="page-info">
                <i class="fa fa-angle-double-right text-80"></i>
                ID: #{{id}}
            </small>
        </h1>
    </div>
    <div class="container px-0">
        <div class="row mt-4">
            <div class="col-12 col-lg-12">
                <div class="row">
                    <div class="col-12">
                        <div class="text-center text-150">
                            <i class="fa fa-book fa-2x text-success-m2 mr-1"></i>
                            <span class="text-default-d3">{{company}}</span>
                        </div>
                    </div>
                </div>
                <hr class="row brc-default-l1 mx-n1 mb-4" />
                <div class="row">
                    <div class="col-sm-6">
                        <div>
                            <span class="text-sm text-grey-m2 align-middle">To:</span>
                            <span class="text-600 text-110 text-blue align-middle">{{customer.name}}</span>
                        </div>
                        <div class="text-grey-m2">
                            <div class="my-1">{{customer.address}}</div>
                            <div class="my-1">{{customer.city}}</div>
                            <div class="my-1"><i class="fa fa-phone fa-flip-horizontal text-secondary"></i> <b class="text-600">{{customer.contact}}</b></div>
                        </div>
                    </div>
                    <div class="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                        <hr class="d-sm-none" />
                        <div class="text-grey-m2">
                            <div class="mt-1 mb-2 text-secondary-m1 text-600 text-125">Invoice</div>
                            <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">ID:</span> #{{id}}</div>
                            <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">Issue Date:</span> {{date}}</div>
                            <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">Status:</span> <span class="badge badge-warning badge-pill px-25">Unpaid</span></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="row text-600 text-white bgc-default-tp1 py-25">
                        <div class="d-none d-sm-block col-1">#</div>
                        <div class="col-9 col-sm-5">Description</div>
                        <div class="d-none d-sm-block col-4 col-sm-2">Qty</div>
                        <div class="d-none d-sm-block col-sm-2">Unit Price</div>
                        <div class="col-2">Amount</div>
                    </div>
                    <div class="text-95 text-secondary-d3">
                        {{#items}}
                        <div class="row mb-2 mb-sm-0 py-25 {{rowClass}}">
                            <div class="d-none d-sm-block col-1">{{index}}</div>
                            <div class="col-9 col-sm-5">{{item name}}</div>
                            <div class="d-none d-sm-block col-2">{{item quantity}}</div>
                            <div class="d-none d-sm-block col-2 text-95">$ {{item price}}</div>
                            <div class="col-2 text-secondary-d2">$ {{item subtotal}}</div>
                        </div>
                        {{/items}}
                    </div>
                    <div class="row border-b-2 brc-default-l2"></div>
                    <div class="row mt-3">
                        <div class="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                            Extra note such as company or payment information...
                        </div>
                        <div class="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                            <div class="row my-2">
                                <div class="col-7 text-right">SubTotal</div>
                                <div class="col-5"><span class="text-120 text-secondary-d1">$ {{subtotalSum}}</span></div>
                            </div>
                            <div class="row my-2">
                                <div class="col-7 text-right">Tax ({{taxRate}}%)</div>
                                <div class="col-5"><span class="text-110 text-secondary-d1">$ {{tax}}</span></div>
                            </div>
                            <div class="row my-2 align-items-center bgc-primary-l3 p-2">
                                <div class="col-7 text-right">Total Amount</div>
                                <div class="col-5"><span class="text-150 text-success-d3 opacity-2">$ {{total}}</span></div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <span class="text-secondary-d1 text-105">Thank you for your business</span>
                        <a href="#" class="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">Pay Now</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

    // Add preview modal for receipt
    const previewModal = document.createElement('div');
    previewModal.id = 'receipt-preview-modal';
    previewModal.style.display = 'none';
    previewModal.style.position = 'fixed';
    previewModal.style.top = '0';
    previewModal.style.left = '0';
    previewModal.style.width = '100vw';
    previewModal.style.height = '100vh';
    previewModal.style.background = 'rgba(0,0,0,0.5)';
    previewModal.style.zIndex = '9999';
    previewModal.innerHTML = `
        <div id="receipt-preview-content" style="background:#fff;max-width:900px;margin:40px auto;padding:24px;border-radius:8px;position:relative;box-shadow:0 2px 16px #0002;">
            <button id="close-preview" style="position:absolute;top:8px;right:8px;font-size:1.5em;background:none;border:none;cursor:pointer;" title="Close">&times;</button>
            <div id="receipt-preview-html"></div>
            <div style="text-align:right;margin-top:16px;">
                <button id="export-preview-pdf" class="btn btn-success btn-lg" title="Export this invoice as PDF"><i class="fa fa-file-pdf-o"></i> Export as PDF</button>
                <button id="print-preview" class="btn btn-primary btn-lg" title="Print this invoice"><i class="fa fa-print"></i> Print</button>
            </div>
            <div style="text-align:right;font-size:90%;color:#888;margin-top:4px;">Use these buttons to export or print the invoice for your client.</div>
        </div>
    `;
    document.body.appendChild(previewModal);
    document.getElementById('close-preview').onclick = function() {
        previewModal.style.display = 'none';
    };
    document.getElementById('export-preview-pdf').onclick = function() {
        exportPreviewAsPDF();
    };
    document.getElementById('print-preview').onclick = function() {
        printPreview();
    };

    // Show preview modal with receipt HTML
    function showReceiptPreview(html, receipt) {
        document.getElementById('receipt-preview-html').innerHTML = html;
        previewModal.style.display = 'block';
        window._lastPreviewReceipt = receipt;
        // Fix: Remove any hash from the URL that may be added by anchor tags
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        // Prevent anchor tags in the preview from changing the URL
        document.querySelectorAll('#receipt-preview-html a').forEach(a => {
            a.onclick = function(e) { e.preventDefault(); return false; };
        });
    }

    // --- Export/Print in Preview Modal ---
    function exportPreviewAsPDF() {
        const printContents = document.getElementById('receipt-preview-html').innerHTML;
        const printWindow = window.open('', '', 'width=900,height=900');
        printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice Export</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>body{background:#fff!important;}</style>
</head>
<body>${printContents}</body>
</html>`);
        printWindow.document.close();
        printWindow.focus();
        // Wait for styles to load before printing
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 300);
        };
    }
    function printPreview() {
        const printContents = document.getElementById('receipt-preview-html').innerHTML;
        const printWindow = window.open('', '', 'width=900,height=900');
        printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice Print</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>body{background:#fff!important;}</style>
</head>
<body>${printContents}</body>
</html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 300);
        };
    }

    // Override renderReceipt to show preview modal
    function renderReceipt(receipt) {
        // Add computed fields for invoice1.html
        const taxRate = receipt.tax && receipt.subtotal ? Math.round(receipt.tax / receipt.subtotal * 100) : 15;
        const items = receipt.items.map((item, idx) => ({
            ...item,
            index: idx + 1,
            subtotal: (item.price * item.quantity).toFixed(2),
            rowClass: idx % 2 === 1 ? 'bgc-default-l4' : ''
        }));
        let html = templateContent;
        // Replace all {{property}} with the corresponding value from receipt or its nested objects
        html = html.replace(/{{\s*([\w.]+)\s*}}/g, function(_, key) {
            const keys = key.split('.');
            let value = receipt;
            if (key === 'taxRate') return taxRate;
            for (const k of keys) {
                value = value && value[k];
            }
            return (value !== undefined && value !== null) ? value : '';
        });
        // Render items block
        html = html.replace(/{{#items}}([\s\S]*?){{\/items}}/g, function(_, rowTpl) {
            return items.map(item =>
                rowTpl.replace(/{{\s*([\w ]+)\s*}}/g, function(_, key) {
                    if (key.startsWith('item ')) {
                        const prop = key.replace('item ', '');
                        return item[prop] !== undefined ? item[prop] : '';
                    }
                    return item[key] !== undefined ? item[key] : '';
                })
            ).join('');
        });
        // Remove unused discount block if discount is 0
        if (receipt.discount === 0) {
            html = html.replace(/{{#discount}}([\s\S]*?){{\/discount}}/g, '');
        } else {
            html = html.replace(/{{#discount}}([\s\S]*?){{\/discount}}/g, '$1');
        }
        showReceiptPreview(html, receipt);
    }

    // --- Invoice History UI ---
    const historyBtn = document.createElement('button');
    historyBtn.textContent = 'Show Invoice History';
    historyBtn.className = 'btn btn-secondary';
    historyBtn.style.margin = '16px 0';
    document.querySelector('.container').insertBefore(historyBtn, document.getElementById('receipt-output'));

    const historyModal = document.createElement('div');
    historyModal.id = 'history-modal';
    historyModal.style.display = 'none';
    historyModal.style.position = 'fixed';
    historyModal.style.top = '0';
    historyModal.style.left = '0';
    historyModal.style.width = '100vw';
    historyModal.style.height = '100vh';
    historyModal.style.background = 'rgba(0,0,0,0.5)';
    historyModal.style.zIndex = '9999';
    historyModal.innerHTML = `
        <div style="background:#fff;max-width:900px;margin:40px auto;padding:24px;border-radius:8px;position:relative;box-shadow:0 2px 16px #0002;">
            <button id="close-history" style="position:absolute;top:8px;right:8px;font-size:1.5em;background:none;border:none;cursor:pointer;">&times;</button>
            <h3>Invoice History</h3>
            <div id="history-list"></div>
        </div>
    `;
    document.body.appendChild(historyModal);
    document.getElementById('close-history').onclick = function() {
        historyModal.style.display = 'none';
    };
    historyBtn.onclick = function() {
        fetch('http://localhost:5000/api/receipts')
            .then(res => res.json())
            .then(data => {
                const list = data.receipts.map(r => `
                    <div style='border-bottom:1px solid #eee;padding:8px 0;'>
                        <b>Receipt #${r.id}</b> | ${new Date(r.date).toLocaleString()} | Customer: ${r.customer.name} <br>
                        <span style='font-size:90%'>Total: $${r.total.toFixed(2)}</span>
                        <button class='btn btn-sm btn-outline-primary' data-receipt-id='${r.id}'>Preview</button>
                    </div>
                `).join('');
                document.getElementById('history-list').innerHTML = list || '<i>No invoices found.</i>';
                historyModal.style.display = 'block';
                // Add preview click handlers
                document.querySelectorAll('[data-receipt-id]').forEach(btn => {
                    btn.onclick = function() {
                        const rid = this.getAttribute('data-receipt-id');
                        const receipt = data.receipts.find(r => r.id == rid);
                        renderReceipt(receipt);
                        historyModal.style.display = 'none';
                    };
                });
            })
            .catch(() => {
                document.getElementById('history-list').innerHTML = '<i>Error loading invoices.</i>';
                historyModal.style.display = 'block';
            });
    };

    // Add Export as PDF button next to Generate button
    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.className = 'btn btn-success';
    exportBtn.style.marginLeft = '8px';
    exportBtn.innerHTML = '<i class="fa fa-file-pdf-o"></i> Export as PDF';
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.parentNode.insertBefore(exportBtn, submitBtn.nextSibling);

    exportBtn.onclick = function() {
        // Gather data from form (same as in submit handler)
        const customer = {
            name: document.getElementById('customer-name').value,
            contact: document.getElementById('customer-contact').value
        };
        const items = Array.from(itemsList.querySelectorAll('.item-row')).map(row => ({
            name: row.querySelector('.item-name').value,
            quantity: parseInt(row.querySelector('.item-qty').value),
            price: parseFloat(row.querySelector('.item-price').value)
        }));
        const discountCode = document.getElementById('discount-code').value;
        fetch('http://localhost:5000/api/receipts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer, items, discount_code: discountCode })
        })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (ok) {
                exportPreviewAsPDFDirect(data.receipt);
            } else {
                alert(data.error || 'Error generating receipt.');
            }
        })
        .catch(() => {
            alert('Network error.');
        });
    };

    // Direct export as PDF (without showing modal)
    function exportPreviewAsPDFDirect(receipt) {
        // Use the same template rendering as renderReceipt
        const taxRate = receipt.tax && receipt.subtotal ? Math.round(receipt.tax / receipt.subtotal * 100) : 15;
        const items = receipt.items.map((item, idx) => ({
            ...item,
            index: idx + 1,
            subtotal: (item.price * item.quantity).toFixed(2),
            rowClass: idx % 2 === 1 ? 'bgc-default-l4' : ''
        }));
        let html = templateContent;
        html = html.replace(/{{\s*([\w.]+)\s*}}/g, function(_, key) {
            const keys = key.split('.');
            let value = receipt;
            if (key === 'taxRate') return taxRate;
            for (const k of keys) {
                value = value && value[k];
            }
            return (value !== undefined && value !== null) ? value : '';
        });
        html = html.replace(/{{#items}}([\s\S]*?){{\/items}}/g, function(_, rowTpl) {
            return items.map(item =>
                rowTpl.replace(/{{\s*([\w ]+)\s*}}/g, function(_, key) {
                    if (key.startsWith('item ')) {
                        const prop = key.replace('item ', '');
                        return item[prop] !== undefined ? item[prop] : '';
                    }
                    return item[key] !== undefined ? item[key] : '';
                })
            ).join('');
        });
        if (receipt.discount === 0) {
            html = html.replace(/{{#discount}}([\s\S]*?){{\/discount}}/g, '');
        } else {
            html = html.replace(/{{#discount}}([\s\S]*?){{\/discount}}/g, '$1');
        }
        // Open print window and trigger print (PDF export)
        const printWindow = window.open('', '', 'width=900,height=900');
        printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice Export</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>body{background:#fff!important;}</style>
</head>
<body>${html}</body>
</html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 300);
        };
    }
});
