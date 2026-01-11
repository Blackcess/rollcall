import { connection } from "../database connections/databaseConnect.js";
import { DomainError } from "../Domain Errors/Grades Module Errors/domainErrors.js";


export async function attachUserRoles(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      // Authentication layer responsibility — not ours
      return next();
    }

    const [rows] = await connection.query(
      `
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = ?
      `,
      [req.user.id]
    );

    req.user.roles = rows.map(r => r.name);

    return next();
  } catch (error) {
    return next(
       DomainError.invalid(
        "FAILED TO LOAD USER ROLES",
        "AUTH_CONTEXT_ERROR",
        500
      )
    );
  }
}