import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as shell from 'shelljs';

describe('Tag Loader Tests', function () {

    before(function () {
        shell.exec(`git tag -a TestTag -m "Here is a test tag for unit testing"`);
    });

    after(() => {
        shell.exec(`git tag -d TestTag`);
    });

    it('should succeed with latest tag', function (done: MochaDone) {
        // Add success test here
        this.timeout(5000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label') >= 0, true, "should display Tag.Label");
        done();
    });
    it('should succeed with filtered tag', function (done: MochaDone) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'filter.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label to TestTag') >= 0, true, "should display Tag.Label to TestTag");
        done();
    });

    it('it should fail if tag could not be found', function(done: MochaDone) {
        this.timeout(5000);
    
        let tp = path.join(__dirname, 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'fatal: No names found, cannot describe anything.', 'error issue output');
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label'), -1, "Should not display Tag.Label");
    
        done();
    });
    it('it should fail if lines is not valid', function(done: MochaDone) {
        this.timeout(5000);
    
        let tp = path.join(__dirname, 'lines.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'lines parameter must be a valid number', 'error issue output');
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label'), -1, "Should not display Tag.Label");
    
        done();
    });
});