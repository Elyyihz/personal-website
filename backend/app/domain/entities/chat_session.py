"""Chat session and message entities module.

Models conversations, roles, and message turns for the interactive AI assistant.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class ChatRole(str, Enum):
    """Enumeration of authorized conversational roles."""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage:
    """Domain value object representing a single message turn in a chat interaction.

    Attributes:
        role (ChatRole): Participant role (user, assistant, system).
        content (str): Plain text conversational turn content.
        timestamp (datetime): Timestamp when message occurred.
    """

    def __init__(
        self,
        role: ChatRole,
        content: str,
        timestamp: Optional[datetime] = None,
    ) -> None:
        """Initializes and validates a ChatMessage entity.

        Args:
            role (ChatRole): Message author role.
            content (str): Text payload.
            timestamp (Optional[datetime]): Timestamp of turn.

        Raises:
            DomainValidationError: If content is empty or role invalid.
        """
        if not content or not content.strip():
            raise DomainValidationError("Message content cannot be empty")

        if not isinstance(role, ChatRole):
            try:
                role = ChatRole(role)
            except ValueError as err:
                raise DomainValidationError(f"Invalid chat role: {role}") from err

        self.role = role
        self.content = content.strip()
        self.timestamp = timestamp or datetime.now(timezone.utc)


class ChatSession:
    """Domain aggregate root representing a multi-turn conversation session.

    Attributes:
        session_id (str): Unique conversational session identifier.
        messages (List[ChatMessage]): Ordered sequence of conversational turns.
    """

    def __init__(self, session_id: str, messages: Optional[List[ChatMessage]] = None) -> None:
        """Initializes a ChatSession.

        Args:
            session_id (str): Unique session identifier.
            messages (Optional[List[ChatMessage]]): Prior conversational turns.

        Raises:
            DomainValidationError: If session_id is blank.
        """
        if not session_id or not session_id.strip():
            raise DomainValidationError("Session ID cannot be empty")

        self.session_id = session_id.strip()
        self.messages: List[ChatMessage] = messages or []

    def append_message(self, message: ChatMessage) -> None:
        """Appends a new turn to the conversational session.

        Args:
            message (ChatMessage): Validated conversational message.
        """
        self.messages.append(message)
