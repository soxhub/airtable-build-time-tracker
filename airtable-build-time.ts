/**
 * Module dependencies.
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import Airtable from 'airtable';

/**
 * Run.
 */

export default async function run() {
  try {
    const airtableBaseId = core.getInput('airtable_base_id', { required: true });
    const airtableTableName = core.getInput('airtable_table_name', { required: true });
    const airtableToken = core.getInput('airtable_token', { required: true });
    // const buildStepName = core.getInput('build_step_name', { required: true });

    Airtable.configure({ apiKey: airtableToken });

    const airtable = Airtable.base(airtableBaseId);

    const buildTime = 0;

    core.info(`context: ${JSON.stringify(github.context)}`);
    core.info(`Build time: ${buildTime}`);

    // github.context.payload.steps.forEach((step: any) => {
    //   if (step.name === buildStepName) {
    //     const { started_at, completed_at } = step;

    //     const elapsedTime = new Date(completed_at).getTime() - new Date(started_at).getTime();

    //     core.info(`Build time: ${elapsedTime}ms`);

    //     buildTime = elapsedTime;
    //   }
    // });

    await airtable(airtableTableName).create(
      [
        {
          fields: {
            author: github.context.actor,
            build_time: buildTime,
            date: github.context.payload.head_commit.timestamp,
            pull_request: github.context.payload.pull_request?.number,
            test_run: github.context.payload.workflow_run?.id
          }
        }
      ],
      { typecast: true }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}
