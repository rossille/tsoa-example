curl -v 'http://localhost:3000/api/users' -w "\n"

curl -v -X POST -H "Content-Type: application/json" -w "\n" \
  -d '{"firstName": "Tina", "lastName": "Arena"}' \
  'http://localhost:3000/api/users'

curl -v -X POST -H "Content-Type: application/json" -w "\n" \
  -d '{"bad": "payload"}' \
  'http://localhost:3000/api/users'
