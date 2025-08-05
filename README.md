För autentisering (authRoutes):

POST /api/auth/register - För registrering av användare.
POST /api/auth/login - För inloggning av användare.
GET /api/auth/ - Hämta alla användare (authMiddleware krävs).
GET /api/auth/:id - Hämta en specifik användare med ID (authMiddleware krävs).
PUT /api/auth/:id - Uppdatera en användare med ID (authMiddleware krävs).
DELETE /api/auth/:id - Ta bort en användare med ID (authMiddleware krävs).


För bloggposter (BloggRoutes):

GET	/api/blogg	Hämta alla bloggposter
GET	/api/blogg/:id	Hämta en specifik bloggpost (kräver authMiddleware)
PUT	/api/blogg/:id	Uppdatera en bloggpost
DELETE	/api/blogg/:id	Radera en bloggpost (kräver authMiddleware)

