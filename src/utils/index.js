/**
 * 工具类
 */
const Utils = {
    // 首字母变大写
    ucFirst: (str) => {
        str = str.toLowerCase();
        str = str.replace(/\b\w+\b/g, function (word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        });
        return str;
    },
    // 空对象
    isEmpty: (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    },
    // 随机字符 去掉了 字母lO，数字01
    randomCode: (count) => {
        let all = "azxcvbnmsdfghjkqwertyuiopZXCVBNMASDFGHJKLQWERTYUIP23456789";
        let b = "";
        for (let i = 0; i < count; i++) {
            let index = Math.floor(Math.random() * 58);
            b += all.charAt(index);
        }
        return b;
    },
    // 随机6位数字
    randomDigitCode: (count=6) => {
        return Math.random().toString().slice(-count)
    },
    // 生成uuid
    guid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    // 判断数组
    isArray: (obj) => {
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return Object.prototype.toString.call(obj)==="[object Array]";
        }
    }
};

module.exports = Utils;
