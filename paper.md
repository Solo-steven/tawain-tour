# Paper : Render
###### tags: `Tour-App`

## App 架構簡述
#### 第一點 ： 我用『container component,presentational component 』的概念實作app。
  1. container component : 
     - container : 包含所有需要呈現的資料。
  3. presentational component : 
     - sidebar : 『route Link』的地方。
     - window : 呈現景點相關資料的地方。
![](https://i.imgur.com/RXumYS5.png =600x)


#### 第二點 ： route網址，我用兩個參數代表目前的網頁位址
```java=
/:purpose/:city
```
- purpose : 代表目前取得城市的



