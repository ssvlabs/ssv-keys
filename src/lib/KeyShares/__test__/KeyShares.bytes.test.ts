import { KeySharesItem } from '../../../main';

import mockKeySharesItemWithOperators from './mock-key-shares/item-with-operators.json';

let keySharesItem: KeySharesItem;

describe('KeyShares.buildSharesFromBytes', () => {
  beforeAll(async () => {
    keySharesItem = new KeySharesItem();
  });

  it('should correctly build shares from valid bytes and operator count', () => {
    const bytes = mockKeySharesItemWithOperators.payload.sharesData;
    const operatorCount = mockKeySharesItemWithOperators.payload.operatorIds.length;

    const result = keySharesItem.buildSharesFromBytes(bytes, operatorCount);

    const expectedSharesPublicKeys = [
      '0x94cea87c658901ea00149e2b04ff14a57fe19e9487e6f91442cbf2142543c9aae0959a0c4a6dd67941bec2310b89f93f',
      '0xa00b29a17b86d76c5e1eda34df10c3fe65283413fd105333f76ee4029a457158a9fb33d1ef93abf811e70dcdccef4f1f',
      '0x84e2b44fc937863d8be4cef0f5584f4af14ec950f2d1dbb7301b3f316565985a9ea1676c1277e9280467adb6d9a69f05',
      '0x80d3a4a9c4b8b6b5f9753b51abac9f23397f5d50217785cb5245106f99f4e821d1f762c87f13b45ea7ebe4adeffd7d28'
    ];
    const expectedEncyptedSharesPublicKeys = [
      'H4TitE/JN4Y9i+TO8PVYT0rxTslQ8tHbtzAbPzFlZZhanqFnbBJ36SgEZ6222aafBYDTpKnEuLa1+XU7UausnyM5f11QIXeFy1JFEG+Z9Ogh0fdiyH8TtF6n6+St7/19KDRbPJ+uWL5fZiup/mEPx64Bl+dIwpZUK5S8ll3yW8jiySTMuGQuH3g5nLTWp/m2RB1EjzI2ylGi8yCdNXwxmItd5vN4QqU7AUQaceqGf86gyhMz3/kvv/ELxMx459Fu/SeS/bywHwSZAz2CLtNnZ1W35TkyEHRvSVIlKZwjrGUUiURfniMQsecbpIht/6P6z6xlkAwFGaCnGInV/WdyZ7LpfGLCpEcKO46ksx+9+2YXxS09mcYFBw==',
      'Ms93w6AAA8wtZrvh9WcairDU5+tst+0hv7dwrsX3PlNrRSRQxXvvu+ofiaQnKi98m6nF6h3rBxxDW/J3zoWvsXN3ZSb976a71mtCXMS1+wRIRgt5xe3VIyny9+24q+AVy+cZljQmSVFVUWwS25jxbx2f4p170j3UQbPmG35Keg3q+Q8qGq3S1WMMq85aHKKA5gUoZUSvAbBoN5J7omLxybc0fQzApEsNCE0zhh11tnVSncWKNP364ja5x6cPA5OYwnj7j1stHP0F66fRUHwKrslTzBPJOH6DF/NdxbLk7QuWmXeK0Py1BFsM2pmqjQ925bhuaEzb6JB4V3Gnxaox+AAGjAyqa3Pzvr/4zADL98wHLFjM4BCwWg==',
      'l9zMs9P9oM6STHy0kkL5yrQtRxXLksa4fFQ8pVul88TrW6UqMMWRDdyf7ZXGEONJk67Qwn7JOPRG7y0wgJJlEPFVmv8s8+BWF8b274myC/nPe8UFJQPxFAM4O3O5Aw07XjFpFw3pYl+Rw1ge3WWnAJR11NGQ7Cbnhrobo0DT9gV+bAaNEuJET+7kEgq4YbeCUeFSPoSBwDOF4JONAStJLp3kotS+MdXIqdBUolOg6FdOzt4rTc6hrTbRxBWIYNfg3WRCGUq8VUnJAYofhHTcrc7Am9yU8XJSn/IdSlADIbEL4tcW3BC22IQMCqYR96GhuurjR0Wn3jgyIU8ao6eoWLn2GDAzcpOA9aZL/XI3uwsW/gVhSmpAbg==',
      '/wZrjzX+j0d+RXE0U7DXV3alw4I1A/UKfYWNlRhJUxk8ycpsjUD7/RnFFLYYdJhmqypmleSpem63R8DJu3BKYu5bOpk4sqX0hc6qhZ9ZSSgbrdk7STWgFKRUb3PTrikZHBPKkwJ2/jZKEdUd5HglmW7mUQ9SAVAUEROuxnUhMOCTTEMCJPFxPG8rCjHZTijq6u9s0VOk9Cv25gwQ/PQkMj5BbLYKY9MQ3UxnTRS/jhtmNKt9s+I5J9dTHIG4MV1LDEoIssE4bySajvPbPSf4GYraIgeUISYU5YEwAwLY9azDRJj48kk1rZKG/PgQukq4J42dVD/HQvCA71lvMZRR7PJpIj2gCWhTLUamynOEjtGyPoj8VDeo5g=='
    ];
    expect(result.sharesPublicKeys).toEqual(expectedSharesPublicKeys);
    expect(result.encryptedKeys).toEqual(expectedEncyptedSharesPublicKeys);
    expect(result.sharesPublicKeys).toHaveLength(operatorCount);
    expect(result.encryptedKeys).toHaveLength(operatorCount);
  });

  it('should handle invalid byte string format', () => {
    const invalidBytes = 'not a valid hex string';
    const operatorCount = 4;

    expect(() => keySharesItem.buildSharesFromBytes(invalidBytes, operatorCount)).toThrow();
  });

  it('should handle invalid operator count', () => {
    const bytes = mockKeySharesItemWithOperators.payload.sharesData;
    const invalidOperatorCount = -1;

    expect(() => keySharesItem.buildSharesFromBytes(bytes, invalidOperatorCount)).toThrow();
  });
});
