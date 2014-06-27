var getStyle = function (obj, name) {

    if (obj.currentStyle) {
        getStyle = function (obj, name) {

            return obj.currentStyle[name] == "auto" ? 0 : obj.currentStyle[name];

        };
    }
    else {
        getStyle = function (obj, name) {

            return getComputedStyle(obj, false)[name] == "auto" ? 0 : getComputedStyle(obj, false)[name];

        };
    }

    return getStyle(obj, name);

};

var addEvent = function (obj, sEv, fn) {
    if (obj.attachEvent) {
        addEvent = function (obj, sEv, fn) {

            obj.attachEvent("on" + sEv, function () {

                if (fn.call(obj) == false) {
                    event.cancelBubble = true;

                    return false;
                }
            });

        };
    }
    else {
        addEvent = function (obj, sEv, fn) {

            obj.addEventListener(sEv, function (ev) {

                if (fn.call(obj) == false) {
                    ev.cancelBubble = true;

                    ev.preventDefault();

                }

            }, false);

        };
    }

    addEvent(obj, sEv, fn);
};

function getByClass(oParent, sClass, sTag) {
    sTag = sTag || "*";
    var aEle = oParent.getElementsByTagName(sTag);
    var oReg = sClass ? new RegExp("\\b" + sClass + "\\b") : new RegExp("");
    var aResult = [];

    for (var i = 0; i < aEle.length; i++) {
        if (oReg.test(aEle[i].className)) {
            aResult.push(aEle[i]);
        }
    }

    return aResult;
}

/********************************************
 函数名：    selElement
 功能：    供MyQuery调用的选元素函数
 参数1：    参数字符串切分之后的每个数组元素字符串
 参数2：    MyQuery对象
 返回值：    选到的元素
 ********************************************/
function selElement(oSel, _this) {
    var aResult = [];

    switch (oSel.charAt(0)) {
        case "#":
            aResult.push(document.getElementById(oSel.substring(1)));
            break;

        case ".":
            if (_this.elements.length) {
                for (var i = 0; i < _this.elements.length; i++) {
                    aResult = aResult.concat(
                        getByClass(_this.elements[i], oSel.substring(1))
                    );
                }
            }
            else {
                aResult = getByClass(document, oSel.substring(1));
            }
            break;

        default:
            var iClass = oSel.indexOf(".");
            var sTagName = iClass != -1 ? oSel.substring(0, iClass) : oSel;
            var sClassName = iClass != -1 ? oSel.substring(iClass + 1) : "";

            if (_this.elements.length) {
                for (var i = 0; i < _this.elements.length; i++) {
                    aResult = aResult.concat(
                        getByClass(_this.elements[i], sClassName, sTagName)
                    );
                }
            }
            else {

                aResult = getByClass(document, sClassName, sTagName);
            }
            break;
    }

    return aResult;
}

function MyQuery(vArg) {
    /*存选出来的元素*/
    this.elements = [];

    switch (typeof vArg) {
        case "string":
            this.aSel = vArg.split(" ");

            for (var i = 0; i < this.aSel.length; i++) {
                this.elements = selElement(this.aSel[i], this);
            }
            break;

        case "function":
            addEvent(window, "load", vArg);
            break;

        case "object":
            if (vArg instanceof Array) {
                for (var i = 0; i < vArg.length; i++) {
                    this.elements.push(vArg[i]);
                }
            }
            else {
                this.elements.push(vArg);
            }
            break;
    }
}

/********MyQuery核心********/
MyQuery.prototype.size = function () {
    return this.elements.length;
};

MyQuery.prototype.each = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        fn.call(this.elements[i]);
    }

    return this;
};

MyQuery.prototype.html = function () {
    switch (arguments.length) {
        case 0:
            return this.elements[0].innerHTML;
        case 1:
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].innerHTML = arguments[0];
            }
    }
};

/********myQuery--事件********/
MyQuery.prototype.click = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }

    return this;
};

MyQuery.prototype.hover = function (fnOver, fnOut) {
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], "mouseover", fnOver);
        addEvent(this.elements[i], "mouseout", fnOut);
    }

    return this;
};

MyQuery.prototype.toggle = function () {
    var _arguments = arguments;
    var _this = this;

    for (var i = 0; i < this.elements.length; i++) {
        (function () {
            var iCount = 0;

            _this.elements[i].onclick = function () {
                _arguments[iCount % _arguments.length]();

                iCount++;
            };

        })()
    }

    return this;
};

MyQuery.prototype.bind = function () {
    switch (typeof arguments[0]) {
        case "string":
            for (var i = 0; i < this.elements.length; i++) {
                addEvent(this.elements[i], arguments[0], arguments[1]);
            }
            break;

        case "object":
            for (var i = 0; i < this.elements.length; i++) {
                for (var ev in json) {
                    addEvent(this.elements[i], ev, json[ev])
                }
            }
            break;
    }

    return this;
};

/********myQuery--效果********/
MyQuery.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = this.elements[i].oldDisplay;
    }

    return this;
};

MyQuery.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        var curDisplay = getStyle(this.elements[i], "display");

        if (curDisplay != "none") {
            this.elements[i].oldDisplay = curDisplay;
        }

        this.elements[i].style.display = "none";
    }

    return this;
};

MyQuery.prototype.animate = function (json, dur, fnEnd) {
    var _this = this;
    var iLength = 0;
    var old = 0;
    var target = 0;
    var total = 0;

    dur = parseInt(dur / 5);

    for (var attr in json) {
        for (var i = 0; i < this.elements.length; i++) {
            if (attr == "opacity") {
                origin = parseInt(getStyle(this.elements[i], attr));
                target = parseInt(json[attr]);
            }
            else {
                origin = parseFloat(getStyle(this.elements[i], attr));
                target = parseFloat(json[attr]);
            }

            total = target - origin;

            for (j = 0; j <= dur; j += 1) {
                (function () {
                    var index = i;				//元素下标
                    var rate = j;					//运动进程的百分比
                    var curAttr = attr;			//当前运动的是哪个属性
                    var curTotal = total;			//当前运动属性的目标值
                    var old = origin;				//当前运动属性的初始值

                    setTimeout(function () {

                        if (curAttr == "opacity") {
                            _this.elements[index].style.opacity = old + rate / dur * curTotal;
                        }
                        else {
                            _this.elements[index].style[curAttr] = old + rate / dur * curTotal + "px";
                        }

                        if (rate == dur && curAttr == attr) {
                            iLength++;

                            if (iLength == _this.elements.length) {
                                if (fnEnd) {
                                    fnEnd.call(_this);
                                }
                            }
                        }

                    }, (rate + 1) * 5);

                })();
            }
        }
    }

    return this;
};

/********myQuery--样式/属性********/
MyQuery.prototype.css = function (attr, value) {
    switch (arguments.length) {
        case 1:
            if (typeof attr == "string") {
                return getStyle(this.elements[0], attr);
            }
            else //形如{width:"200px",height:"100px"}
            {
                for (var k in attr) {
                    for (var i = 0; i < this.elements.length; i++) {
                        this.elements[i].style[k] = attr[k];
                    }
                }
            }
            break;

        case 2:
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style[attr] = value;
            }
            break;
    }

    return this;
};

MyQuery.prototype.attr = function () {
    switch (arguments.length) {
        case 1:
            return this.elements[0].getAttribute(arguments[0]);

        case 2:
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i][arguments[0]] = arguments[1];
            }
            break;

    }

    return this;
};

MyQuery.prototype.addClass = function (vArg) {
    var aClass = [];
    var _this = this;

    switch (typeof vArg) {
        case "string":
            aClass = vArg.split(" ");
            break;

        case "function":
            aClass = vArg.call(_this).split(" ");
            break;
    }

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < aClass.length; j++) {
            var reg = new RegExp(aClass[j]);

            if (reg.test(this.elements[i].className)) continue;

            this.elements[i].className += " " + aClass[j];
        }
    }

    return this;
};

MyQuery.prototype.removeClass = function (vArg) {
    var aClass = [];
    var _this = this;

    switch (typeof vArg) {
        case "string":
            aClass = vArg.split(" ");
            break;

        case "function":
            aClass = vArg.call(_this).split(" ");
            break;
    }

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < aClass.length; j++) {
            var reg = new RegExp(" ?" + aClass[i], "g");

            this.elements[i].className = this.elements[i].className.replace(reg, "");
        }
    }
};

/********myQuery--选择器********/
MyQuery.prototype.eq = function (n) {
    return $(this.elements[n]);
};

MyQuery.prototype.find = function (str) {
    var aResult = [];

    this.aSel = str.split(" ");

    for (var i = 0; i < this.aSel.length; i++) {
        aResult = selElement(this.aSel, i, this);
    }

    return $(aResult);
};

MyQuery.prototype.index = function () {
    var oParent = this.elements[0].parentNode;

    for (var i = 0; i < oParent.children.length; i++) {
        if (oParent.children[i] == this.elements[0]) {
            return i;
        }
    }
};

/********myQuery--插件********/
MyQuery.prototype.extend = function (name, fn) {
    MyQuery.prototype[name] = fn;

    return this;
};

function $(vArg) {
    return new MyQuery(vArg);
}