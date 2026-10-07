import enum

class Role(enum.Enum):
    OWNER = "OWNER"
    WORKER = "WORKER"

class CaptureStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    OK = "OK"
    REJECTED = "REJECTED"
    FAILED = "FAILED"

class VerificationStatus(enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    ACTION_REQUIRED = "ACTION_REQUIRED"

class ScheduleType(enum.Enum):
    RECURRING = "RECURRING"
    EVENT_DRIVEN = "EVENT_DRIVEN"

class RecurrenceType(enum.Enum):
    DAILY = "DAILY"
    CUSTOM_DAYS = "CUSTOM_DAYS"

class SpaceType(enum.Enum):
    ROOM = "ROOM"
    AREA="AREA"
    ASSETS="ASSETS"
    # BEDROOM = "BEDROOM"
    # KITCHEN = "KITCHEN"
    # BAR_COUNTER = "BAR_COUNTER"
    # DINING_AREA = "DINING_AREA"
    # OUTDOOR = "OUTDOOR"
    # RESTROOM = "RESTROOM"
    # RECEPTION = "RECEPTION"
    # STORAGE = "STORAGE"
    # OTHER = "OTHER"

class PropertyWorkerStatus(enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"

class IssueStatus(enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
