// export {ClassSyllabus,CourseOutcomes,CourseModules}
import { ClassSyllabus, CourseModules, } from "./individualClassDataStructure.js"

// Software Engineering
let softwareEngineeringSyllabus = new ClassSyllabus(10,"Software Engineering","BTCS 503-18")
let SE_modules= new CourseModules("Module 1");
SE_modules.moduleTitle("")
let mod_el= [`Evolution and impact of Software engineering`, `software life cycle models: Waterfall,
prototyping, Evolutionary, and Spiral models.`,`Feasibility study`, `Functional and Non-functional
requirements`, `Requirements gathering`, `Requirements analysis and specification`]
for(const el in mod_el){
    SE_modules.addModuleElement(el)
}
softwareEngineeringSyllabus.addModule(SE_modules)


console.log(softwareEngineeringSyllabus)
