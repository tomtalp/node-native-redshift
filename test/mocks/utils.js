module.exports = {
  fakeConf: {
    driverType: 'JDBC',
    driverConfig: {
      driverPath: '/path/to/driver',
      jdbcClassName: 'com.amazon.redshift.jdbc42.Driver'
    },
    host: 'your-host-name.redshift.amazonaws.com',
    db: 'db-name',
    port: 5439,
    user: 'username',
    pass: 'password',
  },
  validDrivers: ['ODBC', 'JDBC'],
  invalidDriver: 'aDriverThatIsDefinitelyInvalid',
  confWithMissingData1: {
    host: 'your-host-name.redshift.amazonaws.com',
    db: 'db-name',
    port: 5439,
    user: 'username',
  },
  confWithMissingData2: {
    db: 'db-name',
    port: 5439,
    user: 'username',
    pass: 'password',
  },
  confWithMissingData3: {
    host: 'your-host-name.redshift.amazonaws.com',
    db: 'db-name',
    port: 5439,
    pass: 'password',
  },
  confWithMissingData4: {
    host: 'your-host-name.redshift.amazonaws.com',
    db: 'db-name',
    port: 5439,
    pass: 'password',
  },
  confWithMissingData4: {
    host: 'your-host-name.redshift.amazonaws.com',
    db: 'db-name',
    user: 'username',
    pass: 'password',
  }
}
