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
    describe("initJVM()", function(){
      describe("JVM not initialized", function(){
        beforeEach(function(){
          stub(baseJdbc.jinst, "isJvmCreated", function(){
            return false;
          });
          stub(baseJdbc.jinst, "addOption", function(){
            return {};
          });
          stub(baseJdbc.jinst, "setupClasspath", function(){
            return {};
          });
        })
        afterEach(function(){
          baseJdbc.jinst.isJvmCreated.restore();
          baseJdbc.jinst.addOption.restore();
          baseJdbc.jinst.setupClasspath.restore();
        })
        it("Should call JVM initialization functions", function(done){
          baseJdbc.initJVM();
          expect(baseJdbc.jinst.addOption.called).to.be.true;
          expect(baseJdbc.jinst.setupClasspath.called).to.be.true;
          done();
        });
      });
      describe("JVM initialized", function(){
        beforeEach(function(){
          stub(baseJdbc.jinst, "isJvmCreated", function(){
            return true;
          });
          stub(baseJdbc.jinst, "addOption", function(){
            return {};
          });
          stub(baseJdbc.jinst, "setupClasspath", function(){
            return {};
          });
        })
        afterEach(function(){
          baseJdbc.jinst.isJvmCreated.restore();
          baseJdbc.jinst.addOption.restore();
          baseJdbc.jinst.setupClasspath.restore();
        })
        it("Should not call JVM initialization functions if JVM is initialized", function(done){
          baseJdbc.initJVM();
          expect(baseJdbc.jinst.addOption.called).to.be.false;
          expect(baseJdbc.jinst.setupClasspath.called).to.be.false;
          done();
        });
      });
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
        beforeEach(function(){
          baseJdbc.driver = stub().returns({
            initialize: function(cb) {
              throw new Error("Failed initializing client");
              cb();
            }
          });
        });
        afterEach(function(){
          baseJdbc.driver = {};
        })
        it("Should throw an error if client initialization fails", function*(done) {
          try {
            yield baseJdbc.initClient();
          } catch (e) {
            done();
          }
        });
      })
    })
    describe("query()", function(){
      describe("Success", function(){
        var createStatementStub = stub();
        var execQueryStub = stub();
        beforeEach(function(){
          // TODO - This feels like a bit of a hack, there must be a cleaner way to do this...
          baseJdbc.jdbcConnection = {
            createStatementAsync: function*(){
              createStatementStub(); // Call the stub so we can assert func was called
              return {
                executeQueryAsync: function*(){
                  execQueryStub(arguments['0']); // Call the stub so we can assert func was called
                  return {
                    toObjArrayAsync: function*(){
                      return {};
                    }
                  };
                }
              }
            }
          }
        });
        it("Should create a statement & execute a query", function*(done){
          try {
            let fakeQuery = "FakeQuery";
            yield baseJdbc.query(fakeQuery);
            expect(createStatementStub.called).to.be.true;
            expect(execQueryStub.called).to.be.true;
            expect(execQueryStub.calledWith(fakeQuery)).to.be.true;
            done();
          } catch (e) {
            console.log(e);
          }
        })
      });
      describe("Failure", function(){

      });
    });
    describe("close()", function(){

    });
  })
});
