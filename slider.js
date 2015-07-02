;(function ($, window) {
    var Slider = function (containerBox, imgsBox, pointsBox) {
        this.imgsBox = imgsBox || $('#slider-imgs');
        this.pointsBox = pointsBox || $('#slider-point');
        this.curPointClass = "current-point";
        this.imgsArr = [];
        this.imgLinksArr = [];
        this.imgsArrLength = 0;
        this.imgLinksArrLength = 0;
        this.imgWidth = "16"; //图片宽度16rem
        this.curIndex = 0; //当前是第几个图片
        this.timer = false;
        this.startX = 0; //初始x轴偏移量
        this.endX = 0;
    };

    Slider.prototype = {
        init: function (imgsArr, imgLinksArr) {
            this.renderData(imgsArr, imgLinksArr);
            this.renderPage();
            this.autoChange();
            this.bindTouchEvent();
        },
        renderData: function (imgsArr, imgLinksArr) {
            this.imgsArr = imgsArr;
            this.imgsArrLength = imgsArr.length;
            this.imgLinksArr = imgLinksArr;
            this.imgLinksArrLength = imgLinksArr.length;
            this.resetCss(this.imgsArrLength);
        },
        resetCss: function (length) {
            this.imgsBox.css("width", length * this.imgWidth + "rem");
        },
        renderPage: function () {
            var _imgsArr = this.imgsArr,
                nodeImg = "",
                nodePoint = "",
                self = this;
            _imgsArr.forEach(function (img, i) {
                var curClass = (i == 0) ? self.curPointClass : "";
                nodeImg += "<li data-index='" + i + "'><img src='" + img + "'/></li>";
                nodePoint += "<span data-index='" + i + "' class='" + curClass + "'></span>";
            });
            this.imgsBox.append(nodeImg);
            this.pointsBox.append(nodePoint);
        },
        changeImg: function (index) {
            var x = index * 16,
                translateX = "translateX(-" + x + "rem)",
                curClass = this.curPointClass;
            this.pointsBox.find("span").eq(index).addClass(curClass).siblings().removeClass(curClass);
            this.imgsBox.css("transform", translateX);
            this.imgsBox.css("-webkit-transform", translateX);
            this.curIndex = index;
        },
        bindTouchEvent: function () {
        	var self = this;
        	this.imgsBox.on("touchstart", function (e) {
                self.touchStart(e);
        	});
        	this.imgsBox.on("touchmove", function (e) {
                self.touchMove(e);
        	});
        	this.imgsBox.on("touchend", function (e) {
                self.touchEnd(e);
        	});
        },
        touchStart: function (e) {
            e.preventDefault();
            this.stopAutoChange();
            this.startX = e.touches[0].clientX;
        },
        touchMove: function (e) {
            this.endX = e.touches[0].clientX;
        },
        touchEnd: function (e) {
            e.preventDefault();
            var dValue = this.endX - this.startX,
                _index = this.curIndex,
                _length = this.imgsArrLength - 1,
                self = this;
            if (dValue > 10) {
                this.curIndex = _index <= 0 ? parseInt(this.imgsArrLength - 1) : parseInt(_index - 1);
            } else if (dValue < -10) {
                this.curIndex = _index >= _length ? 0 : parseInt(_index + 1);
            }
            this.changeImg(this.curIndex);

            setTimeout(function () {
                self.autoChange();
            }, 1000);
        },
        autoChange: function () {
            var self = this;
            if (this.timer) {
                this.stopAutoChange();
            }
            this.timer = setInterval(function () {
                var _index = self.curIndex,
                    _length = self.imgsArrLength - 1;
                self.curIndex = _index >= _length ? 0 : parseInt(_index + 1);
                self.changeImg(self.curIndex);
            }, 2500);
        },
        stopAutoChange: function () {
            clearInterval(this.timer);
        }
    };

    window.Slider = Slider;

})(Zepto, window);