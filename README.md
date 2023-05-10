# jira-connector
## Install packages
npm install
## Compile with
npm run build
## Run HTTPS resquet
npm run nodehttp --atlassianEmail=args1 --atlassianToken=args2 --baseUrl=args3

Il faut remplacer :
- args1 par l'email utiliser pour créer le compte attlasian. Ex: nom@gmail.com
- args2 par le token créer sur Jira précédement.
- args3 par le nom du site atlassian. Ex: https://nomdusite.atlassian.net
## Run webhook on port 3000
npm run node
