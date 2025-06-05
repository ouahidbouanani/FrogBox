import fitz  
import io

def add_page_numbers(pdf_bytes, position):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = f"{page_num + 1}"

        # Page size
        rect = page.rect
        width, height = rect.width, rect.height

        # Font size (set to 14)
        font_size = 14
        color = (0, 0, 0)  # Black

        # Define the position of the text based on the selected option
        positions = {
            "haut_gauche": (20, 20),
            "haut_centre": (width / 2 - font_size * 2, 20),
            "haut_droit": (width - 80, 20),
            "bas_gauche": (20, height - 30),
            "bas_centre": (width / 2 - font_size * 2, height - 30),
            "bas_droit": (width - 80, height - 30),
        }

        x, y = positions.get(position, (20, height - 30))  # Default: bottom left

        # Add the page number with the Arial font
        page.insert_text((x, y), text, fontsize=font_size, fontname="helv", color=color)  # "helv" ≈ Arial

    # Save the modified file
    output_pdf = io.BytesIO()
    doc.save(output_pdf)
    doc.close()
    output_pdf.seek(0)

    return output_pdf
