import tl = require('azure-pipelines-task-lib/task');
import shell = require('shelljs');

async function run() {
    try {
        const lines: string = tl.getInput('lines', true);
        let filter: string = tl.getInput('filter', true);

        if (shell.which('git')) {
            tl.setResult(tl.TaskResult.Failed, `git is required to run this script`, true);
            return;
        }

        let cmd = 'git describe --tags --abbrev=0';
        if (filter !== '' || filter.toLowerCase() !== 'latest')
            cmd += ` --match ${filter}`;

        const tag = shell.exec(cmd, { silent: true }).stdout;
        if (tag === '') {
            tl.setResult(tl.TaskResult.Failed, `Specified tag ${filter} not found`, true);
            return;
        }

        
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();