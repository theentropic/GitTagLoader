"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var assert = __importStar(require("assert"));
var ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
var shell = __importStar(require("shelljs"));
describe('Tag Loader Tests', function () {
    before(function () {
        shell.exec("git tag -a TestTag -m \"Here is a test tag for unit testing\"");
    });
    after(function () {
        shell.exec("git tag -d TestTag");
    });
    it('should succeed with latest tag', function (done) {
        // Add success test here
        this.timeout(5000);
        var tp = path.join(__dirname, 'success.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label') >= 0, true, "should display Tag.Label");
        done();
    });
    it('should succeed with filtered tag', function (done) {
        this.timeout(5000);
        var tp = path.join(__dirname, 'filter.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label to TestTag') >= 0, true, "should display Tag.Label to TestTag");
        done();
    });
    it('it should fail if tag could not be found', function (done) {
        this.timeout(5000);
        var tp = path.join(__dirname, 'failure.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'fatal: No names found, cannot describe anything.', 'error issue output');
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label'), -1, "Should not display Tag.Label");
        done();
    });
    it('it should fail if lines is not valid', function (done) {
        this.timeout(5000);
        var tp = path.join(__dirname, 'lines.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'lines parameter must be a valid number', 'error issue output');
        assert.equal(tr.stdout.indexOf('Setting variable Tag.Label'), -1, "Should not display Tag.Label");
        done();
    });
});
