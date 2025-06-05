from flask import Blueprint, request, send_file
from scripts.pdftoppt import convert_pdf_to_pptx
import io

routes_pdftoppt = Blueprint('routes_pdftoppt', __name__)

@routes_pdftoppt.route('/convert-pptx', methods=['POST'])
def convert_pdf():
    if 'file' not in request.files:
        return {"error": "Aucun fichier reçu"}, 400

    file = request.files['file']
    
    if not file.filename.endswith('.pdf'):
        return {"error": "Le fichier doit être un PDF"}, 400

    pdf_bytes = file.read()

    ppt_io = convert_pdf_to_pptx(pdf_bytes)

    if isinstance(ppt_io, dict):  # Gestion des erreurs renvoyées par la fonction
        return ppt_io, 500

    return send_file(ppt_io, as_attachment=True, download_name="converted.pptx",
                     mimetype="application/vnd.openxmlformats-officedocument.presentationml.presentation")

