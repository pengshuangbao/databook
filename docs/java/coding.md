# 编程题

[toc]

## 排序

[一遍记住Java常用的八种排序算法与代码实现 - 简书](https://www.jianshu.com/p/5e171281a387)

###  冒泡排序

[常用算法Java实现之直接插入排序 - 潇潇Leslie - 博客园](https://www.cnblogs.com/LeslieXia/p/5808057.html)

![image](https://static.lovedata.net/jpg/2018/6/22/b77081821375d271bd1a5a830db725a0.jpg-wm)

1. 第一层循环控制对比多少遍
2. 第二层就是一次对比 的数量下标
    1. 第一轮循环对比所有的，把最大的移到最后
    2. 第二轮则对比第0个到倒数第二个，把最大的移到倒数第二个
    3. 以此类推，一直对比
    4. 直到上层循环完了，或者所有的都是有序的
3. 循环里面的内容就是 **第一个数和第二个数** 作对比， **把大的往右推** ，就像冒泡一样，往后面赶
4. 加上isSorted 是为了优化性能，比如内层循环中没有做任何替换，表示已经是有序的了，外层循环则判断这个值，如果是则直接推出了

```java
public class BubbleSort {

    static void bubbleSort(int[] r, int n) {

        for (int i = 0; i < n - 1; i++) {
            boolean isSorted = true;
            for (int j = 0; j < n - i - 1; j++) {
                //这里需要剪1，因为不能一直对比到最后一个还去对比，要不然就溢出了
                if (r[j] > r[j + 1]) {
                    //替换掉
                    int temp = r[j];
                    r[j] = r[j + 1];
                    r[j + 1] = temp;
                    isSorted = false;
                }
            }
            if (isSorted) {
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] r = {0, 38, 66, 90, 88, 10, 25, 45};
        bubbleSort(r, r.length);
        System.out.println(Arrays.toString(r));
    }

}
```

结果

```console
[0, 10, 25, 38, 45, 66, 88, 90]
```

###  快速排序

![快速排序动图](http://static.lovedata.net/quick_sort_w.gif-wm)

```java

import java.util.Arrays;

public class QuickSort {

    //{45, 38, 66, 90, 88, 10, 25, 45};
    static int quickPartition(int[] r, int low, int high) {
        int x = r[low]; //设置x值初始值
        while (low < high) {
            while ((low < high) && (r[high] >= x)) { //从后往前，找到比x值小的值
                high--;
            }
            r[low] = r[high];//把这个小的值移动到 low这个位置
            while ((low < high) && (r[low] <= x)) { //从前往后，找到比x大的值
                low++;
            }
            r[high] = r[low];//把这个大的值移动到high这个位置
        }
        r[low] = x;
        return low;
    }

    static void quikcSort(int[] r, int low, int high) {
        if (low < high) {
            int temp = quickPartition(r, low, high);
            quikcSort(r, low, temp - 1);
            quikcSort(r, temp + 1, high);
        }
    }

    /**
     *
     * @param args
     */
    public static void main(String[] args) {
        int[] r = {45, 38, 66, 90, 88, 10, 25, 45};
        quikcSort(r, 0, r.length-1);
        System.out.println(Arrays.toString(r));
    }
}


// output
// [10, 25, 38, 45, 45, 66, 88, 90]
```

###  直接插入排序

![image](https://static.lovedata.net/jpg/2018/6/22/480d879b4ef17c3d0aa4754bb12a5e7a.jpg-wm)

直接插入排序是将未排序的数据插入至已排好序序列的合适位置。
具体流程如下：

1. 首先比较数组的前两个数据，并排序；
2. 比较第三个元素与前两个排好序的数据，并将第三个元素放入适当的位置；
3. 比较第四个元素与前三个排好序的数据，并将第四个元素放入适当的位置；

假如有初始数据：25  11  45  26  12  78。

1. 首先比较25和11的大小，11小，位置互换，第一轮排序后，顺序为：[11, 25, 45, 26, 12, 78]。
2. 对于第三个数据45，其大于11. 25，所以位置不变，顺序依旧为：[11, 25, 45, 26, 12, 78]。
3. 对于第四个数据26，其大于11. 25，小于45，所以将其插入25和45之间，顺序为：[11, 25, 26, 45, 12, 78]。

```java
public class StraightInsertSort {

    public static void insertSort(int[] a) {
        int len = a.length;//单独把数组长度拿出来，提高效率
        int insertNum;//要插入的数，从第一个开始，一直到最后一个
        //因为第一次不用，所以从1开始,又因为下面的需要i-1,所以如果这里写0的话，则会数组越界
        for (int i = 1; i < len; i++) {
            insertNum = a[i];//插入的数从数组中的下标为1也就是第二个数开始
            int j = i - 1;//序列元素个数,第一次是第一个数与第二个数进行比较
            //j需要大于0，也就是j最小为第一个数，如果内层循环的数大于需要插入的，
            // 则把这个数往后移动一位,并且j--,继续往前走
            while (j >= 0 && a[j] > insertNum) {//从后往前循环，将大于insertNum的数向后移动
                a[j + 1] = a[j];//元素向后移动，把下一个数置为当前数
                j--;
            }
            //如果j<0了，或者 a[j]是小于 插入数的，因为前面的已经是排好序的，所以就跳出循环
            // 因为前面有 j-- ,所以这里就需要把 a[j+1] 置换为插入数
            a[j + 1] = insertNum;//找到位置，插入当前元素
        }
    }

    public static void main(String[] args) {
        int[] r = {12, 38, 66, 90, 88, 10, 25, 45};
        insertSort(r);
        System.out.println(Arrays.toString(r));
    }
}

```

结果

```console
[10, 12, 25, 38, 45, 66, 88, 90]
```

###  选择排序

```java

import java.util.Arrays;

public class SelectSort {
    static void selectSort(int[] r, int n) {
        for (int i = 0; i < r.length-1 ; i++) {
            int min = i;  //找到第i次排序中最小的一个，默认是第i个最小 设置为min
            for (int j = i + 1; j < n; j++) {
                if (r[j] < r[min]) { //判断第j个是否比第min个小，如果是
                    min = j; //则置min为这个j，一次次循环，把后面的依次和这个min做对比
                }
            }
            if (min != i) {//如果min与i不同，则代表后面的有比第i个小的，则置换一下！
                swap(r, min, i);
            }
        }
    }
    public static void main(String[] args) {
        int[] r = {45, 38, 66, 90, 88, 10, 25, 45};
        selectSort(r,r.length);
        System.out.println(Arrays.toString(r));

    }
    static void swap(int[] r, int min, int i) {
        int temp = r[min];
        r[min] = r[i];
        r[i] = temp;
    }
}

// output
// [10, 25, 38, 45, 45, 66, 88, 90]
```

###  归并排序

## 请用Java实现非递归二分查找?