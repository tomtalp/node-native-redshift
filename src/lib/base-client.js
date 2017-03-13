const Promise = require('bluebird')
    ;

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
    this.conf = conf;
    this.connString = this.getConnString();

    try {
      this.driver = require('jdbc');
      this.jinst = require('jdbc/lib/jinst');
      this.initJVM();
    } catch (e) {
      throw new Error(`Error initializing JDBC libraries - ${e.message}`);
    }
  }

  getConnString() {
    return `jdbc:redshift://${this.conf.host}:${this.conf.port}/${this.conf.db}`;
  }

  initJVM() {
    if (!this.jinst.isJvmCreated()) {
      this.jinst.addOption("-Xrs");
      this.jinst.setupClasspath([this.conf.driverConfig.driverPath]);
    }
  }

  *connect() {
    yield this.initClient();
    yield this.initConnection();
  }

  *initClient() {
    let jdbcConfig = {
      url: this.connString,
      drivename: this.conf.driverConfig.jdbcClassName,
      properties: {
        user: this.conf.user,
        password: this.conf.pass
      }
    };
    let jdbcClient = new this.driver(jdbcConfig);
    this.jdbcClient = Promise.promisifyAll(jdbcClient);
    try {
      yield this.jdbcClient.initializeAsync();
      console.log("Successfully configured JDBC Redshift client");
    } catch (e) {
      console.log("Failed creating JDBC client - ", e);
      throw e;
    }
  }

  // Reserve a single connection in the connection pool, and initialize
  // a connection object from it.
  *initConnection() {
    try {
      let reservedConn = yield this.jdbcClient.reserveAsync();
      this.jdbcConnection = Promise.promisifyAll(reservedConn.conn);
      console.log("Successfully reserved connection from conn pool");
    } catch (e) {
      console.log("Failed initializing JDBC connection");
      throw e;
    }
  }

  *query(sqlQuery) {
    if (!this.jdbcConnection) {
      throw new Error("You must be connected to the DB in order to perform a query");
    }
    let statement = yield this.jdbcConnection.createStatementAsync();
    statement = Promise.promisifyAll(statement);

    let resultSet = yield statement.executeQueryAsync(sqlQuery);
    resultSet = Promise.promisifyAll(resultSet)

    return yield resultSet.toObjArrayAsync();
  }

  // Close connection & reset the conn object.
  *close() {
    yield this.jdbcClient.releaseAsync(this.jdbcConnection);
    this.jdbcConnection = undefined;
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
  getBaseClient: getBaseClient,
  BaseJDBC: BaseJDBC,
  BaseODBC: BaseODBC
};
