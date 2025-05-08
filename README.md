# 🛒 AI-Powered Grocery Store Compliance Validator

A web-based AI solution to instantly evaluate supermarket and grocery store images for compliance with industry standards across 12 rule categories. It uses Google Gemini AI for advanced visual analysis and outputs a detailed compliance report with recommendations and visual feedback.

## 🌟 Features

- 🔍 Upload grocery store images to validate compliance
- 🧠 AI-powered analysis using Google Gemini Pro Vision
- 📊 Generates compliance score and detailed rule-based insights
- 📝 Visual and textual summary of violations
- 📄 Downloadable PDF compliance report
- ✅ Categorized rule validation (e.g., shelf stocking, checkout area, aisle arrangement)
- 📁 Clean and intuitive UI with drag-and-drop image upload

## 📸 How It Works

1. Upload a grocery store image.
2. Click **"Analyze Compliance with Gemini AI"**.
3. The app checks the image against 12 predefined retail rules (from a `rules.yaml` file).
4. Violations are detected using both Gemini AI and object detection (YOLOv5 via Roboflow).
5. A compliance report is generated with:
   - Compliance status
   - Key violations
   - Compliance score
   - Recommendations
   - Optional PDF download

## 🔐 Environment Variables

Add the following to your `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here

📊 Sample Output
Compliance score: 20%
   Non-compliant rules include:
   Aisle clutter
   Improper product placement
   Empty shelves
   Display violations

PDF report summarizes rule category violations and provides improvement tips.

📌 Technologies Used
   
   React + Vite (Frontend)
   Google Gemini Pro Vision API
   YAML (for dynamic rule definition)

📥 Future Enhancements
   Add user login/authentication
   Track compliance history over time
   Interactive heatmap for visual violations

