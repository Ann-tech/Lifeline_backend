# Lifeline_backend

An engaging educational game designed to raise awareness about best safety practices during natural disasters

<!-- Back to Top Navigation Anchor -->

<a name="readme-top"></a>

### Built With:

- JavaScript
- Node
- Express
- MongoDB

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/)

#### Test
- postman collection can be found [here]() 


<!-- Back to Top Navigation Anchor -->

<a name="readme-top"></a>

#### Install project dependencies

```sh
npm install
```

#### Update .env with 
- MONGODB_URI
- PORT

#### Run a development server

```sh
npm run dev
```

### Models

#### User

| field      | data_type     | constraints      |
| ---------  | ------------- | ---------------- |
| first_name | string        | required         |
| last_name  | string        | required         |
| username   | string        | required, unique |
| email      | string        | required, unique |
| password   | string        | required         |


## Usage

### Base URL

- https://lifeline-1zrj.onrender.com

### user signup

- Route: /auth/signup
- Method: POST

- url: https://lifeline-1zrj.onrender.com/api/v1/auth/signup

:point_down: Body

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "username": "doe",
    "email": "doe@gmail.com",
    "password": "doe",
}
```

:point_down: Response

```json
{
  "success": true,
  "message": "user successfully created"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### user login

- Route: /auth/login
- Method: POST

- url: https://lifeline-1zrj.onrender.com/api/v1/auth/login

:point_down: Body

```json
{
    "username": "doe",
    "password": "doe",
}
```

:point_down: Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "token",
  "username": "doe"
}
```

### Signup / signin with google

- Route: /auth/google
- Method: GET

- url: https://lifeline-1zrj.onrender.com/api/v1/auth/google

:point_down: Response

- username will only be included in the response if it exists

```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "token"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Get user profile

- Route: /profile
- Method: GET
- Header
  - Authorization: Bearer {token}

- url: https://lifeline-1zrj.onrender.com/api/v1/profile

:point_down: Response

```json
{
  "success": true,
  "user": {
    "first_name": "doe",
    "last_name": "doe",
    "username": "doe",
    "email": "doe@gmail.com"
  }
}
```

### Update user profile

- Route: /profile
- Method: PUT
- Header
  - Authorization: Bearer {token}

- url: https://lifeline-1zrj.onrender.com/api/v1/profile

:point_down: Body

- users can update their choose to update their first name, last name or username

```json
{
    "first_name": "doe1",
    "last_name": "doe1",
    "username": "doe1"
}
```

:point_down: Response

```json
{
  "success": true,
  "message": "profile successfully updated",
  "user": {
    "first_name": "doe1",
    "last_name": "doe1",
    "username": "doe1"
  }
}
```

### Leaderboard

- Route: /leaderboard
- Method: GET
- Header
  - Authorization: Bearer {token}

- url: https://lifeline-1zrj.onrender.com/api/v1/leaderboard

:point_down: Response

```json
[
    {
        "scores": {
            "tornadoGame": {
                "score": 2000
            }
        },
        "username": "scar"
    },
    {
        "scores": {
            "tornadoGame": {
                "score": 1500
            }
        },
        "username": "ben"
    }
]
```

### Establish socket connection on the client

```
let socket = io('https://lifeline-1zrj.onrender.com', {
            extraHeaders: {
                Authorization: "Bearer token",
    }});
```

### To get next prompt - Emit a getNextPrompt event

```
socket.emit('getNextPrompt', promptInfo)

//if promptType is a question prompt
promptInfo = {title, promptType, text, score}

//for other promptTypes
promptInfo = {title, score, promptType}
```


<p align="right"><a href="#readme-top">back to top</a></p>

---

<p align="right"><a href="#readme-top">back to top</a></p>





