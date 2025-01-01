export const performanceMonitor = {
  marks: new Map<string, number>(),

  start(markName: string) {
    this.marks.set(markName, performance.now());
    performance.mark(`${markName}-start`);
  },

  end(markName: string) {
    const startTime = this.marks.get(markName);
    if (startTime) {
      const duration = performance.now() - startTime;
      performance.mark(`${markName}-end`);
      performance.measure(markName, `${markName}-start`, `${markName}-end`);
      console.log(`Performance: ${markName} took ${duration.toFixed(2)}ms`);
      this.marks.delete(markName);
    }
  },

  logNavigationTiming() {
    if (performance && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log('Navigation Timing:', {
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          serverResponse: navigation.responseEnd - navigation.requestStart,
          domLoad: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          fullPageLoad: navigation.loadEventEnd - navigation.startTime,
        });
      }
    }
  },
};