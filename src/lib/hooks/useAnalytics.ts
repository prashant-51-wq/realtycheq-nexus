import { useCallback } from 'react';

export type AnalyticsEvent = 
  | 'view_listing'
  | 'start_rfq'
  | 'submit_bid'
  | 'add_to_compare'
  | 'purchase_membership'
  | 'start_escrow'
  | 'post_opportunity'
  | 'save_property'
  | 'schedule_visit'
  | 'contact_vendor'
  | 'apply_filter'
  | 'apply_filters'
  | 'switch_view_mode'
  | 'view_opportunity'
  | 'view_vendor'
  | 'hire_vendor';

interface AnalyticsEventData {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsProvider {
  track: (event: AnalyticsEvent, data?: AnalyticsEventData) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name: string, properties?: Record<string, any>) => void;
}

// Mock analytics provider - replace with actual analytics service
const mockAnalyticsProvider: AnalyticsProvider = {
  track: (event, data) => {
    console.log('📊 Analytics Event:', event, data);
    // In production, send to analytics service
  },
  identify: (userId, traits) => {
    console.log('👤 Analytics Identify:', userId, traits);
  },
  page: (name, properties) => {
    console.log('📄 Analytics Page:', name, properties);
  },
};

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, data?: AnalyticsEventData) => {
    try {
      mockAnalyticsProvider.track(event, {
        timestamp: Date.now(),
        url: window.location.href,
        ...data,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    try {
      mockAnalyticsProvider.identify(userId, traits);
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }, []);

  const page = useCallback((name: string, properties?: Record<string, any>) => {
    try {
      mockAnalyticsProvider.page(name, {
        timestamp: Date.now(),
        url: window.location.href,
        ...properties,
      });
    } catch (error) {
      console.error('Analytics page error:', error);
    }
  }, []);

  return { track, identify, page };
}