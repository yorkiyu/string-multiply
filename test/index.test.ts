import largeNumMulti from '../src';

// 不支持
test('十进制数字序列应当由[0-9]的数字组成', () => {
  expect(() => largeNumMulti('%$#', '#()')).toThrow();
});

// 空字符串
test('数字序列不能为空字符串', () => {
  expect(() => largeNumMulti('', '0.1')).toThrow();
});

// 字符串最大长度
test('数字序列最大长度不超过20000个字符', () => {
  expect(() => {
    const nums = Array(20001).fill(1).join('');
    largeNumMulti(nums, '0.1');
  }).toThrow();
});

// 十进制，异常数字
test('十一进制数字序列应当有[0-9aA]组成', () => {
  expect(() => largeNumMulti('0xd4', '1', 10)).toThrow();
});

// 异常数字
test('数字序列小数点使用不合法', () => {
  expect(() => largeNumMulti('10.2.34', '0.1')).toThrow();
});

// 二进制默认，元素不在指定范围报错
test('二进制数字序列应当有[01]组成', () => {
  expect(() => largeNumMulti('0b10', '0B13')).toThrow();
});

// 不同进制，抛出异常
test('二进制与八进制序列相乘，不同进制相乘不合法', () => {
  expect(() => largeNumMulti('0o4', '0b1')).toThrow();
});

// 十进制正小数
test('十进制小数数字序列相乘 => 0.1 * 0.1 = 0.01', () => {
  expect(largeNumMulti('0.1', '0.1', 10)).toEqual('0.01');
});

// 十进制负小数
test('十进制负数小数数字序列相乘 => -0.1 * 0.1 = -0.01', () => {
  expect(largeNumMulti('-0.1', '0.1', 10)).toEqual('-0.01');
});

// 十进制大整数
test('十进制数字序列相乘 => 1234567890123456789 * 987654321 = 1219326311248285321112635269', () => {
  expect(largeNumMulti('1234567890123456789', '987654321')).toEqual('1219326311248285321112635269');
});

// 十进制大整数小数点
test('十进制小数数字序列相乘 => 61234523.456 * 1.98273 = 121411526.69191488', () => {
  expect(largeNumMulti('61234523.456', '1.98273')).toEqual('121411526.69191488');
});

// 二进制默认前缀
test('二进制数字序列相乘，前缀隐私探测进制类型 => 0b10 * 0B11 = 110', () => {
  expect(largeNumMulti('0b10', '0B11')).toEqual('110');
});

// 二进制负数
test('二进制负数数字序列相乘 => -0b10 * 0B11 = -110', () => {
  expect(largeNumMulti('-0b10', '0B11')).toEqual('-110');
});

// 二进制 小数
test('二进制小数数字序列相乘 => 0b1.1 * 0B1.0 = 1.1', () => {
  expect(largeNumMulti('0b1.1', '0B1.0')).toEqual('1.1');
});

// 二进制大数
test('二进制数字序列相乘 => 1010101010100110 * 11100001111110001110111 = 100101101010000111010101011101100101010', () => {
  expect(largeNumMulti('1010101010100110', '11100001111110001110111', 2)).toEqual('100101101010000111010101011101100101010');
});

// 十六进制相乘
test('十六进制数字序列相乘 => fA34Ed * ffFfb = FA349ECF75F', () => {
  expect(largeNumMulti('fA34Ed', 'ffFfb', 16)).toEqual('FA349ECF75F');
});

// 十六进制相乘
test('十六进制数字序列相乘 => A * F = 96', () => {
  expect(largeNumMulti('A', 'F', 16)).toEqual('96');
});

// 十六进制小数相乘
test('十六进制小数数字序列相乘 => F * 0.2 = 1.E', () => {
  expect(largeNumMulti('F', '0.2', 16)).toEqual('1.E');
});

// 三十进制相乘
test('三十进制数字序列相乘 => abcdefghigk * 2839lmn = NH0LMPNOPK1TINDDA', () => {
  expect(largeNumMulti('abcdefghigk', '2839lmn', 30)).toEqual('NH0LMPNOPK1TINDDA');
});

// 三十进制
test('三十进制数字序列相乘 => N * 2 = 1G', () => {
  expect(largeNumMulti('N', '2', 30)).toEqual('1G');
});

// 三十六进制相乘
test('三十六进制数字序列相乘 => z * 2 = 1Y', () => {
  expect(largeNumMulti('z', '2', 36)).toEqual('1Y');
});

// 二十一进制相乘
test('二十一进制数字序列相乘 => k * 2 = 1J', () => {
  expect(largeNumMulti('k', '2', 21)).toEqual('1J');
});


