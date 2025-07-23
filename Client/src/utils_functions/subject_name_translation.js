

function translateName(name){
    var value;
    switch (name) {
        case "Basic_Electrical_Engineering":
            value="BEE"
            break;
        case "Basic_Electrical_Engineering_Lab":
            value="BEE Lab"
            break;
        case "Engineering_Graphics_And_Design":
            value="ED"
            break;
        case "Engineering_Mathematics_1":
            value="Maths-1"
            break;
        case "Engineering_Physics":
            value="physics"
            break;
        case "Engineering_Physics_Lab":
            value="physics Lab"
            break;
        case "Mentoring_And_Proffesional_Development":
            value="Mentoring"
            break;
        case "Engineering_Mathematics_ii":
            value="Math-2"
            break;
        case "Chemistry_1":
            value="Chemistry"
            break;
        case "Chemistry_1_lab":
            value="Chemistry Lab"
            break;
        case "English":
            value="English"
            break;
        case "English_Lab":
            value="English Lab"
            break;
        case "WorkShop":
            value="WorkShop"
            break;
        case "PPS":
            value="PPS"
            break;
        case "PPS_Lab":
            value="PPS Lab"
            break;
        case "Mathematics_3":
            value="Mathematics 3"
            break;
        case "DSA":
            value="DSA"
            break;
        case "OOP":
            value="OOP"
            break;
        case "DSA_Lab":
            value="DSA_Lab"
            break;
        case "OOP_Lab":
            value="OOP_Lab"
            break;
        case "IT_Workshop":
            value="IT_Workshop"
            break;
        case "Digital_Electronics":
            value="Digital_Electronics"
            break;
        case "Digital_Electronics_Lab":
            value="Digital_Electronics_Lab"
            break;
        case "UHV_1":
            value="UHV_1"
            break;
        default:
            value="Unkown"
            break;
    }
    return value;

}
function reverseTranslateName(name){
    var value;
    switch (name) {
        case "BEE":
            value="Basic_Electrical_Engineering"
            break;
        case "BEE Lab":
            value="Basic_Electrical_Engineering_Lab"
            break;
        case "ED":
            value="Engineering_Graphics_And_Design"
            break;
        case "Maths-1":
            value="Engineering_Mathematics_1"
            break;
        case "physics":
            value="Engineering_Physics"
            break;
        case "physics Lab":
            value="Engineering_Physics_Lab"
            break;
        case "Mentoring":
            value="Mentoring_And_Proffesional_Development"
            break;
        case "Math-2":
            value="Engineering_Mathematics_ii"
            break;
        case "Chemistry":
            value="Chemistry_1"
            break;
        case "Chemistry Lab":
            value="Chemistry_1_lab"
            break;
        case "English":
            value="English"
            break;
        case "English Lab":
            value="English_Lab"
            break;
        case "WorkShop":
            value="WorkShop"
            break;
        case "PPS":
            value="PPS"
            break;  
        case "PPS Lab":
            value="PPS_Lab"
            break;  
        case "Mathematics 3":
            value="Mathematics_3"
            break; 
        case "DSA":
            value="DSA"
            break;  
        case "OOP":
            value="OOP"
            break; 
        case "DSA_Lab":
            value="DSA_Lab"
            break;
        case "OOP_Lab":
            value="OOP_Lab"
            break;
        case "IT_Workshop":
            value="IT_Workshop"
            break;
        case "Digital_Electronics":
            value="Digital_Electronics"
            break;
        case "Digital_Electronics_Lab":
            value="Digital_Electronics_Lab"
            break;
        case "UHV_1":
            value="UHV_1"
            break;
        default:
            value="Unkown"
            break;
    }
    return value;

}

export {translateName,reverseTranslateName}