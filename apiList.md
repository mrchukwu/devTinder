# DevTinder API

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /pofile/edit
- PATCH /profile/password

## connectionRequestRounter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

##  userRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed - Gets you the profile of other users on platform

- STATUS: ignore, interested, accepted, rejected