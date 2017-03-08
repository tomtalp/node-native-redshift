function getBaseClient(conf) {
  if (conf.driverType == 'ODBC') {
    return new BaseODBC(conf);
  } else if (conf.driverType == 'JDBC') {
    return new BaseJDBC(conf);
  } else {
    throw new Error ("Received unexpected driver type");
  }
}

class BaseODBC {
  constructor(conf) {
    this.driver = require('odbc')();
    console.log(this.driver);
  }
}

class BaseJDBC {
  constructor(conf) {
    try {
      this.driver = require('jdbc');
      this.jinst = require('jdbc/lib/jinst');
      if (!this.jinst.isJvmCreated()) {
        this.jinst.addOption("-Xrs");
        this.jinst.setupClasspath([conf.driverConfig.driverPath]);
      }
    } catch (e) {
      throw new Error(`Error initializing JDBC libraries - ${e.message}`);
    }

  }
}

// class BaseClient {
//   constructor(driverType) {
//     if (!driverType) {
//       throw new Error("A driver type must be provided to initialize base client");
//     }
//
//     this.driver;
//
//   }
//
//   connect() {
//
//   }
//
//   testConnection() {
//
//   }
//
//   copy() {
//
//   }
//
//   query() {
//
//   }
//
//   commit() {
//
//   }
// }

module.exports = {
  getBaseClient: getBaseClient
};
