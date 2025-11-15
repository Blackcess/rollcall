// create a class for storing all class syllabus infgormation

class ClassSyllabus {
    constructor(id,name){
        this.subject_name= name;
        this.subject_id = id;
        this.modules=[];
        this.outcomes=[];
    }
    addModule(mod){
        this.modules.push(mod)
    }
    addOutcome(mod){
        this.outcomes.push(mod)
    }
}


class CourseModules{
    constructor(name){
        this.module_name=name;
        this.parent_course="";
        this.module_title="";
        this.module_elements=[];
        this.module_duration="";
    }
    addModuleElement(element){
        if(!element || element===""){
            return
        }
        this.module_elements.push(element)
    }
    parentCourse(course){
        this.parent_course= course;
    }
    moduleTitle(title){
        this.module_title= title;
    }
    moduleDuration(time){
        this.module_duration= time;
    }
}

class CourseOutcomes{
    constructor(id,course){
        this.parent_course= course;
        this.outcome_id = id;
        this.outcome_body= [];
    }
    addOutcome(outcome){
        this.outcome_body.push(outcome)
    }
}

export {ClassSyllabus,CourseOutcomes,CourseModules}