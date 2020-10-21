import formatRequestOptions from 'utils/formatRequestOptions';

describe('Format request options', () => {
  test('Various format options', () => {
    const spyStringify = jest.spyOn(JSON, 'stringify');

    const opt1 = formatRequestOptions(undefined, undefined);

    expect(opt1).toEqual({
      method: 'POST',
      body: undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const opt2 = formatRequestOptions('some data', 'text/html', 'PUT');

    expect(opt2).toEqual({
      method: 'PUT',
      body: '"some data"',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    const payload3 = { user: 'user_one' };
    const opt3 = formatRequestOptions(payload3, undefined, 'DELETE');

    expect(opt3).toEqual({
      method: 'DELETE',
      body: '{"user":"user_one"}',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(spyStringify).toBeCalledTimes(3);
    expect(spyStringify).toBeCalledWith(payload3);
  });
});
