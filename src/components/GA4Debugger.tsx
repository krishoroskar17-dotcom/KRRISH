import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import { GA4EventPayload } from '../types';
import { Activity, CheckCircle2, ChevronDown, ChevronUp, Copy, ExternalLink, Trash2, X } from 'lucide-react';

const REQUIRED_PRD_EVENTS = [
  { event: 'page_view', description: 'Opens page (page_path)' },
  { event: 'search', description: 'Searches product (search_term)' },
  { event: 'select_category', description: 'Selects category (category_name)' },
  { event: 'select_item', description: 'Opens product (item_id, item_name)' },
  { event: 'add_to_wishlist', description: 'Saves product (item_id, price)' },
  { event: 'add_to_cart', description: 'Adds product (item_id, value, currency)' },
  { event: 'select_promotion', description: 'Clicks banner (promotion_name)' },
  { event: 'view_cart', description: 'Opens cart (value, items)' },
  { event: 'begin_checkout', description: 'Starts checkout (value, items)' },
  { event: 'purchase', description: 'Completes purchase (transaction_id, value)' },
];

export const GA4Debugger: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<GA4EventPayload[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<GA4EventPayload | null>(null);
  const [measurementId, setMeasurementId] = useState(analytics.getMeasurementId());
  const [idInput, setIdInput] = useState(analytics.getMeasurementId());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'checklist' | 'config'>('stream');

  useEffect(() => {
    const unsubscribe = analytics.subscribe((updated) => {
      setEvents(updated);
      if (updated.length > 0 && !selectedEvent) {
        setSelectedEvent(updated[0]);
      }
    });
    return unsubscribe;
  }, [selectedEvent]);

  // Tracked unique events
  const trackedSet = new Set(events.map((e) => e.event));
  const accuracyPercentage = Math.round((REQUIRED_PRD_EVENTS.filter(r => trackedSet.has(r.event as any)).length / REQUIRED_PRD_EVENTS.length) * 100);

  const handleSaveId = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.setMeasurementId(idInput.trim());
    setMeasurementId(idInput.trim());
  };

  const copyEventStream = () => {
    navigator.clipboard.writeText(JSON.stringify(events, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm tracking-wide">GA4 Real-Time Event Inspector</span>
          </div>
          <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
            {accuracyPercentage}% Target KPI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyEventStream}
            title="Copy all event JSON"
            className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Export'}</span>
          </button>
          <button
            onClick={() => analytics.clearEvents()}
            title="Clear events"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('stream')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeTab === 'stream'
              ? 'border-blue-600 text-blue-600 bg-white font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Live Stream ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-blue-600 text-blue-600 bg-white font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          PRD Checklist ({trackedSet.size}/10)
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-blue-600 text-blue-600 bg-white font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Measurement ID
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[280px]">
        {activeTab === 'stream' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {/* Event list */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {events.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No events fired yet. Click buttons, view products, search, or add items to cart to see live GA4 events.
                </div>
              ) : (
                events.map((ev) => {
                  const isSelected = selectedEvent?.id === ev.id;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-xs'
                          : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="font-mono">{ev.event}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {ev.timestamp}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Event payload detail */}
            <div className="bg-slate-950 text-slate-200 rounded-lg p-3 font-mono text-[11px] overflow-x-auto max-h-[360px]">
              {selectedEvent ? (
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-slate-400">
                    <span className="text-emerald-400 font-semibold">{selectedEvent.event}</span>
                    <span>{selectedEvent.timestamp}</span>
                  </div>
                  <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(selectedEvent.params, null, 2)}
                  </pre>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Dispatch: window.dataLayer + gtag</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2));
                      }}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy Payload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-12">
                  Select an event to inspect its parameters.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-2">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">PRD GA4 Event Coverage: {accuracyPercentage}%</p>
                <p className="text-[11px] text-blue-600">All 10 user journey touchpoints defined in Section 10</p>
              </div>
              <span className="text-sm font-bold bg-white text-blue-700 px-2 py-1 rounded shadow-xs">
                {trackedSet.size} / 10
              </span>
            </div>

            <div className="space-y-1.5">
              {REQUIRED_PRD_EVENTS.map((item) => {
                const isFired = trackedSet.has(item.event as any);
                return (
                  <div
                    key={item.event}
                    className={`flex items-center justify-between p-2 rounded border text-xs ${
                      isFired
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isFired ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <div>
                        <span className="font-mono font-semibold">{item.event}</span>
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isFired
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isFired ? 'FIRED' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Connect Your Real Google Analytics Property</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Enter your GA4 Measurement ID (from Google Analytics 4 Admin &gt; Data Streams). The app will automatically inject <code>gtag.js</code> and transmit live events to your Google Analytics dashboard.
              </p>
            </div>

            <form onSubmit={handleSaveId} className="space-y-2">
              <label className="block text-slate-600 font-medium text-[11px]">
                GA4 Measurement ID (e.g., G-XXXXXXXXXX)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
                >
                  Save & Connect
                </button>
              </div>
            </form>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Measurement ID:</span>
                <span className="font-mono font-semibold text-slate-800">{measurementId || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Local DataLayer Sync:</span>
                <span className="text-emerald-600 font-semibold">Active (window.dataLayer)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
