myQuery是自己写的一个模拟jQuery功能的js函数库

myQuery方法如下：

一、核心
1、size()
功能：取得选中元素的个数
参数：无
返回值：(int)元素个数

2、each()
功能：以每一个匹配的元素作为上下文（this）来执行一个函数。
参数：fn
返回值：myQuery对象

3、html()
功能：读（选中的第一个元素）/写（所有选中）元素的innerHTML
参数：无/str
返回值：myQuery对象

二、事件
1、click()  
功能：为选中元素的click事件加入处理函数
参数：绑定到click事件的处理函数
返回值：myQuery对象

2、hover()
功能：为选中元素绑定mouseover/out事件
参数：1、mouseover事件处理函数  2、mouseout事件处理函数
返回值：myQuery对象

3、toggle()
功能：在鼠标点击时依序循环执行参数函数
参数：function1,function2,function3,...
返回值：myQuery对象

4、bind()
功能：为每个匹配元素的特定事件绑定事件处理函数
参数：json/sEv，fn
返回值：myQuery对象

三、效果 
1、show()
功能：让选中元素显示
参数：无
返回值：myQuery对象

2、hide()
功能：让选中元素隐藏
参数：无
返回值：myQuery对象

四、样式/属性
1、css()
功能：获取(选中的第一个元素)/设置元素样式
参数：1、json或样式名  2、样式值(str)
返回值：myQuery对象

2、attr()
功能：获取(选中的第一个元素)/设置元素属性
参数：1、属性名(str)  2、属性值(str)
返回值：myQuery对象

3、addClass()
功能：为选中元素添加一个或多个className
参数：字符串（多个用空格分开）/函数（返回字符串）
返回值：myQuery对象

4、removeClass()
功能：为选中元素删除一个或多个className
参数：字符串（多个用空格分开）/函数（返回字符串）
返回值：myQuery对象

五、选择器
1、$()
功能：选元素，为window.onload加事件，包装原生对象为myQuery对象
参数：str,function,obj
返回值：myQuery对象

2、eq(n)
功能：获取一组元素中第n个元素
参数：n(int)
返回值：myQuery对象

3、find()
功能：从已有结果集里筛选符合条件的元素
参数：str
返回值：myQuery对象

4、index()
功能：取得当前元素在同级元素中的下标
参数：无
返回值：下标(int)

六、插件
功能：为myQuery对象添加新的方法
参数：1、方法名(str)  2、fn
返回值：无




