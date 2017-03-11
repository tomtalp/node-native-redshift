const stub   = require('sinon').stub
    , spy    = require('sinon').spy
    , expect = require('chai').expect
    , utils  = require('../../src/lib/utils')
    , mocks  = require('../mocks/utils')
    ;

describe("Utils", function(){
  describe("Validate config", function(){
    // describe("validateConf()", function(){
    //   let stubs = [];
    //   let fakeConf = mocks.fakeConf;
    //   beforeEach(function(){
    //     stubs.push(stub(utils, 'validateDriverType', function(){
    //       console.log("Shi");
    //       return {};
    //     }));
    //     stubs.push(stub(utils, 'validateDriverConfig', function(){
    //       return {};
    //     }));
    //     stubs.push(stub(utils, 'validateConnInfo', function(){
    //       return {};
    //     }));
    //   })
    //   afterEach(function(){
    //     for(s of stubs) {
    //       s.restore();
    //     }
    //   })
    //   it("Should validate the driver type", function(done){
    //     try {
    //       console.log(utils.validateDriverType);
    //       utils.validateDriverType();
    //       utils.validateConf(fakeConf);
    //       // expect(utils.validateDriverType.called).to.be.true;
    //       // expect(utils.validateDriverType.calledWith(fakeConf.driverType)).to.be.true;
    //       done();
    //     } catch (e) {
    //       console.log("Err - ", e);
    //     }
    //   })
    // });
    describe("validateDriverType()", function(){
      it("Should throw an error if driver type is unknown", function(done) {
        try {
          let invalidDriver = mocks.invalidDriver;
          utils.validateDriverType(invalidDriver);
        } catch (e) {
          done()
        }
      });
    });
    describe("validateConnInfo()", function(){
      it("Should throw an error if not all connection info properties exist", function(){
        let funcSpy = spy(utils, 'validateConnInfo');
        let missingConfs = [mocks.confWithMissingData1, mocks.confWithMissingData2, mocks.confWithMissingData3, mocks.confWithMissingData4]
        for(conf of missingConfs) {
          try {
            utils.validateConnInfo(conf);
          } catch (e) {
            
          }
        }
        expect(funcSpy.alwaysThrew()).to.be.true;
      });
    });
  })
});
