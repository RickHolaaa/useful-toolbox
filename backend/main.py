from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import io
from pypdf import PdfWriter, PdfReader

app = FastAPI(title="Useful Toolbox API", version="1.0.0")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Useful Toolbox API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# PDF Tools
@app.post("/api/pdf/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    """
    Merge multiple PDF files into a single PDF.
    Files are merged in the order they appear in the request.
    """
    if not files or len(files) < 2:
        return {"error": "At least 2 PDF files are required"}, 400

    try:
        pdf_writer = PdfWriter()

        # Read and merge each PDF
        for file in files:
            if file.content_type != "application/pdf":
                return {"error": f"File {file.filename} is not a PDF"}, 400

            # Read the uploaded file
            content = await file.read()
            pdf_reader = PdfReader(io.BytesIO(content))

            # Add all pages from this PDF to the writer
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                pdf_writer.add_page(page)

        # Write the merged PDF to bytes
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)

        # Create a temporary file to serve
        temp_path = "/tmp/merged_output.pdf"
        with open(temp_path, "wb") as f:
            f.write(output.getvalue())

        return FileResponse(
            path=temp_path,
            filename="merged.pdf",
            media_type="application/pdf",
        )
    except Exception as e:
        return {"error": f"Failed to merge PDFs: {str(e)}"}, 500


@app.post("/api/pdf/split")
async def split_pdf():
    return {"message": "Split PDF endpoint - coming soon"}


# Image Tools
@app.post("/api/image/resize")
async def resize_image():
    return {"message": "Resize image endpoint - coming soon"}


@app.post("/api/image/remove-background")
async def remove_background():
    return {"message": "Remove background endpoint - coming soon"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
