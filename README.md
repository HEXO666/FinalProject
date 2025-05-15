# Receipt Generator

A web-based Receipt Generator for companies, featuring a modern frontend for entering purchase details and generating styled receipts, a Flask backend for storing and retrieving receipts, and a database for persistence. The app supports invoice history, PDF export, and uses a customizable HTML template for invoices.

---

## Features
- **Dynamic Invoice Creation:** Enter customer and item details, add/remove items, and apply discount codes.
- **Styled Invoice Preview:** Instantly preview invoices in a modern, printable format.
- **Export & Print:** Export invoices as PDF or print them directly from the browser.
- **Invoice History:** View and re-export all past invoices.
- **Backend API:** Flask REST API for creating and retrieving receipts.
- **Database Persistence:** All receipts are stored in a SQLite database.
- **Customizable Template:** Invoice template is easily editable in the frontend code.

---

## Project Structure

```
FinalProfject/
├── backend/
│   ├── app.py              # Flask backend with API and models
│   ├── requirements.txt    # Python dependencies
│   └── instance/
│       └── database.db     # SQLite database (auto-created)
├── frontend/
│   ├── index.html          # Main UI
│   ├── app.js              # Frontend logic (form, preview, export, history)
│   ├── style.css           # Custom and Bootstrap-like styles
│   └── README.md           # (Optional) Frontend-specific notes
└── README.md               # This file
```

---

## Backend Setup
- **Requirements:** Python 3.8+, Flask, Flask-SQLAlchemy, Flask-CORS

### To run the backend:
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000` by default.

---

## Frontend Usage
1. Open `frontend/index.html` in your browser (double-click or use a local server).
2. Fill in customer and item details. Add/remove items as needed.
3. Click **Generate** to preview the invoice, or **Export as PDF** to generate and export directly.
4. In the preview modal, use the **Export as PDF** or **Print** buttons to save or print the invoice.
5. Use **Show Invoice History** to view and re-export previous invoices.

---

## Code Explanation

### Backend (`backend/app.py`)
- **Flask App:** Provides REST API endpoints for creating (`POST /api/receipts`) and listing (`GET /api/receipts`) receipts.
- **Models:**
  - `Customer`: Stores customer name and contact info.
  - `Item`: Stores item name and price.
  - `Receipt`: Stores receipt metadata, links to customer, and has many items.
  - `ReceiptItem`: Associates items with receipts and quantities.
- **Database:** Uses SQLite for persistence (auto-created in `backend/instance/database.db`).
- **CORS:** Enabled for local frontend-backend communication.

### Frontend (`frontend/app.js`)
- **Form Logic:** Handles dynamic item rows, form submission, and discount code entry.
- **Invoice Rendering:** Uses an embedded HTML template for instant, styled invoice previews.
- **Preview Modal:** Shows the invoice with options to export as PDF or print.
- **Export/Print:** Opens a styled window for printing or saving as PDF (browser print dialog).
- **Invoice History:** Fetches all past receipts from the backend and allows previewing/exporting any invoice.
- **No External Template Fetching:** All rendering is inline for robustness and speed.

### Customization
- **Invoice Template:** Edit the `templateContent` string in `frontend/app.js` to change the invoice appearance.
- **Styles:** Modify `frontend/style.css` for custom branding or layout.

---

## Notes
- The app is designed for local or small business use. For production, consider deploying the backend and serving the frontend via a web server.
- All data is stored locally in SQLite by default.
- For PDF export, the browser's print-to-PDF is used for best template fidelity.

---

## License
MIT License (or specify your own)
