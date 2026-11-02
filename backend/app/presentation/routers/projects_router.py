"""FastAPI router handling Project entity CRUD operations."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.application.dtos.project_dto import (
    ProjectCreateDTO,
    ProjectUpdateDTO,
    ProjectResponseDTO,
)
from app.application.use_cases.project_use_cases import ProjectUseCases
from app.presentation.dependencies import get_project_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import EntityNotFoundException, DomainValidationError

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectResponseDTO])
async def list_projects(
    use_cases: ProjectUseCases = Depends(get_project_use_cases),
) -> List[ProjectResponseDTO]:
    """Public endpoint retrieving all portfolio projects."""
    return await use_cases.list_projects()


@router.get("/{project_id}", response_model=ProjectResponseDTO)
async def get_project(
    project_id: str,
    use_cases: ProjectUseCases = Depends(get_project_use_cases),
) -> ProjectResponseDTO:
    """Public endpoint retrieving single project by ID."""
    try:
        return await use_cases.get_project(project_id)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err


@router.post("", response_model=ProjectResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_project(
    dto: ProjectCreateDTO,
    use_cases: ProjectUseCases = Depends(get_project_use_cases),
    _admin: None = Depends(get_current_admin),
) -> ProjectResponseDTO:
    """Protected endpoint creating a new portfolio project."""
    try:
        return await use_cases.create_project(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.put("/{project_id}", response_model=ProjectResponseDTO)
async def update_project(
    project_id: str,
    dto: ProjectUpdateDTO,
    use_cases: ProjectUseCases = Depends(get_project_use_cases),
    _admin: None = Depends(get_current_admin),
) -> ProjectResponseDTO:
    """Protected endpoint modifying an existing project."""
    try:
        return await use_cases.update_project(project_id, dto)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
async def delete_project(
    project_id: str,
    use_cases: ProjectUseCases = Depends(get_project_use_cases),
    _admin: None = Depends(get_current_admin),
) -> dict:
    """Protected endpoint removing a project."""
    try:
        await use_cases.delete_project(project_id)
        return {"success": True, "message": f"Project '{project_id}' deleted successfully."}
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
