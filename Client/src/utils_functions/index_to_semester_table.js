
function indexToSemesterSubjectsTable(index){
    var value;
    switch (index) {
        case 1:
            value="first_semester_subject"
            break;
        case 2:
            value="second_semester_subject"
            break;
        case 3:
            value="third_semester_subject"
            break;
        case 4:
            value="fifth_sem_subjects"
            break;
        
    
        default:
            value=null;
            break;
    }
    return value;
}
function indexToSemesterStudentTable(index){
    var value;
    switch (index) {
        case 1:
            value="first_sem_result_collection"
            break;
        case 2:
            value="second_sem_result_collection"
            break;
        case 3:
            value="third_sem_result_collection"
            break;
        case 4:
            value="third_sem_result_collection"
            break;
    
        default:
            value=null;
            break;
    }
    return value;

}

export {indexToSemesterSubjectsTable,indexToSemesterStudentTable}