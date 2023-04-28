import axios, { AxiosResponse } from 'axios';
import { Oauth2 } from '../lib/jira/dataModels/authentification';
import { User } from '../lib/jira/dataModels/users';
import { Organization } from '../lib/jira/dataModels/organization';
import { Customer } from '../lib/jira/dataModels/customer';
import { ViewOrgCust } from '../lib/jira/dataModels/view';
import { createLogger } from '../lib/logger';

const loggerHttp = createLogger('./log/jira_http.json');

let auth: Oauth2 = {
  clientID: '',
  clientSecret: '',
  accessToken: '',
  cloudID: '',
  expiresIn: 1,
};

auth.clientID = String(process.env.npm_config_clientid);
auth.clientSecret = String(process.env.npm_config_clientsecret);
// let adresse = String(process.env.npm_config_adresse);
// let port = String(process.env.npm_config_port);
let users: User[] = [];
let organizations: Organization[] = [];
let customers: Customer[] = [];
let organizationDB: Organization[] = [];
let customerDB: Customer[] = [];
let viewDB: ViewOrgCust[] = [];

const apiUrlCloudID =
  'https://api.atlassian.com/oauth/token/accessible-resources';

// Obtenir un nouveau token d'accès à partir des "Client Credentials"
(async (): Promise<void> => {
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

  // const responseUser: AxiosResponse = await axios.get(
  //     `https://api.atlassian.com/ex/jira/${auth.cloudID}/rest/api/3/users/search?startAt=0&maxResults=50`,
  //     {
  //         headers: {
  //             Authorization: `Bearer ${auth.accessToken}`,
  //         },
  //     },
  // );

  // for (let i = 0; i < responseUser.data.length; i++) {
  //     let utilisateur: User = {
  //         accountId: responseUser.data[i].accountId,
  //         accountType: responseUser.data[i].accountType,
  //         emailAddress: responseUser.data[i].emailAddress,
  //         displayName: responseUser.data[i].displayName,
  //     };
  //     axios.post('http://10.1.100.244:8080/api/v1/jira/', {
  //         accountId: responseUser.data[i].accountId,
  //         accountType: responseUser.data[i].accountType,
  //         emailAddress: responseUser.data[i].emailAddress,
  //         displayName: responseUser.data[i].displayName,
  //     });
  //     users.push(utilisateur);
  // }
  // axios.post('http://10.1.100.244:8080/api/v1/jira/', users).then(response => {
  //     console.log(response);
  // });
  //   const response: AxiosResponse = await axios.post(
  //     "10.1.100.244:8080/api/v1/jira/",
  //     {
  //       params,
  //     }
  //   );
  //console.log(users);

  //recup les organisations de jira
  const responseOrganization: AxiosResponse = await axios.get(
    `https://api.atlassian.com/ex/jira/${auth.cloudID}/rest/servicedeskapi/organization`,
    {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    },
  );

  //recup les organisations de la database et le met en cache
  const responseOrganizationDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/organization/`,
  );
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
      loggerHttp.info({
        organizationID: responseOrganization.data.values[i].id,
        name: responseOrganization.data.values[i].name,
      });
      //si l'organisations n'est pas déjà dans la db alors la rajoute
      axios.post('http://10.1.100.244:8080/api/v1/jira/organization/', {
        organizationID: responseOrganization.data.values[i].id,
        name: responseOrganization.data.values[i].name,
      });
    }
  }
  //console.log(organizations);

  //recup les custumers de la database et le met en cache
  const responseCustomerDB: AxiosResponse = await axios.get(
    `http://10.1.100.244:8080/api/v1/jira/customer/`,
  );
  for (let k = 0; k < responseCustomerDB.data.length; k++) {
    let customerdb: Customer = {
      accountId: responseCustomerDB.data[k].accountId,
      accountType: responseCustomerDB.data[k].accountType,
      emailAddress: responseCustomerDB.data[k].emailAddress,
      displayName: responseCustomerDB.data[k].displayName,
    };
    customerDB.push(customerdb);
  }
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

  //recup les customers de chaque organisations sur jira
  for (let i = 0; i < organizations.length; i++) {
    let organizationId = organizations[i].organizationID;
    const responseOrganizationCustomer: AxiosResponse = await axios.get(
      `https://api.atlassian.com/ex/jira/${auth.cloudID}/rest/servicedeskapi/organization/${organizationId}/user`,
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      },
    );
    for (let j = 0; j < responseOrganizationCustomer.data.values.length; j++) {
      let customer: Customer = {
        accountId: responseOrganizationCustomer.data.values[j].accountId,
        accountType: 'customer',
        emailAddress: responseOrganizationCustomer.data.values[j].emailAddress,
        displayName: responseOrganizationCustomer.data.values[j].displayName,
      };

      //regarde si customer déjà présentent dans la database
      const founddb = customerDB.find(obj => {
        return obj.accountId == customer.accountId;
      });
      // si le customer n'est pas présent dans la db
      if (founddb == undefined) {
        //regarde si customer déjà encodé d'une autre organisation
        const foundjira = customers.find(obj => {
          return obj.accountId == customer.accountId;
        });
        // si le customer n'est pas déjà encodé avec un organisation précédente
        if (foundjira == undefined) {
          loggerHttp.info({
            accountId: responseOrganizationCustomer.data.values[j].accountId,
            accountType: 'customer',
            emailAddress:
              responseOrganizationCustomer.data.values[j].emailAddress,
            displayName:
              responseOrganizationCustomer.data.values[j].displayName,
          });
          axios.post('http://10.1.100.244:8080/api/v1/jira/customer/', {
            accountId: responseOrganizationCustomer.data.values[j].accountId,
            accountType: 'customer',
            emailAddress:
              responseOrganizationCustomer.data.values[j].emailAddress,
            displayName:
              responseOrganizationCustomer.data.values[j].displayName,
          });
        }
      }
      customers.push(customer);

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
          accountId: responseOrganizationCustomer.data.values[j].accountId,
          organizationID: organizationId,
        });
        //si  n'est pas déjà dans la view db alors la rajoute
        axios.post('http://10.1.100.244:8080/api/v1/jira/viewco/', {
          accountId: responseOrganizationCustomer.data.values[j].accountId,
          organizationID: organizationId,
        });
      }
    }
  }

  // console.log(JSON.stringify(customers));

  // console.log(JSON.stringify(users));
})();
