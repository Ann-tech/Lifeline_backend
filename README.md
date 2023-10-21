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
  "message": "login successful"
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

### Leaderboard

- Route: /leaderboard
- Method: GET

- url: https://lifeline-1zrj.onrender.com/api/v1/leaderboard

:point_down: Response

```json
[
    {
        "scores": {
            "tornadoGameScore": {
                "score": 2000
            }
        },
        "username": "scar"
    },
    {
        "scores": {
            "tornadoGameScore": {
                "score": 1500
            }
        },
        "username": "ben"
    }
]
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

<p align="right"><a href="#readme-top">back to top</a></p>





