const { assert, expect } = require('chai');
const driverFactory = require('../../lib/driver-factory');
const Driver = require('../../lib/driver');
const parseVersion = require('../../lib/util/parse-version');

describe('lib/driver-factory.js', function () {

  describe('interface', function () {

    it('is a constructor function', function () {
      assert.strictEqual(typeof driverFactory, 'function', 'exports a constructor function');
    });

    it('returns latest datastax driver by default', function () {
      // arrange
      const context = null;
      const parsed = parseVersion('3.1.0');

      // act
      const driver = driverFactory(context);

      // assert
      assert.strictEqual(driver.config.version, '3.1.0');
      assert.deepEqual(driver.config.parsedCqlVersion, parsed);
      assert.instanceOf(driver, Driver.DatastaxDriver);
    });

    it('returns datastax driver set to version 3.0 if cqlVersion is equal to 3.0', function () {
      testInstance('datastax', '3.0.0', '3.0.0', Driver.DatastaxDriver);
    });

    it('exposes DataStax types and consistencies', function () {
      expect(driverFactory.consistencies).to.be.an('object');
      expect(driverFactory.dataTypes).to.be.an('object');
      expect(driverFactory.valueTypes).to.be.an('object');
    });

    function testInstance(driver, cqlVersion, expectedVersion, expectedInstance) {
      // arrange
      const context = {
        config: {
          driver,
          protocolOptions: { maxVersion: cqlVersion }
        }
      };
      const parsed = parseVersion(expectedVersion);

      // act
      const instance = driverFactory(context);
      const config = instance.config;

      // assert
      assert.deepEqual(config.parsedCqlVersion, parsed);
      assert.instanceOf(instance, expectedInstance);
    }

  });

});
