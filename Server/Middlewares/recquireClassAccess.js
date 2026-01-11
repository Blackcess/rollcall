import { DomainError } from "../Domain Errors/Grades Module Errors/domainErrors.js";



export async function requireClassAccess(req, res, next) {
  const { classId } = req.params;
  const user = req.user;

  if (!classId) {
    return next(DomainError.invalid("CLASS ID REQUIRED"));
  }

  // Admin bypass
  if (user.roles.includes("ADMIN")) {
    return next();
  }

  // Teacher scope check
  if (user.roles.includes("TEACHER")) {
    const allowed = await isTeacherAssignedToClass(
      user.id,
      classId
    );

    if (!allowed) {
      return next(
        DomainError.invalid(
          "ACCESS TO CLASS DENIED",
          "FORBIDDEN",
          403
        )
      );
    }

    return next();
  }

  // Student trying to write
  return next(
     DomainError.invalid(
      "WRITE ACCESS DENIED",
      "FORBIDDEN",
      403
    )
  );
}