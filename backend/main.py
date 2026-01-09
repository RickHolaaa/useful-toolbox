from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
async def merge_pdfs():
    return {"message": "Merge PDF endpoint - coming soon"}


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
