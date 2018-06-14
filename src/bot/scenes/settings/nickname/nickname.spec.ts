import {sanitize, validate} from './change/change';

describe('nickname scene', () => {
    test('sanitize', (): any => {
        expect(sanitize('dsd')).toBe('dsd');
        expect(sanitize(' a v c')).toBe('a');
        expect(sanitize('  a v c')).toBe('a');
        expect(sanitize('  ')).toBe('');
        expect(sanitize('')).toBe('');
        expect(sanitize('ab as ss')).toBe('ab');
    });
    test('validate', (): any => {
        const good_variants = ['dss', 'sdsdasd', 'asdddddddd'];
        const bad_variants = ['0', '01', '012345678901234'];
        good_variants.forEach((variant: string) => expect(validate(variant)).not.toBeTruthy());
        bad_variants.forEach((variant: string) => expect(validate(variant)).toBeTruthy());
    });
});