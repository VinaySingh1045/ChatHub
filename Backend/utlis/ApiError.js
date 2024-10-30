class ApiError extends Error {
    constructor(
        statusCode,                     // HTTP status code (e.g., 400, 404, 500)
        message = "Something went wrong", // Default error message
        errors = [],                     // Array of detailed error messages (if any)
        stack = ""                       // Optional stack trace for debugging
    ) {
        super(message);                  // Calls the parent Error constructor with the message
        this.statusCode = statusCode;    // Sets the HTTP status code
        this.data = null;                // Initializes data as null (could be useful if you want to add more info later)
        this.message = message;          // Sets the error message
        this.success = false;            // Indicates the operation was unsuccessful
        this.errors = errors;            // Stores additional error details
        this.stack = stack;              // Optional stack trace
    }
}

export { ApiError };