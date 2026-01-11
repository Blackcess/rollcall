import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { studentSemesterEnrollmentService } from "../../../Data Models/ADMIN panel Models/Class Service/studentSemesterEnrollmentService.js";


class StudentSemesterEnrollmentController {

    static #handleError(err, res) {
        if (err instanceof DomainError) {
            return res.status(err.status).json({
                status: false,
                error: {
                    code: err.code,
                    message: err.message
                }
            });
        }

        console.error(err);
        return res.status(500).json({
            status: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "UNEXPECTED SERVER ERROR"
            }
        });
    }

    // enroll student
    static async enrollStudent(req, res) {
        try {
            const { studentId, classId } = req.params;
            const { semesterNumber } = req.body;

            if (!semesterNumber) {
                throw DomainError.invalid("SEMESTER NUMBER IS REQUIRED");
            }

            const enrolledBy = req.user?.id; // from auth middleware

            const enrollment =
            await studentSemesterEnrollmentService.enrollStudent({
                studentId: Number(studentId),
                classId: Number(classId),
                semesterNumber: Number(semesterNumber),
                enrolledBy
            });

            return res.status(201).json({
                status: true,
                data: enrollment
            });
        } catch (err) {
            return StudentSemesterEnrollmentController.#handleError(err, res);
        }
    }

    // complete an active semester
    static async completeSemester(req, res) {
        try {
            const { semesterEnrollmentId } = req.params;

            const result =
                await studentSemesterEnrollmentService.completeSemester({
                    semesterEnrollmentId: Number(semesterEnrollmentId)
                });

            return res.status(200).json({
                status: true,
                data: result
            });
        } catch (err) {
            return StudentSemesterEnrollmentController.#handleError(err, res);
        }
    }
    // get active semester for a student
    static async getActiveSemester(req, res) {
        try {
            const { studentId, classId } = req.params;

            const semester =
            await studentSemesterEnrollmentService.getActiveSemesterForStudent({
                studentId: Number(studentId),
                classId: Number(classId)
            });

            return res.status(200).json({
                status: true,
                data: semester
            });
        } catch (err) {
            return StudentSemesterEnrollmentController.#handleError(err, res);
        }
    }

    // list semester history for a student
    static async listSemesterHistory(req, res) {
        try {
            const { studentId, classId } = req.params;

            const semesters =
            await studentSemesterEnrollmentService.listSemesterHistory({
                studentId: Number(studentId),
                classId: Number(classId)
            });

            return res.status(200).json({
                status: true,
                data: semesters
            });
        } catch (err) {
            return StudentSemesterEnrollmentController.#handleError(err, res);
        }
    }







}

export { StudentSemesterEnrollmentController };
