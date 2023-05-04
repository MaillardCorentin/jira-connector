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
  // console.log("Requête reçue depuis le webhook : ", req.body);
  switch (req.body.webhookEvent) {
    case 'worklog_created': {
      loggerWebhook.info({
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      });
      // console.log(req.body.worklog);
      axios.post('http://10.1.100.244:8080/api/v1/jira/issue/worklog/', {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      });
      break;
    }
    case 'worklog_updated': {
      loggerWebhook.info('Worklog updated :', {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      });
      axios.put(
        `http://localhost:8080/api/v1/jira/issue/worklog/${req.body.worklog.id}`,
        {
          worklog_id: req.body.worklog.id,
          issue_id: req.body.worklog.issueId,
          creatorId: req.body.worklog.updateAuthor.accountId,
          timespent: req.body.worklog.timeSpentSeconds,
          updated: req.body.worklog.updated,
          description: req.body.worklog.comment,
        },
      );
      break;
    }
    case 'worklog_deleted': {
      loggerWebhook.info('Worklog deleted :', {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      });
      axios.delete(
        `http://localhost:8080/api/v1/jira/issue/worklog/${req.body.worklog.id}`,
        {},
      );
      break;
    }
    // case 'jira:issue_created': {
    //   loggerWebhook.info('Issue created : ' + req.body.issue.id);
    //   break;
    // }
    // case 'jira:issue_updated': {
    //   loggerWebhook.info('Issue updated : ' + req.body.issue.id);
    //   break;
    // }
    // case 'jira:issue_deleted': {
    //   loggerWebhook.info('Issue deleted : ' + req.body.issue.id);
    //   break;
    // }
    // case 'comment_created': {
    //   loggerWebhook.info(
    //     'Comment created : ' + req.body.comment.body,
    //     req.body.comment.author.displayName,
    //   );
    //   break;
    // }
    // case 'comment_updated': {
    //   loggerWebhook.info(
    //     'Comment updated : ' + req.body.comment.body,
    //     req.body.comment.author.displayName,
    //   );
    //   break;
    // }
    // case 'comment_deleted': {
    //   loggerWebhook.info(
    //     'Comment deleted : ' + req.body.comment.body,
    //     req.body.comment.author.displayName,
    //   );
    //   break;
    // }
  }

  res.status(200).send('Webhook reçu avec succès !');
});

// Démarrer le serveur
//écoute sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});

//rajouter l'async (route et logger)
