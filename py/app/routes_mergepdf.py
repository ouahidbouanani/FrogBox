from flask import Blueprint, request, send_file, jsonify
from scripts.mergepdf import merge_pdfs

# Création du Blueprint pour la fusion des PDF
mergepdf_bp = Blueprint('mergepdf', __name__)

@mergepdf_bp.route('/merge', methods=['POST'])
def merge():
    files = request.files.getlist('files')

    if not files:
        return jsonify({'message': 'Aucun fichier fourni'}), 400

    # Fusionner les fichiers
    merged_pdf_path = merge_pdfs(files)
    
    # Renvoie le fichier fusionné en réponse
    return send_file(merged_pdf_path, as_attachment=True, download_name='merged.pdf', mimetype='application/pdf')

