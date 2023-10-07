# Lifeline_backend

An engaging educational game designed to raise awareness about best safety practices during natural disasters

# hng-task2
A simple Rest API which performs CRUD operations on users resource.

<!-- Back to Top Navigation Anchor -->

<a name="readme-top"></a>

### Built With:

- JavaScript
- Node
- Express
- MongoDB


---

<!-- Task Requirements -->

## Requirements

<details>

<summary> <strong>Task Requirements</strong> </summary>

- [x] Functional REST API: The API should successfully perform all CRUD operations.
- [x] Modelling Diagrams: Clear and accurate UML and E-R diagrams should be provided.
- [x] Effective Testing: You should successfully test all the CRUD operations exhaustively.
- [x] Dynamic Parameter Handling: The API should correctly handle and respond to different parameters provided.
- [x] GitHub Repository: Repository should be well-organized, contain all necessary files, and be publicly accessible.
- [x] Detailed Documentation: Documentation should provide clear guidance on how to use the API, including setup, request/response formats, and sample usage.

<p align="right"><a href="#readme-top">back to top</a></p>

---

</details>

<br>

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

- https://localhost:8080/api/v1

### user signup

- Route: /auth/signup
- Method: POST

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

<p align="right"><a href="#readme-top">back to top</a></p>





