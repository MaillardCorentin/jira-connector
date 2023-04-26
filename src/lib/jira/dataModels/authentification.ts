export interface Oauth2 {
    clientID: string; // si on met clientID? ça veut dire que c'est optionnel ici c'est obligatoire.
    clientSecret: string;
    accessToken: string;
    cloudID: string;
    expiresIn: number;
}
