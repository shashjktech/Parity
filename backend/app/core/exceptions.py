class AppError(Exception):
    """Base class for application-specific exceptions."""
    def __init__(self, error_code: str, status_code: int, message: str):
        self.error_code = error_code
        self.status_code = status_code
        self.message = message
        super().__init__(self.message)