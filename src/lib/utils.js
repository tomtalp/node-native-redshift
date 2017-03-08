// Validate that the connection config has all the necessary properties
function validateConf(conf) {
  validateDriverType(conf.driverType);
  validateDriverConfig(conf);
  validateConnInfo(conf);
}

function validateDriverType(driverType) {
  let drivers = ['ODBC', 'JDBC'];
  if (!drivers.includes(driverType)) {
    throw new Error("Invalid driver! Driver type must be either ODBC or JDBC");
  }
}

function validateConnInfo(conf) {
  if (!(conf.host && conf.db && conf.port && conf.user && conf.pass)) {
    throw new Error("Connection info must contain host, db name, port, username & pass.")
  }
}

function validateDriverConfig(conf) {
  if (!conf.driverConfig) {
    throw new Error("Config must contain driver configuration info");
  }

  let dc = conf.driverConfig;
  if (!dc.driverPath) {
    throw new Error("Driver config must contain a driver path!");
  }
  if (conf.driverType == 'JDBC' && !dc.jdbcClassName) {
    throw new Error("JDBC class name must be specified!");
  }
}

module.exports = {
  validateConf: validateConf
}

