import React from 'react';
import { Platform } from 'react-native';
import { act, create } from 'react-test-renderer';

jest.mock('../src/RNCWebViewNativeComponent', () => {
  const React = require('react');
  const Native = React.forwardRef((props, ref) => {
    Native.lastProps = props;
    return null;
  });
  return { __esModule: true, default: Native, Commands: { loadUrl: jest.fn() } };
});

// WebView.android imports NativeRNCWebViewModule, which does a TurboModuleRegistry.getEnforcing lookup the jest preset does not stub.
jest.mock('../src/NativeRNCWebViewModule', () => ({ __esModule: true, default: {} }));

const Native = require('../src/RNCWebViewNativeComponent').default;

describe('WebView.android onCommit', () => {
  beforeAll(() => { Platform.OS = 'android'; });

  it('passes a native onCommit handler that forwards to the onCommit prop', () => {
    const WebView = require('../src/WebView.android').default;
    const onCommit = jest.fn();
    act(() => { create(<WebView source={{ uri: 'https://core.app' }} onCommit={onCommit} />); });
    expect(typeof Native.lastProps.onCommit).toBe('function');
    // Without wiring, onCommit leaks through {...otherProps} as the raw prop; it must be the useWebViewLogic wrapper.
    expect(Native.lastProps.onCommit).not.toBe(onCommit);
    act(() => {
      Native.lastProps.onCommit({ nativeEvent: { url: 'https://core.app/', loading: true, title: '', canGoBack: false, canGoForward: false } });
    });
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit.mock.calls[0][0].nativeEvent.url).toBe('https://core.app/');
  });

  it('leaves the native onCommit prop undefined when the app passes none', () => {
    const WebView = require('../src/WebView.android').default;
    act(() => { create(<WebView source={{ uri: 'https://core.app' }} />); });
    expect(Native.lastProps.onCommit).toBeUndefined();
  });
});
