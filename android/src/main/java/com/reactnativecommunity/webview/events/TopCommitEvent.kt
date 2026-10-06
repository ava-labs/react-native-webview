package com.reactnativecommunity.webview.events

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * Emitted from WebViewClient.onPageCommitVisible, which fires when the WebView
 * will no longer draw the previous page's content for the main frame. Counterpart
 * of iOS didCommitNavigation, but LATER: the body is already in the DOM and
 * inline head scripts and document-start injected JS have already run.
 *
 * Dispatched through the RN EventDispatcher, so it is NOT ordered relative to
 * onMessage (direct JS-module call): a new document's first postMessages can
 * reach JS before this event. Requires API 23+ (never fires on API 21-22);
 * same-document (pushState) navigations do not fire it. Use the `url` field
 * only: `title` is read from webView.getTitle() at commit time and may still be
 * the previous page's. (CP-15105 B4)
 */
class TopCommitEvent(viewId: Int, private val mEventData: WritableMap) :
  Event<TopCommitEvent>(viewId) {
  companion object {
    const val EVENT_NAME = "topCommit"
  }

  override fun getEventName(): String = EVENT_NAME

  override fun canCoalesce(): Boolean = false

  override fun getCoalescingKey(): Short = 0

  override fun dispatch(rctEventEmitter: RCTEventEmitter) =
    rctEventEmitter.receiveEvent(viewTag, eventName, mEventData)
}
