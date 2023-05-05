import axios, { AxiosResponse } from 'axios';
import { APItoken } from '../lib/jira/dataModels/authentification';
import { User } from '../lib/jira/dataModels/users';
import { Organization } from '../lib/jira/dataModels/organization';
import { Customer } from '../lib/jira/dataModels/customer';
import { ViewOrgCust } from '../lib/jira/dataModels/view';
import { Issue } from '../lib/jira/dataModels/issues';
import { Worklog } from '../lib/jira/dataModels/worklog';
import { createLogger } from '../lib/logger';

const loggerHttp = createLogger('./log/jira_http.json');

// // config pour OAuth2
// let auth: Oauth2 = {
//   clientID: '',
//   clientSecret: '',
//   accessToken: '',
//   cloudID: '',
//   expiresIn: 1,
// };
// auth.clientID = String(process.env.npm_config_clientid);
// auth.clientSecret = String(process.env.npm_config_clientsecret);

let auth: APItoken = {
  atlassianEmail: '',
  atlassianToken: '',
  baseUrl: '',
};

auth.atlassianEmail = String(process.env.npm_config_atlassianEmail);
auth.atlassianToken = String(process.env.npm_config_atlassianToken);
auth.baseUrl = String(process.env.npm_config_baseUrl);

// let adresse = String(process.env.npm_config_adresse);
// let port = String(process.env.npm_config_port);
let arrOrganizations: Organization[] = [];
let arrUsers: User[] = [];
let viewDB: ViewOrgCust[] = [];
let arrWorklogs: Worklog[] = [];
let arrIssues: Issue[] = [];

//Classe ViewCustomer
export class ViewUser {
  accountId: string;
  accountType: string;
  emailAddress: string;
  displayName: string;

  constructor(item: User) {
    this.accountId = item.accountId;
    this.accountType = item.accountType;
    this.emailAddress = item.emailAddress;
    this.displayName = item.displayName;
  }
}

//Classe ViewOrganization
export class ViewOrganization {
  organizationID: string;
  name: string;

  constructor(item: Organization) {
    this.organizationID = item.organizationID;
    this.name = item.name;
  }
}

//Classe ViewIssue
export class ViewIssue {
  issue_id: string;
  key: string;
  nameIssueType: string;
  timespent: string;
  updated: string;
  description: string;
  status: string;
  summary: string;
  userId: string;
  organizationid: string;

  constructor(item: Issue) {
    this.issue_id = item.issue_id;
    this.key = item.key;
    this.nameIssueType = item.nameIssueType;
    this.timespent = item.timespent;
    this.updated = item.updated;
    this.description = item.description;
    this.status = item.status;
    this.summary = item.summary;
    this.userId = item.userId;
    this.organizationid = item.organizationid;
  }
}

//Classe ViewWorklog
export class ViewWorklog {
  worklog_id: string;
  issue_id: string;
  creatorId: string;
  timespent: string;
  updated: string;
  description: string;

  constructor(item: Worklog) {
    this.worklog_id = item.worklog_id;
    this.issue_id = item.issue_id;
    this.creatorId = item.creatorId;
    this.timespent = item.timespent;
    this.updated = item.updated;
    this.description = item.description;
  }
}

//instancie les classes
let customers: ViewUser[] = arrUsers.map(item => new ViewUser(item));
let organizations: ViewOrganization[] = arrOrganizations.map(
  item => new ViewOrganization(item),
);
let users: ViewUser[] = arrUsers.map(item => new ViewUser(item));
let customerDB: ViewUser[] = arrUsers.map(item => new ViewUser(item));
let userDB: ViewUser[] = arrUsers.map(item => new ViewUser(item));
let organizationDB: ViewOrganization[] = arrOrganizations.map(
  item => new ViewOrganization(item),
);
let issues: ViewIssue[] = arrIssues.map(item => new ViewIssue(item));
let issueDB: ViewIssue[] = arrIssues.map(item => new ViewIssue(item));
let worklogs: ViewWorklog[] = arrWorklogs.map(item => new ViewWorklog(item));
let worklogDB: ViewWorklog[] = arrWorklogs.map(item => new ViewWorklog(item));

// config en OAuth 2
// const apiUrlCloudID =
//   'https://api.atlassian.com/oauth/token/accessible-resources';

// Obtenir un nouveau token d'accès à partir des "Client Credentials"
(async (): Promise<void> => {
  // config OAuth 2
  /**
  const responseAccessToken: AxiosResponse = await axios.post(
    'https://api.atlassian.com/oauth/token',
    null,
    {
      params: {
        grant_type: 'client_credentials',
        client_id: auth.clientID,
        client_secret: auth.clientSecret,
      },
    },
  );
  auth.expiresIn = responseAccessToken.data.expires_in;
  auth.accessToken = responseAccessToken.data.access_token;
  const responseApiCloudID: AxiosResponse = await axios.get(apiUrlCloudID, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });
  auth.cloudID = responseApiCloudID.data[0].id;
   */

  //recup les custumers de la database et le met en cache
  const responseCustomerDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/customer/`,
  );

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'DB',
    CMD: 'GET customers',
    RESPONCE: responseCustomerDB.data,
  });

  for (let k = 0; k < responseCustomerDB.data.length; k++) {
    let customerdb: Customer = {
      accountId: responseCustomerDB.data[k].accountId,
      accountType: responseCustomerDB.data[k].accountType,
      emailAddress: responseCustomerDB.data[k].emailAddress,
      displayName: responseCustomerDB.data[k].displayName,
    };
    customerDB.push(customerdb);
  }

  //recup les users de la database et le met en cache
  const responseUserDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/customer/`,
  );
  for (let o = 0; o < responseUserDB.data.length; o++) {
    let userdb: User = {
      accountId: responseUserDB.data[o].accountId,
      accountType: responseUserDB.data[o].accountType,
      emailAddress: responseUserDB.data[o].emailAddress,
      displayName: responseUserDB.data[o].displayName,
    };
    customerDB.push(userdb);
  }

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'DB',
    CMD: 'GET users',
    RESPONCE: responseUserDB.data,
  });

  //recup les issues de la database et les mets en cache
  const responseIssueDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/issue/`,
  );
  for (let q = 0; q < responseIssueDB.data.length; q++) {
    let issuedb: Issue = {
      issue_id: responseIssueDB.data[q].issue_id,
      key: responseIssueDB.data[q].key,
      nameIssueType: responseIssueDB.data[q].nameIssueType,
      timespent: responseIssueDB.data[q].timespent,
      updated: responseIssueDB.data[q].updated,
      description: responseIssueDB.data[q].description,
      status: responseIssueDB.data[q].status,
      summary: responseIssueDB.data[q].summary,
      userId: responseIssueDB.data[q].userId,
      organizationid: responseIssueDB.data[q].organizationid,
    };
    issueDB.push(issuedb);
  }

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'DB',
    CMD: 'GET issues',
    RESPONCE: responseIssueDB.data,
  });

  //recup les worklog de la database et les mets en cache
  const responseWorklogDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/issue/worklog/`,
  );
  for (let q = 0; q < responseWorklogDB.data.length; q++) {
    let worklogdb: Worklog = {
      worklog_id: responseWorklogDB.data[q].worklog_id,
      issue_id: responseWorklogDB.data[q].issue_id,
      creatorId: responseWorklogDB.data[q].creatorId,
      timespent: responseWorklogDB.data[q].timespent,
      updated: responseWorklogDB.data[q].updated,
      description: responseWorklogDB.data[q].description,
    };
    worklogDB.push(worklogdb);
  }

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'DB',
    CMD: 'GET worklog',
    RESPONCE: responseWorklogDB.data,
  });

  //récup user et customer de jira
  const responseUser: AxiosResponse = await axios.get(
    `${auth.baseUrl}/rest/api/3/users/search?startAt=0&maxResults=50`,
    { auth: { username: auth.atlassianEmail, password: auth.atlassianToken } },
  );

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'JIRA',
    CMD: 'GET users',
    RESPONCE: responseUser.data,
  });

  for (let i = 0; i < responseUser.data.length; i++) {
    // si l'accountType est un user (atlassian) ou un client (customer)
    if (responseUser.data[i].accountType == 'atlassian') {
      //crée un user si condition respectée
      let utilisateur: User = {
        accountId: responseUser.data[i].accountId,
        accountType: responseUser.data[i].accountType,
        emailAddress: responseUser.data[i].emailAddress,
        displayName: responseUser.data[i].displayName,
      };

      //regarde si customer déjà présentent dans la database
      const foundUserdb = userDB.find(obj => {
        return obj.accountId == utilisateur.accountId;
      });
      // si le customer/user n'est pas présent dans la db
      if (foundUserdb == undefined) {
        //ajoute dans le fichier http qui se trouve dans les logs
        loggerHttp.info(utilisateur);

        axios.post('http://10.1.100.244:8080/api/v1/jira/user/', utilisateur);
      }
      users.push(utilisateur);
    } else if (responseUser.data[i].accountType == 'customer') {
      //crée un customer si condition respectée
      let customer: Customer = {
        accountId: responseUser.data[i].accountId,
        accountType: responseUser.data[i].accountType,
        emailAddress: responseUser.data[i].emailAddress,
        displayName: responseUser.data[i].displayName,
      };

      //regarde si customer déjà présentent dans la database
      const foundCustdb = customerDB.find(obj => {
        return obj.accountId == customer.accountId;
      });
      // si le customer/user n'est pas présent dans la db
      if (foundCustdb == undefined) {
        //ajoute dans le fichier http qui se trouve dans les logs
        loggerHttp.info(customer);

        axios.post('http://10.1.100.244:8080/api/v1/jira/customer/', customer);
      }
      customers.push(customer);
    }
  }
  //recup les organisations de jira
  const responseOrganization: AxiosResponse = await axios.get(
    `${auth.baseUrl}/rest/servicedeskapi/organization`,
    { auth: { username: auth.atlassianEmail, password: auth.atlassianToken } },
  );

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'JIRA',
    CMD: 'GET organization',
    RESPONCE: responseOrganization.data,
  });

  //recup les organisations de la database et le met en cache
  const responseOrganizationDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/organization/`,
  );

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'DB',
    CMD: 'GET organization',
    RESPONCE: responseOrganizationDB.data,
  });

  for (let l = 0; l < responseOrganizationDB.data.length; l++) {
    let organizationdb: Organization = {
      organizationID: responseOrganizationDB.data[l].organizationID,
      name: responseOrganizationDB.data[l].name,
    };
    organizationDB.push(organizationdb);
  }

  for (let i = 0; i < responseOrganization.data.values.length; i++) {
    let organization: Organization = {
      organizationID: responseOrganization.data.values[i].id,
      name: responseOrganization.data.values[i].name,
    };
    organizations.push(organization);
    //regarde si organisation déjà présentent dans la database
    const foundOrg = organizationDB.find(obj => {
      return obj.organizationID == organization.organizationID;
    });
    if (foundOrg == undefined) {
      loggerHttp.info(organization);
      //si l'organisations n'est pas déjà dans la db alors la rajoute
      axios.post(
        'http://10.1.100.244:8080/api/v1/jira/organization/',
        organization,
      );
    }
  }
  //console.log(organizations);

  //recup les view de la database et le met en cache
  const responseView: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/viewco/`,
  );
  for (let m = 0; m < responseView.data.length; m++) {
    let viewdb: ViewOrgCust = {
      accountId: responseView.data[m].accountId,
      organizationID: responseView.data[m].organizationID,
    };
    viewDB.push(viewdb);
  }

  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'JIRA',
    CMD: 'GET view',
    RESPONCE: responseView.data,
  });

  //recup les customers de chaque organisations sur jira
  for (let i = 0; i < organizations.length; i++) {
    let organizationId = organizations[i].organizationID;
    const responseOrganizationCustomer: AxiosResponse = await axios.get(
      `${auth.baseUrl}/rest/servicedeskapi/organization/${organizationId}/user`,
      {
        auth: { username: auth.atlassianEmail, password: auth.atlassianToken },
      },
    );
    for (let j = 0; j < responseOrganizationCustomer.data.values.length; j++) {
      let customer: Customer = {
        accountId: responseOrganizationCustomer.data.values[j].accountId,
        accountType: 'customer',
        emailAddress: responseOrganizationCustomer.data.values[j].emailAddress,
        displayName: responseOrganizationCustomer.data.values[j].displayName,
      };

      //a retirer cnul

      // customerDB
      //regarde si organisation déjà présentent dans la database
      const foundView = viewDB.find(obj => {
        return (
          obj.accountId ==
            responseOrganizationCustomer.data.values[j].accountId &&
          obj.organizationID == organizationId
        );
      });
      if (foundView == undefined) {
        loggerHttp.info({
          TIMESTAMP: new Date().getTime(),
          SEVERITY: '',
          ORIGINE: 'AXIOS',
          CMD: 'POST customer',
          RESPONCE: customer,
        });
        //si  n'est pas déjà dans la view db alors la rajoute
        axios.post('http://10.1.100.244:8080/api/v1/jira/viewco/', customer);
      }
      customers.push(customer);
    }
  }

  const responseIssue: AxiosResponse = await axios.get(
    `${auth.baseUrl}/rest/api/latest/search`,
    { auth: { username: auth.atlassianEmail, password: auth.atlassianToken } },
  ); //Issue
  loggerHttp.info({
    TIMESTAMP: new Date().getTime(),
    SEVERITY: '',
    ORIGINE: 'JIRA',
    CMD: 'GET issue',
    RESPONCE: responseIssue.data,
  });

  for (let p = 0; p < responseIssue.data.issues.length; p++) {
    let issue: Issue = {
      issue_id: responseIssue.data.issues[p].id,
      key: responseIssue.data.issues[p].key,
      nameIssueType: responseIssue.data.issues[p].fields.issuetype.name,
      timespent: responseIssue.data.issues[p].fields.timespent,
      updated: responseIssue.data.issues[p].fields.updated,
      description: responseIssue.data.issues[p].fields.description,
      status:
        responseIssue.data.issues[p].fields.customfield_10010.currentStatus
          .status,
      summary: responseIssue.data.issues[p].fields.summary,
      userId: responseIssue.data.issues[p].fields.creator.accountId,
      organizationid:
        responseIssue.data.issues[p].fields.customfield_10002[0].id,
    };
    const foundIssuedb = issueDB.find(obj => {
      return obj.issue_id == issue.issue_id;
    });
    // si le customer/user n'est pas présent dans la db
    if (foundIssuedb == undefined) {
      //ajoute dans le fichier http qui se trouve dans les logs
      loggerHttp.info({
        TIMESTAMP: new Date().getTime(),
        SEVERITY: '',
        ORIGINE: 'AXIOS',
        CMD: 'POST issue',
        RESPONCE: issue,
      });
      axios.post('http://10.1.100.244:8080/api/v1/jira/issue/', issue);
    }
    issues.push(issue);
    // get worklog from jira
    const responseWorklog: AxiosResponse = await axios.get(
      `${auth.baseUrl}/rest/api/2/issue/${issue.key}/worklog`,
      {
        auth: { username: auth.atlassianEmail, password: auth.atlassianToken },
      },
    ); //worklog
    loggerHttp.info({
      TIMESTAMP: new Date().getTime(),
      SEVERITY: '',
      ORIGINE: 'JIRA',
      CMD: 'GET',
      RESPONCE: responseWorklog.data,
    });

    for (let r = 0; r < responseWorklog.data.worklogs.length; r++) {
      let worklog: Worklog = {
        worklog_id: responseWorklog.data.worklogs[r].id,
        issue_id: responseWorklog.data.worklogs[r].issueId,
        creatorId: responseWorklog.data.worklogs[r].updateAuthor.accountId,
        timespent: responseWorklog.data.worklogs[r].timeSpentSeconds,
        updated: responseWorklog.data.worklogs[r].updated,
        description: responseWorklog.data.worklogs[r].comment,
      };
      const foundWorklogdb = worklogDB.find(obj => {
        return (
          obj.worklog_id == worklog.worklog_id &&
          obj.issue_id == worklog.issue_id
        );
      });
      // si le customer/user n'est pas présent dans la db
      if (foundWorklogdb == undefined) {
        //ajoute dans le fichier http qui se trouve dans les logs
        loggerHttp.info({
          TIMESTAMP: new Date().getTime(),
          SEVERITY: '',
          ORIGINE: 'AXIOS',
          CMD: 'POST worklog',
          RESPONCE: worklog,
        });
        axios.post(
          'http://10.1.100.244:8080/api/v1/jira/issue/worklog',
          worklog,
        );
      }
      worklogs.push(worklog);
    }
  }
})();
