from pdf2image import convert_from_bytes
import os

def convert_pdf_to_images(pdf_bytes):
    # Ajouter le chemin de Poppler au PATH (nécessaire sur Windows)
    poppler_path = r'.\poppler-24.08.0\Library\bin'
    os.environ["PATH"] += os.pathsep + poppler_path

    # Convertir le PDF en images
    images = convert_from_bytes(pdf_bytes)

    return images
