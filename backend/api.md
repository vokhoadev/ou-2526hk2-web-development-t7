

curl -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type:application/json" \
    -d "{\"username\":\"abcd\",\"email\":\"abcd@gmail.com\", \"password\":\"password123\"}"

curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type:application/json" \
    -d "{\"usernameOrEmail\":\"abcd\", \"password\":\"password123\"}" | jq .

    http://localhost:8080/h2-console/

    http://localhost:8080/swagger-ui.html