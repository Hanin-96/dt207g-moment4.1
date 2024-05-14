# DT207G - Moment 4.1 - API
Detta repository innehåller kod för funktionalitet för autentisering med registrering av användarkonton samt inloggning.
## API Länk
En liveversion av APIet finns tillgänglig på följande URL: https://dt207g-moment4-1.onrender.com/

## Databas
APIet använder NoSQL MongoDB och Mongose. Databasen innehåller följande struktur på data som skapas i ett schema i modulen Mongoose:

```
 username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
```

## Användning av CRUD

| Metod   | Ändpunkt     | Beskrivning                       |
| ------- | ------------ | --------------------------------- |
| GET     | /user        | Hämtar användare, behöver token   |
| POST    | /login       | skapar inloggning för användare, skickar token |
| POST    | /register    | Skapar ny användare        |


POST: /login:
{
 "username" : "username",
 "password" : "password"
}

ger följande svar
```
{
  "response": {
    "message": "user logged in",
    "token": "token"
  }
}
  ```
Token som skickas med är giltig i 1h
