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