from flask import Blueprint, request, send_file
import io
import zipfile
import os
from scripts.pdftoimage import convert_pdf_to_images

pdftoimage_blueprint = Blueprint('pdftoimage', __name__)

@pdftoimage_blueprint.route('/convert-pdf-to-image', methods=['POST'])
def convert_pdf_to_image():
    if 'file' not in request.files:
        return {"error": "Aucun fichier sélectionné"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "Aucun fichier sélectionné"}, 400

    try:
        pdf_bytes = file.read()

        # Convertir le PDF en images
        images = convert_pdf_to_images(pdf_bytes)

        # Créer un fichier ZIP en mémoire
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
            for i, img in enumerate(images):
                img_bytes = io.BytesIO()
                img.save(img_bytes, format="JPEG")
                img_bytes.seek(0)
                zipf.writestr(f"page_{i + 1}.jpg", img_bytes.getvalue())

        zip_buffer.seek(0)
        return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name="images.zip")

    except Exception as e:
        return {"error": f"Erreur lors de la conversion : {str(e)}"}, 500


