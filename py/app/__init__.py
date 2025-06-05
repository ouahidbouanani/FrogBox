from flask import Flask
from flask_cors import CORS
from app.routes_pdftoppt import routes_pdftoppt
from app.routes_ajoutnumero import add_numbers_bp
from app.routes_pdftoimage import pdftoimage_blueprint
from app.routes_rotationpdf import rotationpdf
from app.routes_mergepdf import mergepdf_bp
from app.routes_splitpdf import splitpdf_bp
from app.routes_pdftoword import convert_pdf_to_word
from app.routes_pdftoexcel import convert_pdf_to_excel


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Enregistrer les blueprints (routes)
app.register_blueprint(routes_pdftoppt)
app.register_blueprint(add_numbers_bp)
app.register_blueprint(pdftoimage_blueprint)
app.register_blueprint(rotationpdf)
app.register_blueprint(mergepdf_bp)
app.register_blueprint(splitpdf_bp)
app.register_blueprint(convert_pdf_to_word)
app.register_blueprint(convert_pdf_to_excel)