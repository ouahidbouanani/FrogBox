from flask import Blueprint, request, send_file
from scripts.pdftoexcel import convert_pdf_to_excel_function

convert_pdf_to_excel = Blueprint('convert_pdf_to_excel', __name__)

@convert_pdf_to_excel.route('/convert-excel', methods=['POST'])
def convert_pdf_to_excel_route():
    if 'file' not in request.files:
        return {"error": "Aucun fichier sélectionné"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "Aucun fichier sélectionné"}, 400

    try:
        # Appeler la fonction de conversion
        excel_file = convert_pdf_to_excel_function(file)

        return send_file(
            excel_file,
            as_attachment=True,
            download_name="converted.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        return {"error": f"Erreur lors de la conversion: {str(e)}"}, 500
