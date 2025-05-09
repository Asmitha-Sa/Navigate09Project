
# 🛒 AI-Powered Grocery Store Compliance Validator

A web-based AI solution to instantly evaluate supermarket and grocery store images for compliance with industry standards across 12 rule categories. It uses Google Gemini AI for advanced visual analysis and outputs a detailed compliance report with recommendations and visual feedback.

## 🌟 Features

- 🔍 Upload grocery store images to validate compliance
- 🧠 AI-powered analysis using Gemini 1.5 Flash
- 📊 Generates compliance score and detailed rule-based insights
- 📝 Visual and textual summary of violations
- 📄 Downloadable PDF compliance report
- ✅ Categorized rule validation (e.g., shelf stocking, checkout area, aisle arrangement)
- 📁 Clean and intuitive UI with drag-and-drop image upload

## 📸 How It Works

1. Upload a grocery store image.
2. Click **"Analyze Compliance with Gemini AI"**.
3. The app checks the image against 12 predefined retail rules (from a `rules.yaml` file).
4. Violations are detected using Gemini AI.
5. A compliance report is generated with:
    - Compliance status
    - Key violations
    - Compliance score
    - Recommendations
    - Optional PDF download

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_authentication_api_key
````
---

## 🚀 Quick Start

Copy and paste the commands below to install dependencies and run the project locally:

# Clone the repo (if needed)
```bash
# git clone https://github.com/Asmitha-Sa/Navigate09Project
# cd Navigate09Project
```
# Install dependencies
```bash
npm install
```
# Start development server
```bash
npm run dev
```

---

## 📊 Sample Output

```
Compliance score: 20%
Non-compliant rules include:
  - Aisle clutter
  - Improper product placement
  - Empty shelves
  - Display violations
```

The PDF report summarizes rule category violations and provides improvement tips.

---

## 📌 Technologies Used

* React + Vite (Frontend)
* Google Gemini Pro Vision API

---

## 📥 Future Enhancements

* Track compliance history over time
* Interactive heatmap for visual violations



