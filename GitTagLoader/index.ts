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
        if (filter !== '' || filter.toLowerCase() !== 'latest')
            cmd += ` --match ${filter}`;

        const tag = shell.exec(cmd, { silent: true }).stdout;
        if (tag === '') {
            tl.setResult(tl.TaskResult.Failed, `Specified tag ${filter} not found`, true);
            return;
        }
        
        tl.setVariable(`${prefix}Tag.Label`, tag);
        console.log(`Found tag`, tag);

        const annot = shell.exec(`git tag -n${lines} "${tag}"`).stdout;
        tl.setVariable(`${prefix}Tag.Annotation`, annot);
        tl.setResult(tl.TaskResult.Succeeded, `Finished processing`, true);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();