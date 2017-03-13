module.exports = {
  fakeJDBCConf: {
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
  }
}
