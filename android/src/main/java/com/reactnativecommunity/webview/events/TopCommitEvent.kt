package com.reactnativecommunity.webview.events

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * Emitted from WebViewClient.onPageCommitVisible: the navigation committed a
 * real document for the main frame and it is about to render. Counterpart of
 * iOS didCommitNavigation. Never fires for a navigation that rendered nothing
 * (HTTP 204, window.stop()), unlike topLoadingFinish. (CP-15105 B4)
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
