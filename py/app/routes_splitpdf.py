from flask import Blueprint, request, send_file, jsonify
from scripts.splitpdf import split_pdf, split_pdf_zip

# Création du Blueprint
splitpdf_bp = Blueprint('splitpdf', __name__)

@splitpdf_bp.route('/split', methods=['POST'])
def split():
    file = request.files.get('file')
    if not file:
        return jsonify({'message': 'Aucun fichier fourni'}), 400

    files = split_pdf(file)

    return jsonify({'message': 'PDF divisé avec succès', 'files': files})

@splitpdf_bp.route('/splitzip', methods=['POST'])
def split_zip():
    file = request.files.get('file')
    if not file:
        return jsonify({'message': 'Aucun fichier fourni'}), 400

    zip_bytes = split_pdf_zip(file)

    return send_file(zip_bytes, as_attachment=True, download_name='split_pages.zip', mimetype='application/zip')
