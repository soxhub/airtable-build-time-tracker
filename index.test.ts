/**
 * Module dependencies.
 */

import * as core from '@actions/core';
import fsMock from 'mock-fs';
import nock from 'nock';
import run from './airtable-build-time';

/**
 * Test `run`.
 */

describe('run()', () => {
  nock.disableNetConnect();

  afterEach(() => {
    fsMock.restore();
  });

  it('should call `core.setFailed` with error if required `airtable_base_id` is not present', async () => {
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_base_id');
  });

  it('should call `core.setFailed` with error if required `airtable_record_id` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_record_id');
  });

  it('should call `core.setFailed` with error if required `airtable_field_name` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_field_name');
  });

  it('should call `core.setFailed` with error if required `airtable_table_name` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('').mockReturnValueOnce('').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_table_name');
  });

  it('should call `core.setFailed` with error if required `airtable_token` is not present', async () => {
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_token');
  });

  it('should call `core.setFailed` with error if airtable call throws', async () => {
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
    nock('https://api.airtable.com/v0').patch('/foo/bar/?').reply(404);
    fsMock({
      './coverage/clover.xml':
        '<?xml version="1.0" encoding="UTF-8"?><coverage><project><metrics statements="22" coveredstatements="22"/></project></coverage>'
    });
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('foo')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('bar')
      .mockReturnValueOnce('boz');

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Could not find what you are looking for');
  });
});
