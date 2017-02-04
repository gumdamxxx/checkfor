/**
 *   描述 : 用于检测页面全部input或者select的功能
 *   子功能: checkfunction.checkfor为检测当前按钮处的form全部的对象 参数（object） 如 ('.submitInputsClass');
 *           checkfunction.checkfun为检测页面单个对象  参数(checkfor, checkObj)   如('检测类型','.inputsClass')；
 *                       检测类型 : 'user_tel' 手机号
 *                                'user_password' 密码  4-16位的汉字数字密码
 *                                'message' 信息 6位字符以上的信息
 *                                'password_confirm' 确认密码 会和密码（user_password）匹配
 *                                'advice_title' 建议标题 4位字符以上信息
 *                                'not_empty' 内容非空
 *                                'float_neg' 负数浮点
 *                                'float_number' 是否是浮点数
 *                                'float_number_nozero' 正浮点（非零）
 *                                'float_number_nozero' 正浮点（非零）
 *                                'integer' 是否是正整数
 *                                'integer_nozero' 正整数（非零）
 *                                'selected' 是否选择
 *                                'delay_date' 时间插件加载后的时间
 *  附加显现 : 检测对象包含attr（'tab-tip-target'）,意味着要联动显示，所有该attr的没有填写时候，都会对tab-tip-target对应的class标记一个tip
 *  作者 : liubibo
 */
var checkfunction = {
    appendTip: function (target) {                                                                                     //用于添加tab上的tip（tip提示必填项）
        var _thisFun = this;
        var thisObj = $(target);
        if (thisObj.find('.tip-wrapper.tip-necessary') === undefined || thisObj.find('.tip-wrapper.tip-necessary').length <= 0) {
            thisObj.addClass('position-r').append(_thisFun.createTip());
        }
    },
    createTip: function () {                                                                                           //用于创建一个tip并返回。
        var tip = $('<div class="tip-wrapper tip-necessary up-down-move position-a" ' +
            'style="background-color: rgba(255, 0, 0, 0.64);padding:2px;font-size:10px;top:-10px;right:-5px; color:#fff;border-radius:5px;z-index:10; position: absolute;">必填</div>');
        return tip;
    },
    /**
     * 描述 : 1.用来每个输入框离开时候检测tab-tip-target同类型的是否有不符合要求的。
     *       2.当删除一行的时候，
     * 参数 : 传递改对象obj，passSelf关闭自身检测，tipTarget找到对应必填tip的位置。检查是不是需要关闭tip
     * 作者 : liubibo
     */
    singleTrigger: function (obj, passSelf, tipTarget) {                                                               //用来每个输入框blur之后进行检测，并且判断是否要展示tip或者关闭tip。
        var $this = $(obj);
        var _thisFun = this;
        var $thisForm = $this.closest('form');
        var checkfor = $this.attr('checkfor');
        var tabTipObj = !!tipTarget ? tipTarget : $this.attr('tab-tip-target');
        var checkResult = _thisFun.checkfun(checkfor, $this);
        if (!!passSelf || !!tabTipObj) {                                                                                //有tab-tip-target属性,则检测是否需要添加tip或者取消tip
            if (!!passSelf || checkResult) {                                                                            //如果检测该输入框正确，则判断具有同个tab-tip-target的同类，是不是都是正确的，正确则取消tip
                var thisKindCheck = $thisForm.find('[tab-tip-target="' + tabTipObj + '"]');
                if (thisKindCheck.length > 0) {
                    var canCancelTip = 1;
                    thisKindCheck.each(function () {
                        if ($(this).hasClass('not-right')) {
                            canCancelTip = 0;
                            return false;
                        }
                    });
                    if (!!canCancelTip) {
                        $thisForm.find('.' + tabTipObj).find('.tip-wrapper.tip-necessary').remove();
                    }
                } else {                                                                                                //当没有该类的存在时候，可能是删除掉了，关闭必填tip
                    $thisForm.find('.' + tabTipObj).find('.tip-wrapper.tip-necessary').remove();
                }
            } else {                                                                                                    //如果检测输入框不正确，直接尝试添加tip
                _thisFun.appendTip($thisForm.find('.' + tabTipObj).get(0));
            }
        }
    },
    checkfor: function (object) {
        var thisForm = !!$(object).get(0).tagName === "form" ? $(object) : $(object).closest('form');
        var checkObject = thisForm.find('[checkfor]');
        var checkResult = true;
        var _thisFun = this;
        if (checkObject.length > 0) {
            checkObject.each(function () {
                var checkfor = $(this).attr('checkfor');
                var tabTipObj = $(this).attr('tab-tip-target');
                if (!!checkfor) {
                    if (checkfor != "submit") {
                        var checkInput = $(this).find('input');
                        if (checkInput.length > 0) {
                            if (!_thisFun.checkfun(checkfor, checkInput)) {
                                checkResult = false;
                                if (!!tabTipObj) {
                                    var tabTipObjOne = thisForm.find('.' + tabTipObj).get(0);
                                    _thisFun.appendTip(tabTipObjOne);
                                }
                            }
                        } else {
                            if (!_thisFun.checkfun(checkfor, this)) {
                                checkResult = false;
                                if (!!tabTipObj) {
                                    var tabTipObjOne = thisForm.find('.' + tabTipObj);
                                    _thisFun.appendTip(tabTipObjOne);
                                }
                            }
                        }
                    }
                }
            });
        }
        return checkResult;
    },
    checkfun: function (checkfor, checkObj) {                                                                          //检查单个input或者select 按钮的功能
        var checkVal = "";
        var result;
        var _thisFun = this;
        if ($.trim($(checkObj).val()) != "") {
            checkVal = $(checkObj).val();
        } else if ($.trim($(checkObj).text()) != "" && checkfor != "selected") {                                        //下拉框如果没有选择，不能用text；
            checkVal = $(checkObj).text()
        }
        if (checkfor == "user_tel") {
            checkVal = checkVal.replace(/[\W]*/, '');
            result = /1\d{10}/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "user_password") {
            result = /[0-9a-zA-Z_]{4,16}/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "message") {
            result = /^\d{6}$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "password_confirm") {
            var originalVal = checkArea.find('input[checkfor="user_password"],button[checkfor="user_password"]').val();
            var regex = new RegExp("\^" + originalVal + "\$");
            result = regex.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "advice_title") {
            result = /[\w\d]{4,}/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "advice_content") {
            result = /[\w\d]{4,}/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "not_empty") {
            if (checkVal.length > 0) {
                result = true;
            } else {
                result = false;
            }
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "float_number") {
            result = /^\d+(\.\d*)?$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "float_neg") {
            result = /^-\d+(\.\d*)?$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "float_neg_nozero") {
            result = /^-\d+(\.\d*)?$/.test(checkVal);
            result = result && parseFloat(checkVal) !== 0 ? true : false;
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "float_number_nozero") {
            result = /^\d+(\.\d*)?$/.test(checkVal);
            result = result && parseFloat(checkVal) !== 0 ? true : false;
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "float_number_and_neg") {
            result = /^[+-]?\d+(\.\d*)?$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer") {
            result = /^\d+$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer_nozero") {
            result = /^\d+$/.test(checkVal);
            result = result && parseFloat(checkVal) !== 0 ? true : false;
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer_neg") {
            result = /^-\d+$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer_and_neg") {
            result = /^-\d+$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer_neg_nozero") {
            result = /^[+-]?\d+$/.test(checkVal);
            result = result && parseFloat(checkVal) !== 0 ? true : false;
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "integer_nozero") {                                                                       //不能为0或者 00
            result = /^([0-9]*[1-9]|[1-9]+[0-9]|[0-9]+[1-9]|[0-9]+[1-9][0-9]+)$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "selected") {
            if (checkVal.length > 0) {
                result = true;
                $(checkObj).off('change.select');
            } else {
                result = false;
                $(checkObj).on('change.select', function () {
                    _thisFun.checkfun('selected', this);
                });
            }
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "delay_date") {                                                                       //判断日期插件的功能
            result = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})(\s{1,2}([0-2]?[0-9])\:([0-5]?[0-9])\:([0-5]?[0-9]))?$/.test(checkVal);
            _thisFun.highlight(result, checkObj);
        } else if (checkfor == "email") {
            result = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(checkVal);
            _thisFun.highlight(result, checkObj);
        }
        return !!result;
    },
    highlight: function (lightOff, checkContent) {                                                                      //高亮提示
        if (!checkContent) {
            checkContent = $('body');
        } else {
            checkContent = $(checkContent);
        }
        if (!lightOff) {
            var placeholder = ( typeof checkContent.attr('alertfor') != "undefined" ) ? checkContent.attr('alertfor') : ( typeof checkContent.parent().attr('alertfor') != "undefined" ) ? checkContent.parent().attr('alertfor') : "请重新输入";
            checkContent = checkContent.find('input').length > 0 ? checkContent.find('input') : checkContent;           //用于判断当前是文字还是input框，input框需要在input上面高亮提示
            checkContent.css('background-color', '#faffbd').attr('placeholder', placeholder).val("");
            checkContent.addClass('not-right');
        } else {
            checkContent.css('background', '');
            checkContent.removeClass('not-right');
        }
    }
};