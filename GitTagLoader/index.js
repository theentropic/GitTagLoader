"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var shell = require("shelljs");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var lines, prefix, filter, cmd, exec, tag, annot;
        return __generator(this, function (_a) {
            try {
                lines = tl.getInput('lines', true);
                prefix = tl.getInput('prefix', false) || '';
                filter = tl.getInput('filter', true);
                if (!parseInt(lines, 10)) {
                    tl.setResult(tl.TaskResult.Failed, "lines parameter must be a valid number", true);
                    return [2 /*return*/];
                }
                if (!shell.which('git')) {
                    tl.setResult(tl.TaskResult.Failed, "git is required to run this script", true);
                    return [2 /*return*/];
                }
                cmd = 'git describe --tags --abbrev=0';
                if (filter !== '' && filter.toLowerCase() !== 'latest')
                    cmd += " --match " + filter;
                exec = shell.exec(cmd, { silent: true });
                if (exec.code !== 0) {
                    tl.setResult(tl.TaskResult.Failed, exec.stderr, true);
                    return [2 /*return*/];
                }
                tag = exec.stdout.replace(/[\r\n]$/, '');
                tl.setVariable(prefix + "Tag.Label", tag);
                console.log("Setting variable Tag.Label to", tag);
                exec = shell.exec("git tag -n" + lines + " \"" + tag + "\"", { silent: true });
                if (exec.code !== 0) {
                    tl.setResult(tl.TaskResult.Failed, exec.stderr, true);
                    return [2 /*return*/];
                }
                annot = exec.stdout.replace(/\s*$/, '').replace(new RegExp("^" + tag + "\\s*"), '').replace(/^[ ]*/gm, '');
                tl.setVariable(prefix + "Tag.Annotation", annot);
                console.log("Setting variable Tag.Annotation to", annot);
                annot = annot.replace(/(\r\n|\r|\n)/gi, '<br>');
                tl.setVariable(prefix + "Tag.Annotation.Html", annot);
                console.log("Setting variable Tag.Annotation.Html to", annot);
                tl.setResult(tl.TaskResult.Succeeded, '', true);
            }
            catch (err) {
                tl.setResult(tl.TaskResult.Failed, err.message);
            }
            return [2 /*return*/];
        });
    });
}
run();
