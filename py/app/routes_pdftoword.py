from flask import Blueprint, request, send_file
from scripts.pdftoword import convert_pdf_to_word_function

convert_pdf_to_word = Blueprint('convert_pdf_to_word', __name__)

@convert_pdf_to_word.route('/convert', methods=['POST'])
def convert_pdf_to_word_route():
    if 'file' not in request.files:
        return {"error": "Aucun fichier sélectionné"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "Aucun fichier sélectionné"}, 400

    if file:
        # Appeler la fonction de conversion
        word_bytes = convert_pdf_to_word_function(file)

        return send_file(
            word_bytes,
            as_attachment=True,
            download_name="converted.docx",
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
