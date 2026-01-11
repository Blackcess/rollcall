import { DomainError } from "../Domain Errors/Grades Module Errors/domainErrors.js";

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return next(
        DomainError.invalid("USER CONTEXT NOT AVAILABLE")
      );
    }

    const hasRole = req.user.roles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return next(
        DomainError.invalid(
          "INSUFFICIENT PERMISSIONS",
          // "FORBIDDEN",
          403
        )
      );
    }

    return next();
  };
}