const stub    = require('sinon').stub
    , expect  = require('chai').expect
    , bc      = require('../../src/lib/base-client')
    , mocks   = require('../mocks/base-client')
    , coMocha = require('co-mocha')
    ;

describe("Base client", function(){
  describe("Base JDBC", function() {
    var fakeConf = mocks.fakeJDBCConf;
    var baseJdbc = new bc.BaseJDBC(fakeConf);
    var initializeConnStub = stub();
    var reserveConnStub = stub();

    describe("connect()", function(){
      beforeEach(function(){
        baseJdbc.driver = stub().returns({
          initialize: function(cb) {
            initializeConnStub(arguments); // Call init stub when the base func is called
            cb();
          },
          reserve: function(cb) {
            reserveConnStub(arguments); // Call reserve stub when the base func is called
            cb(undefined, {conn: {}});
          }
        });
      });
      it("Should initialize a JDBC client", function*(done) {
        yield baseJdbc.connect();
        expect(initializeConnStub.called).to.be.true;
        done();
      });
      it("Should reserve a new connection from the conn pool", function*(done) {
        yield baseJdbc.connect();
        expect(reserveConnStub.called).to.be.true;
        done();
      });
    });
  })
});
