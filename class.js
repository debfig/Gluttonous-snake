function Subject() {
    this.map = document.querySelector('.map');
    this.fen = document.querySelector('.fen');
    this.coordinate = [
        { x: 40, y: 0 },
        { x: 20, y: 0 },
        { x: 0, y: 0 }
    ];
    this.contentX = this.map.clientWidth - 20;
    this.contentY = this.map.clientHeight - 20;
    this.odja;
    this.odjb;
    this.tempMove = 4;
    this.fraction = 0;



    //渲染蛇
    this.Render_snake = function() {
        for (let i = 0; i < this.coordinate.length; i++) {
            let li = document.createElement('li');
            this.map.appendChild(li);
            li.style.left = this.coordinate[i].x + 'px';
            li.style.top = this.coordinate[i].y + 'px';
            if (i == 0) {
                li.className = 'head';
            } else if (i > 0) {
                li.className = 'body';
            }
        }
        this.Body_overlap();
    };



    //渲染食物
    this.Render_food = function() {

        function Food_xy(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let span = document.createElement('span');
        this.map.appendChild(span);
        span.style.top = Food_xy(0, 28) * 20 + 'px';
        span.style.left = Food_xy(0, 28) * 20 + 'px';

        // 判断食物是否在蛇的身上
        let li = this.map.querySelectorAll('li');
        let food = this.map.querySelector('span');
        for (let i = 0; i < li.length; i++) {
            if (li[i].offsetTop == food.offsetTop) {
                if (li[i].offsetLeft == food.offsetLeft) {
                    this.map.removeChild(span);
                    this.Render_food();
                }
            }
        }
    };


    //移动
    this.move = function() {
        for (let i = 1; i < this.coordinate.length; i++) {

            this.odjb = JSON.parse(JSON.stringify(this.odja))
            this.odja = JSON.parse(JSON.stringify(this.coordinate[i]))
            this.coordinate[i] = this.odjb
        }
        let li = this.map.querySelectorAll('li');
        for (let k = 0; k < li.length; k++) {
            this.map.removeChild(li[k]);
        }
        this.Render_snake();
    };


    // 判断头是否撞到身体
    this.Body_overlap = function() {
        for (let i = 1; i < this.coordinate.length; i++) {

            if (this.coordinate[0].x === this.coordinate[i].x) {
                if (this.coordinate[0].y === this.coordinate[i].y) {
                    clearInterval(timer);
                    this.death();
                    bgm.pause(); //关闭背景音乐
                    setTimeout(function() {
                            console.log(this);
                            alert('撞到身体了\t' + snake.fraction + '分');
                            history.go(0)
                        }, 1000) //刷新页面
                }
            }
        }
    };


    //吃到食物加分
    this.Eat_food = function() {
        let span = this.map.querySelector('span');
        let x = this.map.querySelector('span').offsetLeft;
        let y = this.map.querySelector('span').offsetTop;
        if (this.coordinate[0].x == x) {
            if (this.coordinate[0].y == y) {
                this.fraction++;
                this.fen.innerHTML = '分数:' + this.fraction;
                this.map.removeChild(span);
                this.video(); //调用音频
                this.Render_food();
                //添加身体
                this.Create_body()
            }
        }
    };


    //吃到食物添加身体
    this.Create_body = function() {
        let body;
        body = JSON.parse(JSON.stringify(this.coordinate[this.coordinate.length - 1]));
        this.coordinate[this.coordinate.length] = body

    }


    //初始化移动
    this.initial = function() {
        this.odja = JSON.parse(JSON.stringify(this.coordinate[0]));
    };


    //判断移动
    this.judge_move = function() {
        //获取蛇头
        let li = this.map.querySelector('.head');
        switch (this.tempMove) {
            case 1:
                if (0 < li.offsetTop) {
                    this.initial();
                    this.coordinate[0].y -= 20;
                    this.move();
                } else {
                    this.fail();
                };
                break;
            case 2:
                if (li.offsetTop < this.contentY) {
                    this.initial();
                    this.coordinate[0].y += 20;
                    this.move();
                } else {
                    this.fail();
                };
                break;
            case 3:
                if (0 < li.offsetLeft) {
                    this.initial();
                    this.coordinate[0].x -= 20;
                    this.move();
                } else {
                    this.fail();
                };
                break;
            case 4:
                if (li.offsetLeft < this.contentX) {
                    console.log(li.offsetLeft < this.contentX);
                    this.initial();
                    this.coordinate[0].x += 20;
                    this.move();
                } else {
                    this.fail();
                };
                break;
        }
    };

    //游戏失败
    this.fail = function() {
        clearInterval(timer); //停止定时器
        bgm.pause(); //关闭背景音乐
        this.death(); //调用死亡音效
        //等待一秒执行刷新
        setTimeout(function() {
            alert('撞到墙了\t' + snake.fraction + '分');
            history.go(0);
        }, 1000)
    }

    //Audio API
    this.video = function() {
        let num = new Audio('video/cho.mp3');
        num.play();
    }

    //死亡音效
    this.death = function() {
        let death = new Audio('video/死亡.mp3');
        death.play();
    }
}




//创建实例
let snake = new Subject();


//构造背景音乐
let bgm = new Audio('video/bgm.mp3');
//调用背景音乐
let bgmp = document.querySelector('.bgm');
let bgs = 0;
bgmp.addEventListener('click', function() {
    //游戏开始后才能控制BGM
    if (temp == 1) {
        bgmp.blur();
        if (bgs == 0) {
            bgm.play();
            bgm.loop = true;
            bgs++;
            bgmp.innerHTML = '关闭背景音乐';
        } else {
            bgm.pause();
            bgm.loop = false;
            bgs--;
            bgmp.innerHTML = '开启背景音乐';
        }
    }
})


//开始结束
let kai = document.querySelector('.kai');
let temp = 0;
kai.addEventListener('click', function() {
    //移除 点击了开始按钮上的焦点
    kai.blur();
    if (temp == 0) {
        // 点击开始调用第一次背景音频
        bgm.play();
        bgm.loop = true;
        bgs++;
        //^^^^^^^^音频部分
        snake.Render_snake(); //第一次渲染蛇
        snake.Render_food(); //第一次渲染食物
        kai.innerHTML = '结束';
        temp++;
    } else {
        location.reload(); //刷新页面
    }
})

//暂停继续
let jei = document.querySelector('.jei');
let temps = 0;
jei.addEventListener('click', function() {
    //移除 点击了暂停按钮上的焦点
    jei.blur();
    if (temp == 1) {
        if (temps == 0) {
            temps++;
            jei.innerHTML = '继续';
        } else {
            temps--;
            jei.innerHTML = '暂停';
        }
    }

});


//定时器
let timer = setInterval(function() {
    if (temps == 0) {
        snake.judge_move()
        snake.Eat_food();
    }
}, 150)


//获取键盘事件
document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (temp == 1) {
        if (temps == 0) {
            if (e && e.keyCode == 87) { //上
                snake.tempMove = 1;
            }
            if (e && e.keyCode == 83) { //下
                snake.tempMove = 2;
            }
            if (e && e.keyCode == 65) { //左
                snake.tempMove = 3;
            }
            if (e && e.keyCode == 68) { //右
                snake.tempMove = 4;
            };
        }
    };
    //暂停
    if (e && e.keyCode == 32) {
        if (temps == 0) {
            temps++;
            jei.innerHTML = '继续';
        } else {
            temps--;
            jei.innerHTML = '暂停';
        }
    }
};

// // 存储数据
$.getJSON('json.json', function(data) {
    for (let i in data) {
        localStorage.setItem(i, JSON.stringify(data[i]));
    }
});