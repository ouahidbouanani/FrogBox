import tempfile
import io
from pdf2docx import Converter

def convert_pdf_to_word_function(file):
    # Créer un fichier temporaire pour stocker le PDF
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_pdf.write(file.read())
    temp_pdf.close()  # Fermer pour que pdf2docx puisse le lire

    # Créer un fichier temporaire pour stocker le fichier Word
    temp_word = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    temp_word.close()

    # Convertir le PDF en Word
    cv = Converter(temp_pdf.name)
    cv.convert(temp_word.name, start=0, end=None)  # Conversion complète
    cv.close()

    # Lire le fichier Word en mémoire
    with open(temp_word.name, "rb") as f:
        word_bytes = io.BytesIO(f.read())

    word_bytes.seek(0)  # Revenir au début du fichier

    return word_bytes
