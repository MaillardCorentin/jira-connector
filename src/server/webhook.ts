import express from 'express';
import bodyParser from 'body-parser';
import { Issue } from '../lib/jira/dataModels/issues';
import { Worklog } from '../lib/jira/dataModels/worklog';
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
      let worklog: Worklog = {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'POST',
        RESPONCE: worklog,
      });
      // console.log(req.body.worklog);
      axios.post(
        'http://10.1.100.244:8080/api/v1/jira/issue/worklog/',
        worklog,
      );
      break;
    }
    case 'worklog_updated': {
      let worklog: Worklog = {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'PUT',
        RESPONCE: worklog,
      });
      axios.put(
        `http://localhost:8080/api/v1/jira/issue/worklog/${req.body.worklog.id}`,
        worklog,
      );
      break;
    }
    case 'worklog_deleted': {
      let worklog: Worklog = {
        worklog_id: req.body.worklog.id,
        issue_id: req.body.worklog.issueId,
        creatorId: req.body.worklog.updateAuthor.accountId,
        timespent: req.body.worklog.timeSpentSeconds,
        updated: req.body.worklog.updated,
        description: req.body.worklog.comment,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'DELETE',
        RESPONCE: worklog,
      });
      axios.delete(
        `http://localhost:8080/api/v1/jira/issue/worklog/${req.body.worklog.id}`,
        {},
      );
      break;
    }
    case 'jira:issue_created': {
      let issue: Issue = {
        issue_id: req.body.issue.id,
        key: req.body.issue.key,
        nameIssueType: req.body.issue.fields.issuetype.name,
        timespent: req.body.issue.fields.timespent,
        updated: req.body.issue.fields.updated,
        description: req.body.issue.fields.description,
        status: req.body.issue.fields.customfield_10010.currentStatus.status,
        summary: req.body.issue.fields.summary,
        userId: req.body.issue.fields.creator.accountId,
        organizationid: req.body.issue.fields.customfield_10002[0].id,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'POST',
        RESPONCE: issue,
      });
      // console.log(req.body.worklog);
      axios.post('http://10.1.100.244:8080/api/v1/jira/issue/', issue);
      break;
    }
    case 'jira:issue_updated': {
      let issue: Issue = {
        issue_id: req.body.issue.id,
        key: req.body.issue.key,
        nameIssueType: req.body.issue.fields.issuetype.name,
        timespent: req.body.issue.fields.timespent,
        updated: req.body.issue.fields.updated,
        description: req.body.issue.fields.description,
        status: req.body.issue.fields.customfield_10010.currentStatus.status,
        summary: req.body.issue.fields.summary,
        userId: req.body.issue.fields.creator.accountId,
        organizationid: req.body.issue.fields.customfield_10002[0].id,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'PUT',
        RESPONCE: issue,
      });
      // console.log(req.body.worklog);
      axios.put('http://10.1.100.244:8080/api/v1/jira/issue/', issue);
      break;
    }
    case 'jira:issue_deleted': {
      let issue: Issue = {
        issue_id: req.body.issue.id,
        key: req.body.issue.key,
        nameIssueType: req.body.issue.fields.issuetype.name,
        timespent: req.body.issue.fields.timespent,
        updated: req.body.issue.fields.updated,
        description: req.body.issue.fields.description,
        status: req.body.issue.fields.customfield_10010.currentStatus.status,
        summary: req.body.issue.fields.summary,
        userId: req.body.issue.fields.creator.accountId,
        organizationid: req.body.issue.fields.customfield_10002[0].id,
      };
      loggerWebhook.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'EXPRESS',
        CMD: 'DELETE',
        RESPONCE: issue,
      });
      // console.log(req.body.worklog);
      axios.delete('http://10.1.100.244:8080/api/v1/jira/issue/');
      break;
    }
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
