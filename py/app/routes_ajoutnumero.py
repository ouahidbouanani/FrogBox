from flask import Blueprint, request, send_file
from scripts.ajoutnumero import add_page_numbers
import io

# Create a Blueprint for routes related to PDF processing
add_numbers_bp = Blueprint('add_numbers', __name__)

# Route to handle PDF number addition
@add_numbers_bp.route('/add_numbers', methods=['POST'])
def add_numbers():
    if 'file' not in request.files:
        return {"error": "Aucun fichier reçu"}, 400

    file = request.files['file']
    position = request.form.get("position", "bas_droit")  # Default position: bottom right
    pdf_bytes = file.read()

    modified_pdf = add_page_numbers(pdf_bytes, position)

    return send_file(modified_pdf, as_attachment=True, download_name="numbered.pdf", mimetype="application/pdf")
