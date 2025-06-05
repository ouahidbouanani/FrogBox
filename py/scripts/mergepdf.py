from PyPDF2 import PdfReader, PdfWriter
import os
import tempfile

def merge_pdfs(files):
    pdf_writer = PdfWriter()

    # Fusionner tous les fichiers PDF reçus
    for file in files:
        pdf_reader = PdfReader(file)
        for page in range(len(pdf_reader.pages)):
            pdf_writer.add_page(pdf_reader.pages[page])

    # Créer un fichier temporaire pour stocker le fichier fusionné
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    output_path = temp_file.name

    # Écrire le fichier fusionné dans le fichier temporaire
    with open(output_path, 'wb') as out:
        pdf_writer.write(out)

    return output_path
