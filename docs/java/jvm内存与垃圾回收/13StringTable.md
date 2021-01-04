# 第十三章、StringTable

## String的基本特性

![image](https://static.lovedata.net/20-12-15-9cb05c9c084a86448e83b6a7ad4054a4.png-wm)

![image](https://static.lovedata.net/20-12-15-0ca66266679c549286e3980fa5c32381.png-wm)

> 主要是使用char数组，会有一半的空间浪费，因为大部分只是存的是latin，也就是一个字节就能够表示，

![image](https://static.lovedata.net/20-12-15-856ec17af512181f7b76ee925719857d.png-wm)

![image](https://static.lovedata.net/20-12-15-e987d4bc85462e05f3fd3d5357f06e7f.png-wm)

![image](https://static.lovedata.net/20-12-15-49c9d499e4a3251b0bfed9e7a0d81603.png-wm)



![image](https://static.lovedata.net/20-12-15-adb106e0f2786a2820a1e9e902567937.png-wm)



## String的内存分配

![image](https://static.lovedata.net/20-12-15-6fefacfa2dec8887347539f3e16222fe.png-wm)

![image](https://static.lovedata.net/20-12-15-2730251ccc3e4921b01f45521396c30e.png-wm)

![image](https://static.lovedata.net/20-12-15-3f724061b313fdb0c93a6b48ecdb9a8d.png-wm)****

## String的基本操作

![image](https://static.lovedata.net/20-12-15-97e9b2ad13a5f74bfbad3b07726f2251.png-wm)



![image](https://static.lovedata.net/20-12-15-79ec8722f80da0502e628ca63082ee1b.png-wm)

![image](https://static.lovedata.net/20-12-15-001d740dd009938f5c867013360cfa26.png-wm)

## 字符串拼接操作

![image](https://static.lovedata.net/20-12-16-0963395a8646dac87950dd5f0c3e9ff7.png-wm)

![image](https://static.lovedata.net/20-12-16-f7397bcd214a7f585645fb18e4247f29.png-wm)

反编译后的代码：编译期优化

![image](https://static.lovedata.net/20-12-16-390645547d1904a4c75edf6c84d5caeb.png-wm)

![image](https://static.lovedata.net/20-12-16-ae473b8c0adc5b7c30059cce5c4fed14.png-wm)

---

  因为拼接中有变量，则需要在堆空间new一个字符串，开辟了新空间，新的引用地址

![image](https://static.lovedata.net/20-12-16-c78945933de6a4786acdad73a78ed362.png-wm)

![image](https://static.lovedata.net/20-12-16-105c700ade7b6b2a41f5e0df16b57d46.png-wm)



---

![image](https://static.lovedata.net/20-12-16-2f8d71bf056e37c3f59e2e67fad0cea5.png-wm)

![image](https://static.lovedata.net/20-12-16-b823d4082331ef7c8568ff34d969934a.png-wm)



---

![image](https://static.lovedata.net/20-12-16-6786c1191ece5be05d71a1fe9a91c50c.png-wm)

反编译后的

![image](https://static.lovedata.net/20-12-16-47925aa4eb827ac883fc52bd91376534.png-wm)

final修饰的不是变量，不一样

![image](https://static.lovedata.net/20-12-16-cc532d8a2444998643d08e658568ef03.png-wm)

---

![image](https://static.lovedata.net/20-12-16-c9915ff8d30353bd01aebfc5edc3132b.png-wm)

---

![image](https://static.lovedata.net/20-12-16-20542d10d0c9fb7184839720e335c426.png-wm)

![image](https://static.lovedata.net/20-12-16-7f66ffa0359fcc6b0265c40a267c80b0.png-wm)

![image](https://static.lovedata.net/20-12-16-f0c245145bc58a96e6b0f47a43e598d1.png-wm)

![image](https://static.lovedata.net/20-12-16-4786ee9ed1f06f1ad78b9cd0211d74ee.png-wm)

![image](https://static.lovedata.net/20-12-16-5f3815c6341353137b02ad072be50cdb.png-wm)



## intern()的使用

> native 方法

![image](https://static.lovedata.net/20-12-17-8002449cb26a1d40a57e25937664e134.png-wm)



![image](https://static.lovedata.net/20-12-17-7b8370015585530e3fed28153e542f32.png-wm)



```java
/**
 * 题目：
 * new String("ab")会创建几个对象？看字节码，就知道是两个。
 *     一个对象是：new关键字在堆空间创建的
 *     另一个对象是：字符串常量池中的对象"ab"。 字节码指令：ldc
 *
 *
 * 思考：
 * new String("a") + new String("b")呢？
 *  对象1：new StringBuilder()
 *  对象2： new String("a")
 *  对象3： 常量池中的"a"
 *  对象4： new String("b")
 *  对象5： 常量池中的"b"
 *
 *  深入剖析： StringBuilder的toString():
 *      对象6 ：new String("ab")
 *       强调一下，toString()的调用，在字符串常量池中，没有生成"ab"
 *
 * @author shkstart  shkstart@126.com
 * @create 2020  20:38
 */
public class StringNewTest {
    public static void main(String[] args) {
//        String str = new String("ab");

        String str = new String("a") + new String("b");
    }
}

```



```java
/**
 * 如何保证变量s指向的是字符串常量池中的数据呢？
 * 有两种方式：
 * 方式一： String s = "shkstart";//字面量定义的方式
 * 方式二： 调用intern()
 *         String s = new String("shkstart").intern();
 *         String s = new StringBuilder("shkstart").toString().intern();
 *
 * @author shkstart  shkstart@126.com
 * @create 2020  18:49
 */
public class StringIntern {
    public static void main(String[] args) {

        String s = new String("1");
        s.intern();//调用此方法之前，字符串常量池中已经存在了"1"
        String s2 = "1";
        System.out.println(s == s2);//jdk6：false   jdk7/8：false


        String s3 = new String("1") + new String("1");//s3变量记录的地址为：new String("11")
        //执行完上一行代码以后，字符串常量池中，是否存在"11"呢？答案：不存在！！
        s3.intern();//在字符串常量池中生成"11"。如何理解：jdk6:创建了一个新的对象"11",也就有新的地址。
                                            //         jdk7:此时常量中并没有创建"11",而是创建一个指向堆空间中new String("11")的地址
        String s4 = "11";//s4变量记录的地址：使用的是上一行代码代码执行时，在常量池中生成的"11"的地址
        System.out.println(s3 == s4);//jdk6：false  jdk7/8：true
    }


}
```



变种

```java
 public static void main(String[] args) {
        //StringIntern.java中练习的拓展：
        String s3 = new String("1") + new String("1");//new String("11")
        //执行完上一行代码以后，字符串常量池中，是否存在"11"呢？答案：不存在！！
        String s4 = "11";//在字符串常量池中生成对象"11"
        String s5 = s3.intern();
        System.out.println(s3 == s4);//false
        System.out.println(s5 == s4);//true
    }
```



![image](https://static.lovedata.net/20-12-17-2f95b46ee088442ad68a12324f83936e.png-wm)





![image](https://static.lovedata.net/20-12-21-bface7dae5ae8c06e0fa90b8298a4e55.png-wm)



### 练习

#### 练习1

![image](https://static.lovedata.net/20-12-21-5122661dcd2a057562fc8933a92652b3.png-wm)



![image](https://static.lovedata.net/20-12-21-02344d30354c99b94a60d80b78518104.png-wm)

![image](https://static.lovedata.net/20-12-21-69f785092b7c3b39d20a6c19b5e6d8d2.png-wm)



#### 练习2

```java
 public static void main(String[] args) {
        String s1 = new String("ab");//执行完以后，会在字符串常量池中会生成"ab"
//        String s1 = new String("a") + new String("b");////执行完以后，不会在字符串常量池中会生成"ab"
        s1.intern();
        String s2 = "ab";
        System.out.println(s1 == s2);//false
    }
```



## StringTable的垃圾回收



## G2中的String去重操作（了解）

![image](https://static.lovedata.net/20-12-21-02d17e619ed0b2a51b4584c0eaed7017.png-wm)

![image](https://static.lovedata.net/20-12-21-37e0450ace130a3f4548cb1dcfb78b57.png-wm)



![image](https://static.lovedata.net/20-12-21-e6d4dc4fb3569a5096c808583f693512.png-wm)

