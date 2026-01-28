// SOFIE LLaMA API schema documentation
// Request:
// POST http://127.0.0.1:8080/v1/chat/completions
// Content-Type: application/json
// Body:
// {
//   "prompt": "string", // User's message or query
//   "user": { ... },     // Optional user profile/context
//   ...other context fields
// }
//
// Response:
// {
//   "choices": [
//     {
//       "message": {
//         "role": "assistant",
//         "content": "string" // SOFIE's reply
//       }
//     }
//   ],
//   ...other metadata
// }
//
// Error:
// {
//   "error": "string" // Error message
// }
