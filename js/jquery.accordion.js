
;(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define([ "jquery" ], function(){
            factory(jQuery);
        });
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    $.fn.accordion = function(parameter,getApi) {
        if(typeof parameter == 'function'){ //重载
            getApi = parameter;
            parameter = {};
        }else{
            parameter = parameter || {};
            getApi = getApi||function(){};
        }
        var defaults = {
            triggerCls: "trigger",      //主列表的class值
            panelCls: "panel",          //列表所对应的内容列表的class值
            activeCls: "active",        //导航选中时的class
            triggerType: 'mouse',       //切换时的触发事件
            activeIndex: 0,             //默认选中导航项的索引
            multiple: false,            //是否同时支持多面板展开
            animate: false,             //是否开启动画
            duration:500,               //动画开启时长
            beforeEvent: function() {   //切换前执行,返回flase时不移动;传入一个对象,包含：target当前导航项对象,tabs导航列表对象,panels内容列表对象,index当前导航项索引,event事件对象;
            },
            afterEvent: function() {    //切换后执行;传入一个对象,包含：target当前导航项对象,tabs导航列表对象,panels内容列表对象,index当前导航项索引,event事件对象;
            }
        };
        var options = $.extend({}, defaults, parameter);
        return this.each(function() {
            //对象定义
            var $this = $(this);
            var $triggers = $this.find("." + options.triggerCls);
            var $panels = $this.find("." + options.panelCls);
            //全局变量
            var _api = {};
            options.triggerType += options.triggerType === "mouse" ? "enter" : "";  //使用mouseenter防止事件冒泡
            //函数
            _api.select = function(i,animate){
                var animate = animate==false?animate:options.animate;
                if(options.multiple){
                    if(animate){
                        $panels.eq(i).slideToggle(options.duration);
                    }else{
                        $panels.eq(i).toggle(options.duration);
                    }
                    $triggers.eq(i).toggleClass(options.activeCls);
                }else{
                    if(animate){
                        $panels.not(':eq('+i+')').slideUp(options.duration);
                        $panels.eq(i).slideDown(options.duration);
                    }else{
                        $panels.not(':eq('+i+')').hide();
                        $panels.eq(i).show();
                    }
                    $triggers.removeClass(options.activeCls).eq(i).addClass(options.activeCls);
                }
            };
            //初始化
            _api.select(options.activeIndex,false);
            $triggers.bind(options.triggerType, function(e) { //事件绑定
                var i = $triggers.index($(this));
                var status = {
                    target:$this,
                    triggers:$triggers,
                    panels:$panels,
                    index:i,
                    event:e
                };
                if(options.beforeEvent(status)!=false){
                    _api.select(i);
                    options.afterEvent(status);
                }
            });
            getApi(_api);
        });
    };
}));