from flask import Blueprint, request, jsonify, send_file
from scripts.rotationpdf import convert_pdf_to_image, rotate_pdf, rotate_pdf_and_convert_to_image

rotationpdf = Blueprint('rotationpdf', __name__)

@rotationpdf.route('/upload', methods=['POST'])
def upload_pdf():
    """Convertit la première page du PDF en image et retourne l'image en base64"""
    file = request.files['pdf']
    pdf_bytes = file.read()
    img_base64 = convert_pdf_to_image(pdf_bytes)

    return jsonify({'image': f"data:image/png;base64,{img_base64}"})

@rotationpdf.route('/rotate', methods=['POST'])
def rotate():
    """Fait pivoter le PDF et renvoie une nouvelle image en base64"""
    file = request.files['pdf']
    pdf_bytes = file.read()
    rotation = int(request.form['rotation'])

    img_base64 = rotate_pdf_and_convert_to_image(pdf_bytes, rotation)

    return jsonify({'image': f"data:image/png;base64,{img_base64}"})

@rotationpdf.route('/download', methods=['POST'])
def download_pdf():
    """Retourne le PDF pivoté en mémoire"""
    file = request.files['pdf']
    pdf_bytes = file.read()
    rotation = int(request.form['rotation'])

    rotated_pdf = rotate_pdf(pdf_bytes, rotation)

    return send_file(rotated_pdf, mimetype="application/pdf", as_attachment=True, download_name="rotated.pdf")

