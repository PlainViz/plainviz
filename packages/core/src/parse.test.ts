import { describe, it, expect } from 'vitest';
import { parse } from './parse';

describe('parse', () => {
  describe('basic parsing', () => {
    it('parses simple bar chart', () => {
      const result = parse(`
Type: Bar
Title: Test

A: 10
B: 20
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.type).toBe('bar');
        expect(result.ir.title).toBe('Test');
        expect(result.ir.labels).toEqual(['A', 'B']);
        expect(result.ir.values).toEqual([10, 20]);
      }
    });

    it('defaults to bar chart when type not specified', () => {
      const result = parse(`
A: 10
B: 20
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.type).toBe('bar');
      }
    });
  });

  describe('number cleaning', () => {
    it('handles currency format ($1,200)', () => {
      const result = parse(`
Price: $1,200
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.values).toEqual([1200]);
      }
    });

    it('handles percentage format (50%)', () => {
      const result = parse(`
Rate: 50%
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.values).toEqual([50]);
      }
    });

    it('handles numbers with commas (1,000,000)', () => {
      const result = parse(`
Big: 1,000,000
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.values).toEqual([1000000]);
      }
    });
  });

  describe('whitespace handling', () => {
    it('ignores empty lines', () => {
      const result = parse(`
Type: Bar

A: 10

B: 20

`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.labels).toEqual(['A', 'B']);
      }
    });

    it('ignores comment lines (// and #)', () => {
      const result = parse(`
// This is a comment
Type: Bar
# Another comment
A: 10
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.labels).toEqual(['A']);
      }
    });
  });

  describe('error handling', () => {
    it('reports error for missing colon', () => {
      const result = parse(`
Type: Bar
A 10
`);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors[0].message).toContain("Missing ':'");
        expect(result.errors[0].line).toBe(3);
      }
    });

    it('reports error for invalid number', () => {
      const result = parse(`
Type: Bar
A: abc
`);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors[0].message).toContain("not a valid number");
        expect(result.errors[0].hint).toBeDefined();
      }
    });

    it('reports error for invalid chart type', () => {
      const result = parse(`
Type: InvalidType
A: 10
`);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors[0].message).toContain("Unknown chart type");
        expect(result.errors[0].hint).toContain("Valid types");
      }
    });

    it('reports error when no data points', () => {
      const result = parse(`
Type: Bar
Title: Empty
`);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors[0].message).toContain("No data points");
      }
    });
  });

  describe('title parsing', () => {
    it('strips quotes from title', () => {
      const result = parse(`
Title: "Quoted Title"
A: 10
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.title).toBe('Quoted Title');
      }
    });

    it('handles title without quotes', () => {
      const result = parse(`
Title: Unquoted Title
A: 10
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.title).toBe('Unquoted Title');
      }
    });
  });

  describe('multi-series parsing', () => {
    it('parses comma-separated values as multi-series', () => {
      const result = parse(`
Type: Bar
Legend: 阿里, 腾讯
营收: 100, 80
利润: 30, 25
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.labels).toEqual(['营收', '利润']);
        expect(result.ir.series).toBeDefined();
        expect(result.ir.series?.length).toBe(2);
        expect(result.ir.series?.[0].name).toBe('阿里');
        expect(result.ir.series?.[0].values).toEqual([100, 30]);
        expect(result.ir.series?.[1].name).toBe('腾讯');
        expect(result.ir.series?.[1].values).toEqual([80, 25]);
      }
    });

    it('uses default series names when Legend not provided', () => {
      const result = parse(`
Type: Bar
A: 10, 20
B: 30, 40
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.series?.[0].name).toBe('Series 1');
        expect(result.ir.series?.[1].name).toBe('Series 2');
      }
    });

    it('supports Chinese commas', () => {
      const result = parse(`
Type: Bar
A: 100，200
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.series?.length).toBe(2);
      }
    });

    it('preserves number formatting with commas', () => {
      const result = parse(`
Type: Bar
Sales: $1,200
`);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.ir.values).toEqual([1200]);
        expect(result.ir.series).toBeUndefined();
      }
    });
  });
});
