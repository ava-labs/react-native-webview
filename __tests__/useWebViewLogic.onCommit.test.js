import React from 'react';
import { act, create } from 'react-test-renderer';
import { useWebViewLogic } from '../src/WebViewShared';

let logic;
function Probe(props) {
  logic = useWebViewLogic({
    originWhitelist: ['*'],
    onShouldStartLoadWithRequestCallback: () => {},
    ...props,
  });
  return null;
}

const commitEvent = (url) => ({
  nativeEvent: { url, loading: true, title: '', canGoBack: false, canGoForward: false },
});

describe('useWebViewLogic onCommit', () => {
  it('forwards a commit event to onCommitProp', () => {
    const onCommitProp = jest.fn();
    act(() => { create(<Probe onCommitProp={onCommitProp} />); });
    act(() => { logic.onCommit(commitEvent('https://core.app/')); });
    expect(onCommitProp).toHaveBeenCalledTimes(1);
    expect(onCommitProp.mock.calls[0][0].nativeEvent.url).toBe('https://core.app/');
  });

  it('is safe to call when no onCommitProp is supplied', () => {
    act(() => { create(<Probe />); });
    expect(() => logic.onCommit(commitEvent('https://core.app/'))).not.toThrow();
  });
});
