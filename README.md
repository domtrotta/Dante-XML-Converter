# Dante XML to Text Converter

This is a simple web-based tool that converts Dante Controller XML preset files into a clean, readable text format.

## 🔧 What It Does
- Parses `.xml` Dante Controller preset files
- Extracts:
  - Preset name, version, description
  - Device details (model, manufacturer, sample rate, etc.)
  - All Rx and Tx channel routing
- Displays everything in a readable table-style format
- Lets you download the result as a `.txt` file

## 💻 How To Use
1. Open the tool: [https://domtrotta.github.io/Dante-XML-Converter/](https://domtrotta.github.io/Dante-XML-Converter/)
2. Click **Choose File** and upload your `Dante.xml` file
3. View the formatted output directly in the browser
4. Click **Download as .txt** to save the result

## 📦 Files
- `index.html` — main webpage
- `script.js` — handles XML parsing and formatting
- `style.css` — (optional) for UI styling

## ⚠️ Notes
- This tool runs completely in your browser
- No data is uploaded or saved
- Works offline once loaded

---

Want to improve it? Fork the repo or open an issue.
