import os
from fpdf import FPDF

# Create a PDF class
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Code Files', 0, 1, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(2)

    def chapter_body(self, body):
        self.set_font('Arial', '', 10)  # Use a font that supports more characters
        # Encode the body to handle UTF-8 characters
        self.multi_cell(0, 10, body.encode('latin-1', 'replace').decode('latin-1'))
        self.ln()

# Specify your directory containing code files
directory = r"C:\Users\pc\OneDrive\Documents\Verdaily - Copy"  # Change this to your folder path

pdf = PDF()
pdf.add_page()

# Iterate through files in the directory
for filename in os.listdir(directory):
    if filename.endswith(('.py', '.js', '.html', '.css', '.java')):  # Add your file types here
        pdf.chapter_title(filename)
        with open(os.path.join(directory, filename), 'r', encoding='utf-8') as file:
            content = file.read()
            pdf.chapter_body(content)

# Save the PDF
pdf.output("Code_Files.pdf")

print("PDF created successfully!")
