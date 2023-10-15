# Process of JWT

we have different routes
get - all emp
post- new emp
put - update emp
del - delete emp

# Workflow

## Authentication

1. we get username and password from request headers(when user sends login post request)
2. we compare password when user is found in database
3. if vaild, generate two tokens
   - access token, refresh token (using our secret token keys stored in env)
   - `jwt.sign(payload, secretOrPrivateKey, [options, callback])` method used to create a new key
4. then we attach a refresh token to the current authenticated user and store the updated object of current user with all other users in our DB
5. backend creates a cookie containing the refresh token. `res.cookie("name/id",payload(refreshtoken),{options})`
6. backend sends an access token to the frontend so that using that access token,[after verification of JWT] user can access the protected routes.
- refresh token is used to generate new access token, so we send refresh token as cookie (hidden) and access token to the user.

## Generate a refresh token after authentication

1. get cookie that contains the refresh token generated when user authenticated
2. also find that user in DB by searching refresh token
3. now verify refresh token obtained from cookie with the REFRESH_TOKEN_KEY stored in env , `jwt.verify(token, secretOrPrivateKey, [ callback ])`
4. in callback we generate a new access token and send it as a json response
   `acesstoken = jwt.sign({ jsonPayload(username) }, ACCESS_TOKEN_KEY, { options })`

## Verification of JWT
1. check the request header , it contains the access token sent by the auth request,
2. if token is present verify it using our secret access token key stored in env
    `jwt.verify(token,ACCESS_TOKEN_KEY, (err, decoded) => {callback})`
3. if its correct then decode the jsonPayload and use decoded payload{username}, if not then sendStatus(403) forbidden

## Logout functionality



## timeline
user ------> authentication page    ---------------------------->   refresh page ---------------------------------------------------> verify JWT
             enters username,pass                          check cookie for ref token         (sends new action token        extract token from req header
            (creates a cookie                                verify it with env.RT_KEY           for verification)            verify it using SECRET_ACC_TOKEN env 
        JWT containing refresh token)                         genrate new access token                                       sets credentials of verified user sent
                                                               with user credentials                                         by refresh page along with acc token