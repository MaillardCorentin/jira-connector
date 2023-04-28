import express from 'express';
import bodyParser from 'body-parser';
import axios, { AxiosResponse } from 'axios';
import { createLogger } from '../lib/logger';

const loggerWebhook = createLogger('./log/webhook.json');
const app = express();
app.use(bodyParser.json());
// Définir l'URL pour le webhook
const webhookUrl = '/';

// req.body.worklog.author.displayName,

// req.body.worklog.issueId
// req.body.worklog.author.accountId
// req.body.worklog.updateAuthor.accountId
// req.body.worklog.comment,
// req.body.worklog.timeSpentSeconds,
// req.body.worklog.started
// req.body.worklog.updated
// {
//   issueId: req.body.worklog.issueId,
//   accountId: req.body.worklog.author.accountId,
//   started: req.body.worklog.started,
// }

// Définir le gestionnaire de route pour le webhook
app.post(webhookUrl, (req, res) => {
  console.log(req.body.webhookEvent);
  // console.log("Requête reçue depuis le webhook : ", req.body);
  switch (req.body.webhookEvent) {
    case 'worklog_created': {
      loggerWebhook.info({
        issueId: req.body.worklog.issueId,
        accountId: req.body.worklog.updateAuthor.accountId,
        comment: req.body.worklog.comment,
        timeSpentSeconds: req.body.worklog.timeSpentSeconds,
        started: req.body.worklog.started,
        updated: req.body.worklog.updated,
      });
      console.log(req.body.worklog);
      axios.post('http://localhost:8080/api/v1/jira/worklog/', {
        issueId: req.body.worklog.issueId,
        accountId: req.body.worklog.updateAuthor.accountId,
        comment: req.body.worklog.comment,
        timeSpentSeconds: req.body.worklog.timeSpentSeconds,
        started: req.body.worklog.started,
        updated: req.body.worklog.updated,
      });
      break;
    }
    case 'worklog_updated': {
      loggerWebhook.info('Worklog updated :', {
        issueId: req.body.worklog.issueId,
        issueTypeId: req.body.worklog.id,
        accountId: req.body.worklog.updateAuthor.accountId,
        comment: req.body.worklog.comment,
        timeSpentSeconds: req.body.worklog.timeSpentSeconds,
        started: req.body.worklog.started,
        updated: req.body.worklog.updated,
      });
      axios.post('http://localhost:8080/api/v1/jira/worklog/', {
        issueId: req.body.worklog.issueId,
        issueTypeId: req.body.worklog.id,
        accountId: req.body.worklog.updateAuthor.accountId,
        comment: req.body.worklog.comment,
        timeSpentSeconds: req.body.worklog.timeSpentSeconds,
        started: req.body.worklog.started,
        updated: req.body.worklog.updated,
      });
      break;
    }
    case 'worklog_deleted': {
      loggerWebhook.info(req.body.worklog);
      break;
    }
    case 'jira:issue_created': {
      loggerWebhook.info('Issue created : ' + req.body.issue.id);
      break;
    }
    case 'jira:issue_updated': {
      loggerWebhook.info('Issue updated : ' + req.body.issue.id);
      break;
    }
    case 'jira:issue_deleted': {
      loggerWebhook.info('Issue deleted : ' + req.body.issue.id);
      break;
    }
    case 'comment_created': {
      loggerWebhook.info(
        'Comment created : ' + req.body.comment.body,
        req.body.comment.author.displayName,
      );
      break;
    }
    case 'comment_updated': {
      loggerWebhook.info(
        'Comment updated : ' + req.body.comment.body,
        req.body.comment.author.displayName,
      );
      break;
    }
    case 'comment_deleted': {
      loggerWebhook.info(
        'Comment deleted : ' + req.body.comment.body,
        req.body.comment.author.displayName,
      );
      break;
    }
  }

  res.status(200).send('Webhook reçu avec succès !');
});

// Démarrer le serveur
//écoute sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});

//rajouter l'async (route et logger)
