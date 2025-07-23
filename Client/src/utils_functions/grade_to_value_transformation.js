function grade_value(grade){
    let modified_grade = grade.toUpperCase()
    var value;
     switch (modified_grade) {
        case "O":
            value= 10;
            break;
        case "S":
            value= 10;
            break;
        case "A+":
            value= 9;
            break;
        case "A":
            value= 8;
            break;
        case "B+":
            value= 7;
            break;
        case "B":
            value= 6;
            break;
        case "C":
            value= 5;
            break;
        case "P":
            value= 4;
            break;
        default:
            value=0;
            break;
     }
     return value;
}
function reverseGrade_value(value){
    var grade;
     switch (value) {
        case 10:
            grade= "O";
            break;
        case 9:
            grade= "A+";
            break;
        case 8:
            grade= "A";
            break;
        case 7:
            grade= "B+";
            break;
        case 6:
            grade= "B";
            break;
        case 5:
            grade= "C";
            break;
        case 4:
            grade= "P";
            break;
        default:
            grade="Fail";
            break;
     }
     
     return grade;
}

export {grade_value,reverseGrade_value}