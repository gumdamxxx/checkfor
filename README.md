多种数据检测
===================
### 功能
    1.用于检测大量页面input和select输入数据，不符合的数据清空，标黄标记和placeholder生成提示语
    2.输入框隶属于多个tab标签（此情况有可能多个隐藏的tab），tab标签上可生成tip必填浮动提示。主要解决页面提交时候，有一个或者几个tab标签中输入框没填写的问题。
    3.解决删除一行，tab上的tip必填浮动提示不会自动更新的问题。

#### 使用
    checkfunction.checkfor为检测当前按钮处的form全部的对象 参数（object） 如 ('.submitInputsClass');
            checkfunction.checkfun为检测页面单个对象  参数(checkfor, checkObj)   如('检测类型','.inputsClass')；
                        检测类型 : 'user_tel' 手机号
                                 'user_password' 密码  4-16位的汉字数字密码
                                 'message' 信息 6位字符以上的信息
                                 'password_confirm' 确认密码 会和密码（user_password）匹配
                                 'advice_title' 建议标题 4位字符以上信息
                                 'not_empty' 内容非空
                                 'float_neg' 负数浮点
                                 'float_number' 是否是浮点数
                                 'float_number_nozero' 正浮点（非零）
                                 'float_number_nozero' 正浮点（非零）
                                 'integer' 是否是正整数
                                 'integer_nozero' 正整数（非零）
                                 'selected' 是否选择
                                 'delay_date' 时间插件加载后的时间
   附加显现 : 检测对象包含attr（'tab-tip-target'）,意味着要联动显示，所有该attr的没有填写时候，都会对tab-tip-target对应的class标记一个tip
   作者 : liubibo
