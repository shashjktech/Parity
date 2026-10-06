from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


from app.core.config import settings
from app.core.database import init_db
from app.core.exceptions import AppError
from app.core.firebase import init_firebase
from app.services.auth.routes import router as auth_router
from app.services.properties.routes import router as property_router
from app.services.spaces.route import router as space_router
from app.services.prompts.route import router as prompt_router
from app.services.worker.route import router as worker_router
from app.services.Inspection.route import router as inspection_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="2.0.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def log_space_create_ingress(request: Request, call_next):
    if request.method != "POST" or not request.url.path.endswith("/spaces/add"):
        return await call_next(request)

    logger.info(
        "Space create request received path=%s content_type=%s content_length=%s",
        request.url.path,
        request.headers.get("content-type"),
        request.headers.get("content-length"),
    )
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Space create request failed before response path=%s", request.url.path)
        raise

    logger.info(
        "Space create request completed path=%s status_code=%s",
        request.url.path,
        response.status_code,
    )
    return response


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.error_code, "message": exc.message},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_error_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    error_summary = "; ".join(
        f"{'.'.join(str(part) for part in error.get('loc', ()))} ({error.get('type', 'unknown')})"
        for error in exc.errors()
    )
    logger.warning(
        "Request validation failed for %s %s: %s",
        request.method,
        request.url.path,
        error_summary,
    )
    return await app_error_handler(
        request,
        AppError(
            "VALIDATION_ERROR",
            422,
            "Please check the submitted information.",
        ),
    )

# Standard CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all domain routers under /v1
API_PREFIX = "/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(property_router, prefix=API_PREFIX)
app.include_router(space_router, prefix=API_PREFIX)
app.include_router(prompt_router, prefix=API_PREFIX)
app.include_router(worker_router, prefix=API_PREFIX)
app.include_router(inspection_router, prefix=API_PREFIX)
