# Dante XML to Matrix Export

This tool converts Dante Controller XML preset files into a clear, styled **matrix view Excel file (.xlsx)**.  
It’s designed to quickly show Rx/Tx channel routing in a format that looks like Dante Controller’s grid.

---

## 🔗 Try it here:
**[https://domtrotta.github.io/Dante-XML-Converter/](https://domtrotta.github.io/Dante-XML-Converter/)**

---

## 📦 What it does
- Reads `.xml` preset exported from Dante Controller
- Extracts device and channel routing info
- Builds a matrix with:
  - Rx devices/channels on rows
  - Tx devices/channels as merged headers
  - Dot markers (●) at each active subscription
- Exports it as a real `.xlsx` Excel file (with merged cells, styling, and fixed column width)

---

## 🧑‍💻 How to use
1. Go to the tool page  
2. Upload your Dante `.xml` preset file  
3. Click **Get Your MATRIX File**  
4. Excel file downloads instantly

---

## 🖼 Example Output

![Matrix Example](https://raw.githubusercontent.com/domtrotta/Dante-XML-Converter/main/matrix-preview.png)