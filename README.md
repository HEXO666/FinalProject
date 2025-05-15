# Receipt Generator

#### Video Demo: <YOUR_VIDEO_URL_HERE>

## Project Overview

The Receipt Generator aims to simplify invoice creation for small businesses and freelancers by providing an easy-to-use web app for generating, previewing, and storing receipts. This tool helps reduce manual paperwork and allows for quick access to past invoices, improving record keeping and client communication.

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

## Technologies and CS50 Concepts

- **Backend:** Python (Flask), using Flask-SQLAlchemy ORM for database interaction — showcasing understanding of Python, web APIs, and database management.
- **Frontend:** JavaScript, HTML, CSS — demonstrating dynamic UI manipulation, event handling, and client-server communication (fetch API).
- **Database:** SQLite for persistence, illustrating knowledge of relational databases and data modeling.
- **RESTful API design** and use of CORS for frontend-backend integration.
- **Templating concepts** for generating invoice HTML dynamically.

---

## Project Structure

```
FinalProject/
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

## Challenges and Learning Experiences

- Designing a flexible invoice template that could dynamically handle multiple items and discounts required careful DOM manipulation and template design.
- Managing frontend-backend communication asynchronously using JavaScript's fetch API enhanced my understanding of RESTful services.
- Implementing database models with relationships in Flask-SQLAlchemy deepened my knowledge of relational data and ORM.
- Ensuring the PDF export maintained styling and formatting was addressed by leveraging browser print-to-PDF functionality.

---

## Future Improvements

- Add user authentication to secure access to invoices.
- Enable cloud storage or export/import of invoices.
- Add support for multiple companies or branches.
- Enhance PDF generation with libraries like ReportLab or WeasyPrint for better control.

---



This project showcases my understanding of full-stack web development, database management, and dynamic user interface design, drawing on the key concepts taught in CS50x.

