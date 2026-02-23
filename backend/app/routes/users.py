from fastapi import APIRouter, Depends, HTTPException, Body
from app.auth import get_current_user
from app.models import StudentResponse, Subject
from app.database import db
from typing import List

router = APIRouter()

@router.get("/users/me", response_model=StudentResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/users/me/subjects", response_model=List[Subject])
async def get_current_subjects(current_user: dict = Depends(get_current_user)):
    # Find the current semester object in the user's semesters list
    # If it exists, return its subjects. Else return empty list.
    
    current_sem_num = current_user.get("current_semester", 1)
    semesters = current_user.get("semesters", [])
    
    for sem in semesters:
        if sem['semester_number'] == current_sem_num:
            return sem['subjects']
            
    # If current semester not found in list (e.g. new semester), return empty
    return []

@router.post("/users/me/subjects", response_model=List[Subject])
async def add_subject(subject: Subject, current_user: dict = Depends(get_current_user)):
    current_sem_num = current_user.get("current_semester", 1)
    semesters = current_user.get("semesters", [])
    
    # Check if the current semester exists in the list
    sem_index = -1
    for i, sem in enumerate(semesters):
        if sem['semester_number'] == current_sem_num:
            sem_index = i
            break
            
    if sem_index == -1:
        # Create new semester entry if it doesn't exist
        new_semester = {
            "semester_number": current_sem_num,
            "subjects": [subject.model_dump()],
            "sgpa": None
        }
        await db.students.update_one(
            {"_id": current_user["_id"]},
            {"$push": {"semesters": new_semester}}
        )
        return [subject]
    else:
        # Append to existing semester
        await db.students.update_one(
            {"_id": current_user["_id"], "semesters.semester_number": current_sem_num},
            {"$push": {"semesters.$.subjects": subject.model_dump()}}
        )
        
        # Return updated list
        # We need to fetch the updated user or just return what we expect
        return semesters[sem_index]['subjects'] + [subject]

@router.post("/users/me/complete-semester")
async def complete_semester(grades: dict = Body(...), current_user: dict = Depends(get_current_user)):
    # grades is a dict of subject_code: grade
    current_sem_num = current_user.get("current_semester", 1)
    semesters = current_user.get("semesters", [])
    
    sem_index = -1
    for i, sem in enumerate(semesters):
        if sem['semester_number'] == current_sem_num:
            sem_index = i
            break
            
    if sem_index == -1:
         raise HTTPException(status_code=400, detail="No subjects found for current semester")
    
    # Update grades in the subjects of the current semester
    current_subjects = semesters[sem_index]['subjects']
    updated_subjects = []
    failed_subjects = []
    
    for sub in current_subjects:
        if sub['code'] in grades:
            grade = grades[sub['code']]
            sub['grade'] = grade
            if grade == 'F':
                # Create a copy for the next semester, reset grade
                failed_sub = sub.copy()
                failed_sub['grade'] = None
                failed_subjects.append(failed_sub)
        updated_subjects.append(sub)
        
    # Update current semester with grades
    await db.students.update_one(
        {"_id": current_user["_id"], "semesters.semester_number": current_sem_num},
        {"$set": {"semesters.$.subjects": updated_subjects}}
    )
    
    next_semester_num = current_sem_num + 1

    # If there are failed subjects, add them to the next semester immediately
    # We also need to Initialize the next semester if it doesn't exist?
    # Usually, the next semester starts empty until user adds subjects.
    # But here we are forcing failed subjects into it.
    
    if failed_subjects:
        # Check if next semester exists (unlikely if we just finished current, but possible if pre-planned)
        next_sem_index = -1
        for i, sem in enumerate(semesters):
            if sem['semester_number'] == next_semester_num:
                next_sem_index = i
                break
        
        if next_sem_index != -1:
            # Push failed subjects to existing next semester
            await db.students.update_one(
                {"_id": current_user["_id"], "semesters.semester_number": next_semester_num},
                {"$push": {"semesters.$.subjects": {"$each": failed_subjects}}}
            )
        else:
            # Create new semester with failed subjects
            new_semester = {
                "semester_number": next_semester_num,
                "subjects": failed_subjects,
                "sgpa": None
            }
            await db.students.update_one(
                {"_id": current_user["_id"]},
                {"$push": {"semesters": new_semester}}
            )

    # Increment current_semester
    await db.students.update_one(
        {"_id": current_user["_id"]},
        {"$inc": {"current_semester": 1}}
    )
    
    return {"message": "Semester completed successfully", "next_semester": next_semester_num, "failed_carried_forward": len(failed_subjects)}

@router.get("/users/me/history")
async def get_academic_history(current_user: dict = Depends(get_current_user)):
    return current_user.get("semesters", [])
