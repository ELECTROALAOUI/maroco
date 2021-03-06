//我的文档
define(function(require, exports, module) {

    var template = require('./main.html'),
        grid = require('ui/grid'),
        FILE = require('cloud/file'),
        buttonset = require('ui/buttonset'),
        searchbox = require('ui/searchbox'),
        notify = require('ui/notify');

    exports.show = function(opt) {
        var HTML = $(template),
            tools = HTML.find('.ac-tools');
        opt.container.html(HTML);

        //列表视图和缩略图视图切换
        buttonset({
            cls: 'link',
            el: HTML.find('.ac-listorthumb'),
            data: [{
                label: '<i class="f f-menus"></i>',
                title: '列表查看',
                cls: 'bs',
                on: true //开启状态
            }, {
                thumb: true,
                label: '<i class="f f-grid"></i>',
                title: '大图标查看',
                cls: 'bs'
            }],
            onselect: function(e, config, data) {
                HTML.toggleClass('thumb-view', !!data.thumb);
                //校准文件列表高度
                fileList.layout();
            }
        });

        //搜索框
        searchbox({
            el:HTML.find('.ac-search'),
            placeholder: '搜索我的文件',
            value: '',
            search: function(value, filter) {
                //回车和点击清空按钮时触发
                console.log(value, filter)
            },
            input: function(value, filter) {
                //键入内容时触发
                console.log(value, filter)
            }
        });

        //面包屑导航
        var guider = UI({
            el: HTML.find('.ac-guider'),
            events: {},
            init: function() {

            }
        });

        //排序、文件名、大小、日期,点击事件请各个模块自行绑定到dropdown上自行实现
        var sortableSwitch = UI({
            el: HTML.find('.ac-sortableswitch'),
            events: {
                'mouseenter': function(e, config) {
                    $(this).find('.dropdown').show();
                },
                'mouseleave': function(e, config) {
                    $(this).find('.dropdown').hide();
                },
                'click a': function(e, config) {
                    //判断点击的fileName是否和当前一样，如果一样，切换order，如果不一样 切换fileName 重置order
                    var order = $(this).attr('order');
                    if (order == config.order) {
                        config.asc = config.asc == 'desc' ? 'asc' : 'desc';
                    } else {
                        config.order = order;
                        config.asc = 'asc';
                    }
                    config.render();
                    config.onclick();
                }
            },
            map: null,
            order: null,
            asc: 'asc', //默认
            onclick: null,
            render: function() {
                var s = "",
                    order = this.order,
                    cur = '<a href="#" order="' + this.order + '"><i class="f f-' + (this.asc == 'desc' ? 'down' : 'up') + '" style="margin-right:5px;"></i>' + this.map[order] + '</a>';
                _.each(this.map, function(v, k) {
                    if (k == order) return;
                    s += '<li><a href="#" order="' + k + '"><i class="f f-up"></i>' + v + '</a></li>';
                });
                this.el.html(cur + '<div class="dropdown text-left" style="top:-5px;left:-10px;"><ul class="menu order"><li>' + cur + '</li>' + s + '</ul></div>').find('>a').css('color', '#454647');
            },
            //重置内容
            reset: function(conf) {
                //必须覆盖 map order asc 3个参数以及传出回调onclick
                $.extend(this, conf);
                this.render();
            },
            create: function() {}
        });

        //我的文档列表
        var fileList = grid({
            el: HTML.find('.ac-tabcon'),
            checkbox: true,
            cols: [{
                title: '文件名',
                order: 'fileName',
                cls: 'grid-name'
            }, {
                title: '大小',
                cls: 'grid-size',
                order: 'size'
            }, {
                title: '修改日期',
                cls: 'grid-date',
                order: 'date'
            }],
            // events: {},
            url: '/json/members',
            count: 10,
            //高度值如果是函数，函数会绑定到window.resize上
            height: function(grid) {
                return $(window).height() - $(grid).offset().top;
            },
            //contextmenu 右键菜单
            contextmenu: {
                events: {
                    'click .ac-pig': function(e, conf) {
                        alert('老猪来娶你了~' + conf.data[0].cname);
                        console.log(conf.data);
                    },
                    'click .ac-kulo': function(e, conf) {
                        console.log(conf.data);
                    }
                },
                menus: [{
                    label: '猪八戒 (选择多项时隐藏)',
                    cls: 'ac-pig',
                    //当test返回true的时候显示
                    test: function(data) {
                        //这里禁止对data进行修改
                        return data.length == 1;
                    }
                }, {
                    label: '<i class="f f-done c-safe"></i>白骨精 （选择多项时出现）',
                    cls: 'ac-kulo',
                    //当test返回true的时候显示
                    test: function(data) {
                        //这里禁止对data进行修改
                        return data.length > 1;
                    }
                }, {
                    label: '蜘蛛精',
                    //添加新页面打开外链的方法，注意总共有3个双引号
                    href: 'http://momofiona.github.io/maroco/public/" target="_blank"'
                }, '', {
                    label: '<i class="f f-location"></i>老东家无锡曙光公司',
                    cls: 'menu-error',
                    //动态添加链接也是可以的
                    href: function(data) {
                        return 'http://www.isugon.com/" target="_blank" title="企业私有云文件解决方案"';
                    }
                }]
            },
            //把ajax请求回来的数据转换成数据矩阵返回[['1.1(表示1行1列)','1.2'],['2.1',2.2]]
            render: function(data) {
                var cls;
                return _.map(data, function(o, i) {
                    cls = FILE.getFileIcon({
                        fileName: o.cname
                    });
                    return [
                        '<i class="fcon fcon_' + cls + '"' + (cls == 'jpg' ? ' url="' + o.path + '"' : '') + '></i>' + '<a class="filename">' + o.cname + '</a>',
                        o.size,
                        o.sendtime
                    ];
                });
            },
            //UI()保留方法 只在初始化(init)结束后执行一次
            create: function() {
                var t = this,
                    baseparams = t.loader.baseparams;
                //清空前面模块的遗留，根据order和asc决定内部html
                sortableSwitch.reset({
                    map: {
                        fileName: '文件名',
                        size: '大小',
                        date: '修改日期'
                    },
                    order: baseparams.order || 'fileName',
                    asc: baseparams.asc || 'desc',
                    onclick: function() {
                        //更改grid排序
                        t.setOrder(this.order,this.asc);
                    }
                });
            },
            //当有数据选中的时候
            onSelected: function(data) {
                tools.find('.ac-sel-show').toggleClass('vhide', data.length == 0);
            },
            beforeLoad:function(data,cache){
                sortableSwitch.reset(this.getOrder());
            }
        });
        //tabs
        UI.tabs({
            el: HTML.find('.tabs'),
            events: {
                'click .ac-upload': function(e, conf) {
                    seajs.use('ui/uploader', function(uploader) {
                        uploader.show({
                            url: UI.server + 'upload',
                            uploadPath: "我的电脑",
                            multipart_params: {
                            },
                            // beforeUploaded: function(up, file) {},
                            // uploaded: addPreview,
                            complete: function(up, files) {
                                fileList.load();
                            }
                        });
                    });
                }
            },
            caption: HTML.find('.caption'),
            onActive: function(tab, panel) {
                //面包屑栏目
                this.caption.html('<i class="f f-browse mr"></i>' + tab.innerHTML);
                //刷新文件列表
                fileList.load();
            }
        });
    };
});
