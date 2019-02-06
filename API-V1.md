API V1 Documentation
====================

Table of Contents
-----------------

*   [Common Specifications](#common-specifications)

*   [Authentication](#authentication)
    *   [Create](#authenticationcreate)
    *   [Login](#authenticationlogin)
    *   [Activate](#authenticationactivate)

*   [Announcement](#announcement)

*   [Group](#group)

*   [User](#user)
    *   [Profile](#userprofile)

*   [Push Notifications](#push-notifications)

Common Specifications
---------------------

### HTTP Status codes

The following HTTP status codes are returned by the API

| Status Code | Description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| 200         | Request successful                                                                        |
| 202         | Request has been accepted for further processing, which will be completed sometime later. |
| 400         | Problem with the request                                                                  |
| 401         | Valid JWT token is not specified                                                          |
| 405         | Request method is invalid                                                                 |
| 500         | Error on the internal server                                                              |

### Response Structure

The following JSON data is returned in the response body

| Property         | Type   | Description                                                                   |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| status           | String | Give the result of the request that it's success or not                       |
| code             | Number | Request status code. Note that this code does not related to HTTP status code |
| response.message | String | Result summary                                                                |
| response.data    | Object | (Optional) Provide useful data for processing                                 |

Authentication
--------------

### Authentication/Create

Create non-activated user

**HTTP request**

`POST /api/v1/auth/create`

**Request headers**

| Request header | Description      |
| -------------- | ---------------- |
| Content-Type   | application/json |

**Request body**

| Property | Type   | Required | Description       |
| -------- | ------ | -------- | ----------------- |
| user     | String | Required | Username (unique) |
| pass     | String | Required | Password          |

**Response**

Returns a 200 HTTP status code and a JSON object with the following data.

| Property                          | Type   | Description                        |
| --------------------------------- | ------ | ---------------------------------- |
| response.data.user.activation.ref | String | Reference code for user activation |

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "user created",
    "data": {
      "user": {
        "activation": {
          "ref": "30st2lkt"
        }
      }
    }
  }
}
```
</details>

### Authentication/Login

Request authenticated JWT token

**HTTP request**

`POST /api/v1/auth/login`

**Request headers**

| Request header | Description      |
| -------------- | ---------------- |
| Content-Type   | application/json |

**Request body**

| Property | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| user     | String | Required | Username    |
| pass     | String | Required | Password    |

**Response**

Returns a 200 HTTP status code and a JSON object with the following data.

| Property                | Type   | Description                                   |
| ----------------------- | ------ | --------------------------------------------- |
| response.data.token     | String | JWT token which being used for authentication |
| response.data.user.id   | String | User ID                                       |
| response.data.user.user | String | Username                                      |

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "authenticated",
    "data": {
      "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cC...",
      "user": {
        "id": "5c4ddcd75dfafe51104f6521",
        "user": "rayriffy"
      }
    }
  }
}
```
</details>

### Authentication/Activate

Acticate user

**HTTP request**

`POST /api/v1/auth/activate`

**Request headers**

| Request header | Description       |
| -------------- | ----------------- |
| Content-Type   | application/json  |
| Authorization  | JWT `{JWT token}` |

**Request body**

| Property | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| ref      | String | Required | Activation reference code |

**Response**

Returns a 200 HTTP status code and a JSON object with empty data.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "user activated"
  }
}
```
</details>

Announcement
------------

TBA

Group
-----

TBA

User
----

### User/Profile

Retrive user profile

**HTTP request**

`GET /api/v1/user/profile`

**Request headers**

| Request header | Description       |
| -------------- | ----------------- |
| Authorization  | JWT `{JWT token}` |

**Response**

Returns a 200 HTTP status code and a JSON object.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "data": {
      "user": {
        "id": "5c4ddcd75dfafe51104f6521",
        "user": "rayriffy",
        "role": "administrator",
        "activation": {
          "isActivated": true,
          "ref": "ozch8fdg"
        }
      }
    }
  }
}
```
</details>

Push Notifications
------------------

TBA
