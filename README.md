# Monitor Website uptime
This API enables users to manage and monitor website or service availability through the following features:

- **CRUD Users:** Create, read, update, and delete user information.
- **CRUD Tokens:** Manage authentication tokens for secure API access.
- **CRUD Checks:** Configure monitoring checks for specific URLs with custom settings.

## Table of Contents

* [How it works](#how-it-works)
* [How to run](#how-to-run)
* [REST API to CRUD users](#rest-api-to-crud-users)
    - [Create User](#create-user)
    - [Read User](#read-user)
    - [Update User](#update-user)
    - [Delete User](#delete-user)
* [REST API to CRUD tokens](#rest-api-to-crud-tokens)
    - [Create Token](#create-token)
    - [Read Token](#read-token)
    - [Update Token](#update-token)
    - [Delete Token](#delete-token)
* [REST API to CRUD checks](#rest-api-to-crud-checks)
    - [Cerate Check](#create-check)
    - [Read Check](#read-check)
    - [Update Check](#update-check)
    - [Delete Check](#delete-check)

## How it works
Checks are JSON files containing monitoring details such as URL, protocol, HTTP method, success status codes, timeout, and status. The system reads these checks every minute, makes network requests to the specified URLs, and evaluates responses against the defined success codes. It updates the status (`up` or `down`) in the check file and sends SMS notifications via Twilio when the status changes (e.g., from `up` to `down` or vice versa).

This ensures real-time monitoring and alerting for critical services.

## How to run

Please follow the below instructions to run this project in your machine:

1. Install dependencies
   ```sh
   pnpm install
   ```
2. Run the app
   ```sh
   pnpm run development
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
### Headers
```
{
    "token": "your-authentication-token"
}
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
### Headers
```
{
    "token": "your-authentication-token"
}
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
### Headers
```
{
    "token": "your-authentication-token"
}
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
============
============
## REST API to CRUD checks
### Create Check
#### Request
```
POST http://localhost:3000/check
```
### Header
```
{ token: your-token }
```
#### Payload
```
{
    "protocol": "http",
    "url": "facebook.com",
    "method": "get",
    "successCodes": [200],
    "timeoutSeconds": 4
}
```
#### Response
`Status: 201 Created`
```
{
    "message": "Check ceated."
}
```
### Read Check
#### Request
```
GET http://localhost:3000/check?id=a6d8ecb143
```
### Header
```
{ token: your-token }
```
#### Response
`Status: 200 OK`
```
{
    "check": {
        "id": "a6d8ecb143",
        "protocol": "http",
        "url": "facebook.com",
        "method": "get",
        "successCodes": [
            200
        ],
        "timeoutSeconds": 4
    }
}
```
### Update Check
#### Request
```
PUT http://localhost:3000/check
```
#### Payload
```
{
    "id": "a6d8ecb143",
    "protocol": "https",
    "url": "booble.com",
    "method": "put",
    "successCodes": [301, 201],
    "timeoutSeconds": 5
}
```
**At this moment, the maximum value of timeoutSeconds can be 5.**
#### Response
`Status: 200 OK`
```
{
    "message": "Check updated."
}
```
### Delete Check
#### Request
```
DELETE http://localhost:3000/check?id=a6d8ecb143
```
#### Response
`Status: 200 OK`
```
{
    "message": "Check deleted."
}
```