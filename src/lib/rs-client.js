const utils = require('./utils'),
      baseClient  = require('./base-client')
      ;

class Client {
  constructor(conf) {
    utils.validateConf(conf);
    this.conf = conf;
    this.base = baseClient.getBaseClient(conf);
  }

  *connect() {
    yield this.base.connect();
  }

  *query(sql) {
    let res =  yield this.base.query(sql);
    return res;
  }

  *close() {
    yield this.base.close();
  }

  *update(sql) {
    return yield this.base.update(sql);
  }

  *copy(copyConf) {
    let copyCommand = this.formatCopyQuery(copyConf);
    return yield this.base.copy(copyCommand);
  }

  /* Receive the copyConf object and build a copy command from it*/
  formatCopyQuery(copyConf) {
    let copyDestination = copyConf.schema ? `${copyConf.schema}.${copyConf.tableName}` : copyConf.tableName;
    let authCommand = this.getAuthCommand(copyConf.authInfo);
    return `COPY ${copyDestination}
    FROM '${copyConf.copySource}'
    ${authCommand}
    `;
  }

  /* Receive the authInfo object and build an auth command, depending on the
  different auth methods - IAM or AWS Credentials */
  getAuthCommand(authInfo) {
    if (Object.keys(authInfo).length != 1) {
      throw new Error("COPY auth information must contain only one valid auth type (IAM or credentials)");
    }
    let authType = Object.keys(authInfo)[0];

    let authData = authInfo[authType]
    if (authType == 'iam') {
      return `iam_role '${authData}'`
    } else if (authType == 'credentials') {
      return `credentials 'aws_access_key_id=${authData.access_key_id};aws_secret_access_key=${authData.secret_access_key}'`;
    } else {
      throw new Error("Unkown auth method - ", authType);
    }
  }
}

module.exports = {
  Client: Client
};
