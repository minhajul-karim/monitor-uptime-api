# Monitor Website uptime

## Table of Contents

- [How to run](#how-to-run)
- [Create User](#create-user)
- [Read User](#read-user)
- [Update User](#update-user)
- [Delete User](#delete-user)

<!-- HOW TO RUN -->

## How to run

Please follow the below instructions to run this project in your machine:

1. Install dependencies
   ```sh
   pnpm install
   ```
2. Run the app
   ```sh
   pnpm run dev
   ```
3. Your app should be available in http://localhost:3000

## REST API to CRUD users
### Create User
#### Request
```
POST http://localhost:3000/users
```
#### Payload
```
{"firstName": "Mr", "lastName": "Karim", "phone": "01711091062", "password": "12345", "tosAgreement": false }
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Something went wrong. The user may already exist"
}
```
**Or**
`Status: 201 Created`
```
{
    "message": "User created"
}
```

### Read User
#### Request
```
GET http://localhost:3000/users?phone=01711091061
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Something went wrong. Could not find user"
}
```
**Or**
`Status: 200 OK`
```
{
    "user": {
        "firstName": "Mr",
        "lastName": "Karim",
        "phone": "01711091062",
        "password": "7571408e70935dbc6a828cb6369572e1",
        "tosAgreement": false
    }
}
```
### Update User
#### Request
```
PUT http://localhost:3000/users
```
#### Payload
```
{"firstName": "Muaz", "lastName": "Abdullah", "phone": "01711091062", "password": "abcdefg", "tosAgreement": true }
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Something went wrong. Could not update the user"
}
```
**Or**
`Status: 200 OK`
```
{
    "message": "User updated"
}
```
### Delete User
#### Request
```
DELETE http://localhost:3000/users?phone=01711091061
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Something went wrong. Could not delete user"
}
```
**Or**
`Status: 200 OK`
```
{
    "message": "User deleted"
}
```
## REST API to CRUD tokens
### Create Token
#### Request
```
POST http://localhost:3000/token
```
#### Payload
```
{"phone": "01779898372", "password": "12345"}
```
#### Response
`Status: 201 Created`
```
{
    "message": "Token created"
}
```
**Or**
#### Payload
```
{"phone": "0177989837200", "password": "12345"}
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Something went wrong. Please check if the user exists or the token may already exists"
}
```

### Read Token
#### Request
```
GET http://localhost:3000/token?id=1ba281e35ce83cb
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Bad request. Please provide a valid token."
}
```
**Or**
#### Request
```
GET http://localhost:3000/token?id=1ba281e35ce83cb00003
```
`Status: 200 OK`
```
{
    "token": {
        "id": "1ba281e35ce83cb00003",
        "phone": "01779898372",
        "expirationTime": 1736657694552
    }
}
```
### Update Token
#### Request
```
PUT http://localhost:3000/token
```
#### Payload
```
{"id": "1ba281e35ce83cb", "extend": true}
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Bad request. Please provide a valid token id and extend."
}
```
**Or**
#### Payload
```
{"id": "1ba281e35ce83cb00003", "extend": true}
```
`Status: 200 OK`
```
{
    "message": "Token updated."
}
```
### Delete Token
#### Request
```
DELETE http://localhost:3000/token?id=1ba281e35ce83cb
```
#### Response
`Status: 400 Bad Request`
```
{
    "message": "Bad request. Please check the token ID."
}
```
**Or**
#### Request
```
GET http://localhost:3000/token?id=1ba281e35ce83cb00003
```
`Status: 200 OK`
```
{
    "message": "Token deleted."
}
```