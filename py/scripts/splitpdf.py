from PyPDF2 import PdfReader, PdfWriter
from io import BytesIO
import zipfile

def split_pdf(file):
    pdf_reader = PdfReader(file)
    files = []

    for page in range(len(pdf_reader.pages)):
        pdf_writer = PdfWriter()
        pdf_writer.add_page(pdf_reader.pages[page])

        pdf_bytes = BytesIO()
        pdf_writer.write(pdf_bytes)
        pdf_bytes.seek(0)

        files.append({'filename': f'page_{page + 1}.pdf', 'content': pdf_bytes.getvalue()})

    return files

def split_pdf_zip(file):
    pdf_reader = PdfReader(file)
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for page in range(len(pdf_reader.pages)):
            pdf_writer = PdfWriter()
            pdf_writer.add_page(pdf_reader.pages[page])

            pdf_bytes = BytesIO()
            pdf_writer.write(pdf_bytes)
            pdf_bytes.seek(0)

            zipf.writestr(f'page_{page + 1}.pdf', pdf_bytes.read())

    zip_buffer.seek(0)
    return zip_buffer
