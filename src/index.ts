interface Multiply {
    (num1: string, num2: string, hexType: Numeric): string;
}

interface Entry {
    (num1: string, num2: string, hexType?: Numeric): string | null;
}

// 检查计算参数信息
interface ParamsInfo {
   flag: boolean, // 检查是否通过
   type: Numeric, // 字符串进制
   point: number, // 小数点位数
   attr:  NumericAttr, // 符号位置
   length: number, // 长度
}

interface Check {
    (num: string, hexType: Numeric): ParamsInfo;
}

interface PointCount {
    (num: string): number;
}

interface NumberOfChar {
    (num: string): number;
}

interface ToStandard {
    (num: string, numInfo?: ParamsInfo): string;
}

interface OutputFormat {
    (num: string, num1Info: ParamsInfo, num2Info: ParamsInfo): string;
}

interface Attr {
    (num: string): NumericAttr
}

interface EleRegexp {
    (hexType: Numeric): RegExp
}

enum NumericAttr {
    Neg = -1,
    Pos = 1
}

enum NumericSign {
    Neg = '-',
    Pos = '+',
    Point = '.',
}

enum HexElement {
    A = 65,
    a = 97,
    decimalCount = 10,
    diffCode = 32,
    letterCount = 26
}

// 进制定义
type Numeric = 2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|
    19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|undefined;

// 常见进制前缀
enum Prefix {
    BINARY_0b = '0b', // 二进制小写表示
    BINARY_0B = '0B', // 二进制大写表示
    OCTAL_0o = '0o', // 八进制小写表示
    OCTAL_0O = '0O', // 八进制大写表示
    HEX_0x = '0x', // 十六进制大写表示
    HEX_0X = '0X', // 十六进制大写表示
}

// 字符串最大长度
const NumMaxLength: number = 20000;

// 数值正则开头
const regexpStartStr = `^[${NumericSign.Neg}${NumericSign.Pos}]?`;

// 获取字母对应的数字
const getNumberOfChar: NumberOfChar = (char) => {
    if (/^\d$/.test(char)) {
        return +char;
    }
    const upChar = char.toUpperCase();
    return 10 + upChar.charCodeAt(0) - HexElement.A;
};

/**
 * 十进制整数字符串相乘
 * @param num1 string 十进制整数字符串
 * @param num2 string 十进制整数字符串
 */
const multiply: Multiply = (num1, num2, hexType = 10) => {
    // 初始化结果数组，两数相乘的积，位数最大为两数的位数之和
    const resArr = Array(num1.length + num2.length).fill(0);
    // 两数各个位数字与结果数字索引关系，resArr[i + j, i + j + 1]
    for (let i = num1.length - 1; i >= 0; i--) {
        for (let j = num2.length - 1; j >= 0; j--) {
            // 个位对应结果resArr数组的索引值
            let gIndex = i + j + 1;
            // 十位对应结果resArr数组的索引值
            let sIndex = i + j;
            // 当前位相乘结果值
            const tempNum = getNumberOfChar(num1[i]) * getNumberOfChar(num2[j]) + resArr[gIndex];
            // 获取个位数值
            resArr[gIndex] = tempNum % hexType;
            // 获取十位数值
            resArr[sIndex] += Math.floor(tempNum / hexType);
        }
    }
    // 格式化数字为，字符
    for (let i = 0; i < resArr.length; i++) {
        const ele = resArr[i];
        if (ele >= 10) {
            resArr[i] = String.fromCharCode(HexElement.A + ele - 10);
        }
    }

    // 结果数值转数字字符串，并把前置0，删除
    const res = resArr.join('');
    return !res ? '0' : res;
};

/**
 * 获取数值字符串的小数位数
 * @param num string 数值字符串
 */
const getPointCount: PointCount = (num) => {
    const index = num.indexOf('.');
    return index === -1 ? 0 : num.length - (index + 1);
};

/**
 * 获取数值字符的正负特性
 * @param num string 数值字符串
 */
const getAttr: Attr = (num) => {
    return /^-/.test(num) ? NumericAttr.Neg : NumericAttr.Pos;
};

const getEleRegexp: EleRegexp = (hexType = 10) => {
    const eles = [];
    for (let i = 0; i < hexType; i++) {
        if (i < 10) {
            eles.push(i);
        } else {
            eles.push(String.fromCharCode(HexElement.A + i - 10));
            eles.push(String.fromCharCode(HexElement.a + i - 10));
        }
    }
    let rangeStr = `[${eles.join('')}]+\\${NumericSign.Point}?[${eles.join('')}]*$`;
    switch (hexType) {
        case 2:
            rangeStr = `(${Prefix.BINARY_0B}|${Prefix.BINARY_0b})?${rangeStr}`;
            break;
        case 8:
            rangeStr = `(${Prefix.OCTAL_0O}|${Prefix.OCTAL_0o})?${rangeStr}`;
            break;
        case 16:
            rangeStr = `(${Prefix.HEX_0X}|${Prefix.HEX_0x})?${rangeStr}`;
            break;
    }
    return new RegExp(`${regexpStartStr}${rangeStr}`);
};

/**
 * 检查字符串格式，若是数值字符串，同时返回数值类型
 * @param num string 待检查字符串
 */
const checkParams: Check = (num, hexType) => {
    if (typeof num !== 'string') {
        throw new Error('输入数字序列必须为字符串');
    }

    if (hexType && typeof hexType !== 'number') {
        throw new Error('输入进制必须为数值');
    }

    const res: ParamsInfo = {
        flag: false,
        type: undefined, // 默认无进制
        point: getPointCount(num),
        attr: getAttr(num),
        length: num.length,
    };
    // 空字符串
    if (!num) {
        throw new Error('输入数值字符串不能为空字符');
    }

    // 字符串超出最大长度
    if (res.length > NumMaxLength) {
        throw new Error(`数值字符串长度最大为${NumMaxLength}`);
    }

    if (hexType && hexType > HexElement.decimalCount + HexElement.letterCount) {
        throw new Error(`进制超出范围，有效进制范围2-36，num: ${num}，hexType: ${hexType}`);
    }

    // 二进制 小数
    const regexpBianry = new RegExp(`${regexpStartStr}(${Prefix.BINARY_0B}|${Prefix.BINARY_0b})`);
    // 八进制 小数
    const regexpOctal = new RegExp(`${regexpStartStr}(${Prefix.OCTAL_0O}|${Prefix.OCTAL_0o})`);
    // 十六进制 小数
    const regexpHex = new RegExp(`${regexpStartStr}(${Prefix.HEX_0X}|${Prefix.HEX_0x})`);
    // 是否包含符号
    const regexpStart = new RegExp(regexpStartStr.replace('?', '{1}'));

    // 处理常见进制，前缀, 默认为10进制
    let curHex: Numeric = 10;
    // 是否是常见非10进制
    let isCommonHex = false;
    if (regexpBianry.test(num)) {
        curHex = 2;
        isCommonHex = true;
        // 长度减去标志位
        res.length -= 2;
    } else if (regexpOctal.test(num)) {
        curHex = 8;
        isCommonHex = true;
        res.length -= 2;
    } else if (regexpHex.test(num)) {
        curHex = 16;
        isCommonHex = true;
        res.length -= 2;
    }

    // 判断符号位，减去符号位置
    if (regexpStart.test(num)) {
        res.length -= 1;
    }

    if ([
        isCommonHex,
        hexType,
        hexType !== curHex
    ].every(v => v)) {
        throw new Error(`输入数值进制与定义进制（hexType）不匹配，num: ${num}，hexType: ${hexType}`);
    }

    // 设置当前进制类型, 优先使用自定义的，其次使用探测的进制类型
    res.type = hexType || curHex;
    const eleRegexp = getEleRegexp(res.type);
    // 校验数值格式
    if (eleRegexp.test(num)) {
        res.flag = true;
    } else {
        throw new Error(`输入数值进制不合法，num: ${num}，hexType: ${hexType}, regexp: ${eleRegexp}`);
    }
    return res;
};

/**
 * 数值字符串标准化
 * @param num string 数值字符串
 * @param numInfo object 数值字符串信息
 */
const toStandard: ToStandard = (num) => {
    const regexpSign = new RegExp(`^[${NumericSign.Neg}${NumericSign.Pos}]?`);
    // 删除符号位置
    let sNum = num.replace(regexpSign, '');
    // 删除小数点
    sNum = sNum.replace(`${NumericSign.Point}`, '');
    // 删除数值进制的前缀
    const regexpPrefix = new RegExp(`^(${Prefix.BINARY_0B}|${Prefix.BINARY_0b}|${Prefix.OCTAL_0O}|${Prefix.OCTAL_0o}|${Prefix.HEX_0X}|${Prefix.HEX_0x})?`);
    sNum = sNum.replace(regexpPrefix, '');
    return sNum;
};

/**
 * 输出结果格式化，补充小数点，符号为等
 * @param num string 结果数值字符串
 * @param num1Info object 乘数信息
 * @param num2Info object 被乘数信息
 */
const outputFormat: OutputFormat = (num, num1Info, num2Info) => {
    let numArr = num.split('');
    const totalPoint = num1Info.point + num2Info.point;

    // 计算小数点位置
    totalPoint && (
        numArr.splice(-totalPoint, 0, NumericSign.Point)
    );

    // 前置多余0删除
    numArr = numArr.join('').replace(/^0+/, '').split('');
    if (totalPoint) {
        // 小数点打头的，第一位补0
        numArr = numArr.join('').replace(/^\./, '0.').split('');
        // 小数点后置多余0删除
        numArr = numArr.join('').replace(/0+$/, '').split('');
    }

    // 符号位处理
    num1Info.attr * num2Info.attr < 0 && (
        numArr.unshift(NumericSign.Neg)
    );

    // 删除前置0
    return numArr.join('');
};

/**
 * 数值字符串相乘
 * 支持整数，小数，十进制，二进制，八进制，十六进制
 * @param num1 string 乘数
 * @param num2 string 被乘数
 * @returns string
 */
const largeNumMulti: Entry = (num1, num2, hexType) => {
    const num1Info: ParamsInfo = checkParams(num1, hexType);
    const num2Info: ParamsInfo = checkParams(num2, hexType);

    // 数值字符串是否合法
    if (num1Info.type !== num2Info.type) {
        throw new Error('不同进制数字序列相乘不合法');
    }

    // 数值字符串标准化
    let num1Decimal = toStandard(num1);
    let num2Decimal = toStandard(num2);

    const integerStr = multiply(num1Decimal, num2Decimal, hexType);
    return outputFormat(integerStr, num1Info, num2Info);
};

export default largeNumMulti;


/**
 * 验证
 */
const test1 = largeNumMulti('0.1', '0.1');
console.log('0.1 * 0.1 = ', test1);
console.assert(
    test1 === '0.01',
    'Failed: 0.1 * 0.1 = 0.01'
);

const test2 = largeNumMulti('1234567890123456789', '987654321');
console.log('1234567890123456789 * 987654321 = ', test2);
console.assert(
    test2 === '1219326311248285321112635269',
    'Failed: 1234567890123456789 * 987654321 = 1219326311248285321112635269'
);

const test3 = largeNumMulti('F', '0.2', 16);
console.log('F * 0.2 = ', test3);
console.assert(
    test3 === '1.E',
    'Failed: F * 0.2 = 1.E'
);

const test4 = largeNumMulti('-0b10', '0B11');
console.log('-0b10 * 0B11 = ', test4);
console.assert(
    test4 === '-110',
    'Failed: -0b10 * 0B11 = -110'
);

const test5 = largeNumMulti('N', '2', 30);
console.log('N * 2 = ', test4);
console.assert(
    test5 === '1T',
    `Failed: -0b10 * 0B11 = 1T，Correct: ${test5}`
);
