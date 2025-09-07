// Authentication API Test Script
// Run these commands in order to test the authentication system

console.log("🔐 Authentication API Test Guide");
console.log("================================");

console.log("\n1. First, run the migration to add auth columns:");
console.log("curl -X POST http://localhost:3000/api/migrate");

console.log("\n2. Register a new user:");
console.log(`curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "age": 30
  }'`);

console.log("\n3. Login with the user:");
console.log(`curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'`);

console.log("\n4. Get user profile (replace TOKEN with the token from login):");
console.log(`curl -X GET http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer TOKEN"`);

console.log("\n5. Update profile:");
console.log(`curl -X PUT http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Smith",
    "age": 31
  }'`);

console.log("\n6. Change password:");
console.log(`curl -X POST http://localhost:3000/api/auth/change-password \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'`);

console.log("\n7. Refresh token (replace REFRESH_TOKEN):");
console.log(`curl -X POST http://localhost:3000/api/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{
    "refreshToken": "REFRESH_TOKEN"
  }'`);

console.log("\n8. Logout:");
console.log(`curl -X POST http://localhost:3000/api/auth/logout \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "refreshToken": "REFRESH_TOKEN"
  }'`);

console.log("\n9. Request password reset:");
console.log(`curl -X POST http://localhost:3000/api/auth/forgot-password \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com"
  }'`);

console.log("\n10. Reset password with token (check server logs for token):");
console.log(`curl -X POST http://localhost:3000/api/auth/reset-password \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "RESET_TOKEN_FROM_LOGS",
    "password": "NewPassword456",
    "confirmPassword": "NewPassword456"
  }'`);

console.log("\n📝 Available Auth Endpoints:");
console.log("• POST /api/auth/register - Register new user");
console.log("• POST /api/auth/login - Login user");
console.log("• POST /api/auth/logout - Logout user");
console.log("• POST /api/auth/refresh - Refresh JWT token");
console.log("• GET  /api/auth/profile - Get current user profile");
console.log("• PUT  /api/auth/profile - Update current user profile");
console.log("• POST /api/auth/change-password - Change password");
console.log("• POST /api/auth/forgot-password - Request password reset");
console.log("• POST /api/auth/reset-password - Reset password with token");

console.log("\n🔒 Security Features:");
console.log("• Password hashing with bcrypt");
console.log("• JWT token authentication");
console.log("• Refresh token rotation");
console.log("• Rate limiting on sensitive endpoints");
console.log("• Input validation");
console.log("• SQL injection protection");
console.log("• CORS and security headers");

console.log("\n🎯 Next Steps:");
console.log("1. Run the migration");
console.log("2. Test user registration");
console.log("3. Test login/logout");
console.log("4. Create frontend auth components");
console.log("5. Protect existing user endpoints");
