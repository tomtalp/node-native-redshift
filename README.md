# Node-Native-Redshift

A Node.js library for working with Redshift via the native ODBC/JDBC libraries.

```javascript
let conf = {
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

    let rs = new rsClient.Client(conf);
    yield rs.connect();
    yield rs.update("CREATE TABLE TEST_TABLE (c1 int, c2 int)");
    let res = yield rs.query("SELECT * FROM TEST_TABLE");
    yield rs.close();
```

General guidelines for installing the Redshift ODBC/JDBC drivers can be found in the AWS docs -
* ODBC - http://docs.aws.amazon.com/redshift/latest/mgmt/configure-odbc-connection.html
* JDBC - http://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-connection.html

###### *The project is in it's very early stages, and isn't production-ready*
