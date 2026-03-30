class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
// Used to send structured (clean) responses from your backend
// constructor runs when you create an object
// If statusCode < 400 → success = true ✅
// If statusCode ≥ 400 → success = false ❌