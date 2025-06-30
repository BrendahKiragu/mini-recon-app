# Mini Reconciliation App

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/built%20with-vite-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styled%20with-TailwindCSS-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Deployment Status](https://img.shields.io/badge/status-deployed-brightgreen)](https://mini-reconciliation-app.vercel.app/)

> A lightweight browser-based app to reconcile financial records via CSV comparison – no backend required.

---

## 🧾 Overview

The Mini Reconciliation App enables finance teams to identify matched and unmatched transaction records by uploading two CSV files:

- **Internal System Export**
- **Provider Statement**

The comparison is based on the `transaction_reference` field. Results are grouped into:

- ✅ Matched Transactions
- 📄 Internal Only
- 📄 Provider Only

All result groups are downloadable as CSVs.

---

## 🚀 Features

- 📤 Upload and validate two CSV files
- 🔄 Reconcile based on `transaction_reference`
- 📊 Real-time summary with match rate
- 💾 Download categorized results as CSV
- 📱 Fully responsive design
- ℹ️ CSV format guidance UI

---

## 📂 CSV Format Requirements

Each file **must include**:

- `transaction_reference` (used for matching)
- `amount` and `status` (for additional context)

**Optional columns:** `date`, `description`

---

## ⚙️ Assumptions

- Clean CSV format with headers in the first row
- ≤ 10,000 rows per file
- Matching is based **only** on `transaction_reference`
- Users operate in modern browsers with enough memory
- No server, authentication, or storage logic
- No currency conversions or API integrations

---

## 📌 Scope

**✅ In Scope**

- Upload & parse CSVs
- Match and classify records
- Export results
- Fully client-side

**❌ Out of Scope**

- Auth & storage
- APIs & automations
- Currency handling

---

## 🛠️ Tech Stack

- ⚡ Vite – Dev tooling
- ⚛️ React – UI framework
- 🎨 Tailwind CSS – Styling
- 💡 Lucide Icons – Icons

---

## 📦 Getting Started

```bash
git clone https://github.com/BrendahKiragu/mini-recon-app
cd mini-reconciliation-app
npm install
npm run dev
```

# MIT License

&copy; 2025 **Brendah Mwihaki Kiragu**

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall  
> be included in all copies or substantial portions of the Software.

---

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.** IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.
