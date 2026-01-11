import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";
export function handle(err, res) {
  console.error(err)
  if (err instanceof DomainError) {
    return res.status(err.status).json({
      status: false,
      error: err.code,
      message: err.message
    });
  }
  console.error(err);
  return res.status(500).json({
    status: false,
    error: "INTERNAL_SERVER_ERROR"
  });
}
