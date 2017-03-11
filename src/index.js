const rsClient = require('./lib/rs-client')
    , co       = require('co')
    ;

function main() {
  co(function*(){
    let conf = {
      driverType: 'JDBC', /* ~REQUIRED~ The type of the desired connection method. Must be either JDBC or ODBC. */
      driverConfig: {
        driverPath: '/path/to/driver', /* ~REQUIRED~ .jar path if JDBC, or the ODBC driver manager path.*/
        jdbcClassName: 'com.amazon.redshift.jdbc42.Driver' /* ~OPTIONAL~ If JDBC is the selected driver, a driver class name is required. */
      },
      host: 'your-host-name.redshift.amazonaws.com', /* ~REQUIRED~ The Redshift cluster URL. */
      db: 'db-name', /* ~REQUIRED~ Database name */
      port: 5439, /* ~OPTIONAL~ Cluster port. Defaults to 5439 */
      user: 'username', /* ~REQUIRED~ Cluster username  */
      pass: 'password', /* ~REQUIRED~ Cluster password  */
    }
    let rs = new rsClient.Client(conf);
    yield rs.connect();
    let res = yield rs.query("SELECT * FROM STL_LOAD_COMMITS LIMIT 5");
    console.log("res - ", res);
    yield rs.close();
  }).catch(function(err){
    console.log("Error - ", err);
  })
}
main();
