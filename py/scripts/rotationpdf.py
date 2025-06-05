import io
import fitz  # PyMuPDF
from pdf2image import convert_from_bytes
import base64

# Chemin spécifique pour Poppler sur Windows
poppler_path = r'.\poppler-24.08.0\Library\bin'

def convert_pdf_to_image(pdf_bytes):
    """Convertit la première page d'un PDF en image et retourne l'image en base64"""
    images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1, poppler_path=poppler_path)
    img_io = io.BytesIO()
    images[0].save(img_io, format='PNG')
    img_io.seek(0)

    return base64.b64encode(img_io.getvalue()).decode('utf-8')

def rotate_pdf(pdf_bytes, rotation_angle):
    """Fait pivoter le PDF et retourne le PDF modifié en mémoire"""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    for page in doc:
        page.set_rotation(rotation_angle)

    output_pdf = io.BytesIO()
    doc.save(output_pdf)
    output_pdf.seek(0)

    return output_pdf

def rotate_pdf_and_convert_to_image(pdf_bytes, rotation_angle):
    """Fait pivoter le PDF et retourne une image de la première page pivotée en base64"""
    rotated_pdf = rotate_pdf(pdf_bytes, rotation_angle)
    return convert_pdf_to_image(rotated_pdf.getvalue())

