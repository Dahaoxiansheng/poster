/**
 *
 * author:Messi
 * mail:da_hao_hao@163.com
 * date:2021-03-04
 * 海报生成器
 *
 * @class getPoster
 */
export default class getPoster {
    constructor(option = {}) {
        // 默认配置
        this.obj = {
            width: 300, // 海报宽度
            height: 500, // 海报宽度
            gradients: false, // 背景颜色是否渐变
            gradientsBgColors: ['#ffffff', '#cccccc'], // 背景颜色渐变
            bgcolor: '#ffffff', // 背景颜色不渐变
            bgx: 0, // 背景颜色X轴
            bgy: 0, // 背景颜色X轴
            subitems: [ // 子项配置
                // 文本
                // {
                //     type: 'text', // string -- 类型
                //     value: '文本名称', // string -- 文本值
                //     x: 0, // number -- 在画布上放置图像的 x 坐标位置
                //     y: 0, // number -- 在画布上放置图像的 y 坐标位置
                //     size: 16, // number -- 字体大小
                //     width: 80, //  number -- 宽度
                //     gradientsType: false,// 判断是否需要渐变颜色
                //     color: '#000000', // string -- 颜色（十六进制，字体颜色）
                //     gradientsColors: [], // 渐变颜色字体
                // },
                // // 图片
                // {
                //     type: 'image', // string -- 类型
                //     value: 'url', // string -- 图片路径
                //     sx: 0,// number -- 开始剪切的 x 坐标位置
                //     sy: 0, // number -- 开始剪切的 y 坐标位置
                //     swidth: 0, // number -- 被剪切图像的宽度
                //     sheight: 0, // number -- 被剪切图像的高度
                //     x: 0, // number -- 在画布上放置图像的 x 坐标位置
                //     y: 0, // number -- 在画布上放置图像的 y 坐标位置
                //     width: 80, //  number -- 宽度
                //     height: 80, //  number -- 高度
                // }
            ],
            toType: 'jpeg' // 导出类型
        }
        this.options = { ...this.obj, option } // 合并默认值
    }
    /**
     *
     * @param {string} dom canvas元素
     * @param {object} option 多次配置项
     * @memberof getPoster
     */
    async generateImage(dom = '', option = {}) {
        if (dom == '') {
            console.error("generateImage：请传入dom元素")
            return false
        }
        if (!document.querySelector(dom)) {
            console.error("generateImage：请传入正确dom元素")
        } else {
            var options = { ...this.options, option } // 合并再次默认值导出海报
            var canvas = document.querySelector(dom)
            var context = canvas.getContext("2d")
            canvas.width = options.width
            canvas.height = options.height
            context.beginPath()
            // 判断是否为渐变底色
            if (options.gradients) {
                console.log('渐变')
                var grd = context.createLinearGradient(0, 0, 0, height);
                options.gradientsBgColors.forEach((val, inx) => {
                    grd.addColorStop(inx, val);
                });
                context.fillStyle = grd
            } else {
                // 不是渐变的背景颜色
                context.fillStyle = options.bgcolor
            }
            context.fillRect(options.bgx, options.bgy, options.width, options.height)
            context.fill()
            context.closePath()
            // 判断子选项存在并且是数组的情况
            if (options.subitems.length > 0 && isArray(options.subitems)) {
                let subitemsArr = options.subitems
                for (let i = 0; i < subitemsArr.length; i++) {
                    let val = subitemsArr[i]
                    // 处理文本的渲染
                    if (val.type == 'text' && val.value && isString(val.value)) {
                        let x = val.x || 0
                        let y = val.y || 0
                        let width = val.width || 300
                        let size = val.size || 16
                        let font = '500' + size + 'px/1 \'PingFang SC\', \'STHeitiSC-Light\', \'Helvetica-Light\', arial, sans-serif, \'Droid Sans Fallback\''
                        context.font = font
                        // 判断字体是否需要渐变色的
                        if (val.gradientsType) {
                            if (val.gradientsColors.length < 2) {
                                let color = val.gradientsColors.length == 0 ? '#000000' : val.gradientsColors[0]
                                context.fillStyle = color
                                context.fillText(val.value, x, y, width)
                            } else {
                                // 创建渐变
                                var gradient = context.createLinearGradient(0, 0, width, 0);
                                val.gradientsColors.forEach((e, m) => {
                                    if (m === 0) {
                                        gradient.addColorStop(0, e);
                                    } else {
                                        let step = (val.gradientsColors.length / (m + 1)).toFixed(2)
                                        gradient.addColorStop(Number(step), e);
                                    }
                                })
                                // 用渐变填色
                                context.strokeStyle = gradient;
                                context.strokeText(val.value, x, y, width);
                            }
                        } else {
                            context.fillStyle = val.color || '#000000'
                            context.fillText(val.value, x, y, width)
                        }
                    }
                    // 处理图片的渲染
                    if (val.type == 'text' && val.value && isString(val.value)) {
                        let sx = val.sx || 0
                        let sy = val.sy || 0
                        let swidth = val.swidth || 0
                        let sheight = val.sheight || 0
                        let x = val.x || 0
                        let y = val.y || 0
                        let width = val.width || 90
                        let height = val.height || 120
                        let url = await this.imgPromise(val.value)
                        context.drawImage(url, sx, sy, swidth, sheight, x, y, width, height)
                    }
                }
            }
            let newReplacStr = 'image/' + toType
            // let replaceSrc = canvas.toDataURL(newReplacStr, 1)
            return canvas.toDataURL(newReplacStr, 1)
        }
    }
    /**
     *
     * @param {string} src 图片路径
     */
    imgPromise(src) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = src
            img.onload = function (e) {
                resolve(img)
            }
            img.onerror = function (e) {
                reject(img)
            }
        })
    }
}
