from fastapi import FastAPI

app = FastAPI(
    title="AI Customer Support",
    description="An AI-powered customer support application.",
    version="1.0.0",
)


@app.get("/")
def health() -> dict:
    return {"status": "ok"}
