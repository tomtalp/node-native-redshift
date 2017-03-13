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

    describe("connect()", function(){
      describe("Success", function(){
        var initializeConnStub = stub();
        var reserveConnStub = stub();
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
        afterEach(function(){
          baseJdbc.driver = {};
        })
        it("Should initialize a JDBC client", function*(done) {
          yield baseJdbc.connect();
          expect(initializeConnStub.called).to.be.true;
          expect(baseJdbc.jdbcClient).to.not.be.undefined;
          done();
        });
        it("Should reserve a new connection from the conn pool", function*(done) {
          yield baseJdbc.connect();
          expect(reserveConnStub.called).to.be.true;
          done();
        });
        it("Should initialize a jdbcConnection object", function*(done){
          yield baseJdbc.connect();
          expect(baseJdbc.jdbcConnection).to.not.be.undefined;
          done()
        });
      })
    });
    describe("initConnection()", function(){
      describe("Failure", function(){
        beforeEach(function(){
          baseJdbc.jdbcClient = {
            reserveAsync: function*() {
              throw new Error("Failed reserving connection!")
            }
          }
        });
        it("Should throw an error if reserving a conn fails", function*(done){
          try {
            yield baseJdbc.initConnection();
          } catch (e) {
            done();
          }
        });
      })
    });
    describe("initClient()", function(){
      describe("Failure", function(){

      })
    })
  })
});
