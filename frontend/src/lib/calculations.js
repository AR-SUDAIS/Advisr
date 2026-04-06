export const getGradePoint = (grade) => {
    const gradeMap = {
        'O': 10,
        'A+': 9,
        'A': 8,
        'B+': 7,
        'B': 6,
        'C': 5,
        'F': 0
    };
    return gradeMap[grade] !== undefined ? gradeMap[grade] : 0;
};

export const calculateSGPA = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
        const points = getGradePoint(sub.grade);
        totalPoints += points * sub.credits;
        totalCredits += sub.credits;
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
};

export const calculateCGPA = (history) => {
    if (!history || history.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;
    const processedSubjects = new Map();

   

    history.forEach(sem => {
        sem.subjects.forEach(sub => {
            if (sub.grade === 'F') {
                
                return;
            }

            

            processedSubjects.set(sub.code, {
                points: getGradePoint(sub.grade) * sub.credits,
                credits: sub.credits
            });
        });
    });

    processedSubjects.forEach(sub => {
        totalPoints += sub.points;
        totalCredits += sub.credits;
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
};
