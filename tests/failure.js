"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tmrm = require("azure-pipelines-task-lib/mock-run");
var path = require("path");
var taskPath = path.join(__dirname, '..', 'GitTagLoader', 'index.js');
var tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('filter', 'ThisTagNameDoesNotExist');
tmr.setInput('lines', '100');
tmr.run();
