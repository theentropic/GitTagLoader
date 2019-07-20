import tl = require('azure-pipelines-task-lib/task');
import shell = require('shelljs');

async function run() {
    try {
        const lines: string = tl.getInput('lines', true);
        const prefix: string = tl.getInput('prefix', false) || '';
        let filter: string = tl.getInput('filter', true);
        
        if (!parseInt(lines, 10)) {
            tl.setResult(tl.TaskResult.Failed, `lines parameter must be a valid number`, true);
            return;
        }

        if (!shell.which('git')) {
            tl.setResult(tl.TaskResult.Failed, `git is required to run this script`, true);
            return;
        }

        let cmd = 'git describe --tags --abbrev=0';
        if (filter !== '' && filter.toLowerCase() !== 'latest')
            cmd += ` --match ${filter}`;

        let exec = shell.exec(cmd, { silent: true });
        if (exec.code !== 0) {
            tl.setResult(tl.TaskResult.Failed, exec.stderr, true);
            return;
        }
        const tag = exec.stdout.replace(/[\r\n]$/, '');

        tl.setVariable(`${prefix}Tag.Label`, tag);
        console.debug(`Found tag`, tag);

        exec = shell.exec(`git tag -n${lines} "${tag}"`, { silent: true });
        if (exec.code !== 0) {
            tl.setResult(tl.TaskResult.Failed, exec.stderr, true);
            return;
        }

        const annot = exec.stdout.replace(/\s*$/, '').replace(new RegExp(`^${tag}\\s*`), '').replace(/^[ ]*/gm, '');
        tl.setVariable(`${prefix}Tag.Annotation`, annot);
        tl.setResult(tl.TaskResult.Succeeded, '', true);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();