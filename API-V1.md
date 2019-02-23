API V1 Documentation
====================

Table of Contents
-----------------

*   [Common Specifications](#common-specifications)
    *   [HTTP status codes](#http-status-codes)
    *   [Response structure](#response-structure)

*   [Authentication](#authentication)
    *   [Create](#authenticationcreate)
    *   [Login](#authenticationlogin)
    *   [Activate](#authenticationactivate)

*   [Announcement](#announcement)
    *   [Create](#announcementcreate)
    *   [Get](#announcementget)
    *   [List](#announcementlist)

*   [Group](#group)

*   [User](#user)
    *   [Profile](#userprofile)
    *   [Update](#userupdate)

*   [Push Notifications](#push-notifications)
    *   [Send](#pushsend)

*   [Like](#like)
    *   [Add](#likeadd)
    *   [Remove](#likeremove)
    *   [Count](#likecount)
    *   [IsLike](#likeislike)

Common Specifications
---------------------

### HTTP status Codes

The following HTTP status codes are returned by the API

| Status Code | Description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| 200         | Request successful                                                                        |
| 202         | Request has been accepted for further processing, which will be completed sometime later. |
| 400         | Problem with the request                                                                  |
| 401         | Valid JWT token is not specified                                                          |
| 404         | Request / Route is not found                                                              |
| 405         | Request method is invalid                                                                 |
| 500         | Error on the internal server                                                              |

### Response structure

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

| Property                | Type   | Required | Description       |
| ----------------------- | ------ | -------- | ----------------- |
| authentication.user     | String | Required | Username (unique) |
| authentication.pass     | String | Required | Password          |
| profile.fullname        | String | Required | Fullname of user  |

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

| Property                | Type   | Required | Description |
| ----------------------- | ------ | -------- | ----------- |
| authentication.user     | String | Required | Username    |
| authentication.pass     | String | Required | Password    |

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

| Request header | Description                     |
| -------------- | ------------------------------- |
| Content-Type   | application/json                |
| Authorization  | JWT `{Administrator JWT token}` |

**Request body**

| Property            | Type   | Required | Description               |
| ------------------- | ------ | -------- | ------------------------- |
| activation.ref      | String | Required | Activation reference code |

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

### Announcement/Create

Create announcement and notify to devices

**HTTP request**

`POST /api/v1/announce/create`

**Request headers**

| Request header | Description                     |
| -------------- | ------------------------------- |
| Content-Type   | application/json                |
| Authorization  | JWT `{Administrator JWT token}` |

**Request body**

| Property               | Type   | Required | Description                                                           |
| ---------------------- | ------ | -------- | --------------------------------------------------------------------- |
| announce.message.title | String | Required | Announce message title (will also appear as push notification title)  |
| announce.message.body  | String | Required | Announce message body                                                 |
| announce.to            | Array  | Required | Array of subscribed topic push notification to sent                   |

**Response**

Returns a 202 HTTP status code and a JSON object with announcement data.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 202,
  "response": {
    "message": "announce created and being notified to specified users",
    "data": {
      "announce": {
        "id": "sxr409qi6bf7k78n9q1lll7h",
        "date": "2019-02-04T22:44:30.652Z",
        "message": {
          "title": "TPJR",
          "body": "8 + 0.45 = 9 :thinking:"
        },
        "from": "5c4ddcd75dfafe51104f6521",
        "to": ["mwit25", "mwit26", "mwit27"]
      }
    }
  }
}
```
</details>

### Announcement/Get

Get announcement by id

**HTTP request**

`GET /api/v1/announce/get/:id`

**Request headers**

| Request header | Description       |
| -------------- | ----------------- |
| Authorization  | JWT `{JWT token}` |

**Response**

Returns a 200 HTTP status code and a JSON object with announcement data.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "announce data recived",
    "data": {
      "announce": {
        "id": "sxr409qi6bf7k78n9q1lll7h",
        "date": "2019-02-04T22:44:30.652Z",
        "message": {
          "title": "TPJR",
          "body": "8 + 0.45 = 9 :thinking:"
        },
        "from": "5c4ddcd75dfafe51104f6521",
        "to": ["mwit25", "mwit26", "mwit27"]
      }
    }
  }
}
```
</details>

### Announcement/List

List announcements by page (1 - Infinite)

**HTTP request**

`GET /api/v1/announce/list/:page`

**Request headers**

| Request header | Description       |
| -------------- | ----------------- |
| Authorization  | JWT `{JWT token}` |

**Response**

Returns a 200 HTTP status code and a JSON object with announcement data.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "announces data recived",
    "data": {
      "announce": [
        "5c657a1ebbbd7938b4e54689",
        "5c657a1abbbd7938b4e54688",
        "5c657a16bbbd7938b4e54687",
        "5c657a13bbbd7938b4e54686",
        "5c657a0fbbbd7938b4e54685",
        "5c657a0cbbbd7938b4e54684",
        "5c657a07bbbd7938b4e54683",
        "5c657a02bbbd7938b4e54682",
        "5c6579fcbbbd7938b4e54681",
        "5c6579f8bbbd7938b4e54680"
      ]
    }
  }
}
```
</details>

### Announcement/Remove

Remove announcements by id

**HTTP request**

`DELETE /api/v1/announce/remove/:id`

**Request headers**

| Request header | Description                     |
| -------------- | ------------------------------- |
| Authorization  | JWT `{Administrator JWT token}` |

**Response**

Returns a 200 HTTP status code and a JSON object.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "announce sucessfully deleted"
  }
}
```
</details>

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
    "message": "user data recived",
    "data": {
      "user": {
        "id": "5c5afd3c04c0a657148ebe15",
        "authentication": {
          "user": "rayriffy",
          "role": "administrator"
        },
        "activation": {
          "isActivated": true,
          "ref": "30st2lkt"
        },
        "profile": {
          "fullname": "Riffy",
          "school": {
            "generation": 0,
            "room": 0
          }
        }
      }
    }
  }
}
```
</details>

### User/Update

Update user profile

**HTTP request**

`PUT /api/v1/user/update`

**Request headers**

| Request header | Description       |
| -------------- | ----------------- |
| Content-Type   | application/json  |
| Authorization  | JWT `{JWT token}` |

**Request body**

| Property                  | Type   | Required | Description               |
| ------------------------- | ------ | -------- | ------------------------- |
| profile.fullname          | String |          | Updated fullname          |
| profile.school.generation | Number |          | Updated school generation |
| profile.school.room       | Number |          | Updated room number       |

**Response**

Returns a 200 HTTP status code and a JSON object.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 201,
  "response": {
    "message": "user updated",
  },
}
```
</details>

Push Notifications
------------------

### Push/Send

Manually send push notification to topic user

**HTTP request**

`POST /api/v1/push/send`

**Request headers**

| Request header | Description                     |
| -------------- | ------------------------------- |
| Content-Type   | application/json                |
| Authorization  | JWT `{Administrator JWT token}` |

**Request body**

| Property | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| to       | String | Required | Topic users you wish to send |
| title    | String | Required | Notification title           |
| text     | String | Required | Notification body            |

**Response**

Returns a 200 HTTP status code and a JSON object with empty data.

<details>
<summary>JSON</summary>

```json
{
  "status": "success",
  "code": 202,
  "response": {
    "message": "sending push notification to mwit25",
  }
}
```
</details>

Like
----

### Like/Add

Add like to requested id

**HTTP request**

`POST /api/v1/like/:type/add/:id`

**Request params**

| Request params | Description                            |
| -------------- | -------------------------------------- |
| type           | Types of likes (Available: `announce`) |
| id             | ID of that type                        |

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
    "message": "you liked this announce"
  }
}
```
</details>

### Like/Remove

Remove like from requested id

**HTTP request**

`DELETE /api/v1/like/:type/remove/:id`

**Request params**

| Request params | Description                            |
| -------------- | -------------------------------------- |
| type           | Types of likes (Available: `announce`) |
| id             | ID of that type                        |

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
    "message": "you unliked this announce"
  }
}
```
</details>

### Like/Count

Count like from requested id

**HTTP request**

`GET /api/v1/like/:type/count/:id`

**Request params**

| Request params | Description                            |
| -------------- | -------------------------------------- |
| type           | Types of likes (Available: `announce`) |
| id             | ID of that type                        |

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
    "message": "counted this announce",
    "data": {
      "count": 20
    }
  }
}
```
</details>

### Like/IsLike

Check that is user like this requested id or not

**HTTP request**

`GET /api/v1/like/:type/islike/:id`

**Request params**

| Request params | Description                            |
| -------------- | -------------------------------------- |
| type           | Types of likes (Available: `announce`) |
| id             | ID of that type                        |

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
    "message": "here is the result",
    "data": {
      "id": "5c71634482b93779c4fa7728",
      "isLike": true
    }
  }
}
```
</details>

