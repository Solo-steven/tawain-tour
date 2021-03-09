# Paper : 架構解釋
###### tags: `Tour-App`

## App 架構簡述
### 第一點 ： 我用『container component,presentational component 』的概念實作app。
  1. container component : 
     - ```Container``` : 儲存所有需要呈現的資料。
  3. presentational component : 
     - ```Sidebar``` : 『route Link』的地方。
     - ```Window``` : 呈現城市相關資料的地方。
![](https://i.imgur.com/RXumYS5.png =600x)


### 第二點 ： route網址，我用兩個參數代表目前的網頁位址
```java=
/:purpose/:city
```
- purpose : 代表目前取得城市的功用。例如景點就是『ScenicSpot』，除了景點的資料，我也做出了可以取的PTX中『Hotel』和『Restaurant』的頁面。
- city : 代表目前取得的城市名稱。
- 應用 ： 我可以用這兩個參數去處理對應的render。
```
/  : purpose      / : city 
  undefined(root)    undefined(All)
  ScenicSpot         Taipei
  Hotel              NewTaipei
  .....              .......
```


### 第三點 ： 元件互動的方式
#### (一) . Sidebar互動
- sidebar不會有變動，因為我只想要連結的按鈕而已。
- 所以我用function component加上memo實作，讓他在mount後不會再render。

#### (二) . Window的互動
##### ```Container```的state。
  1. 由container component和presetational component的概念，```Window```呈現的資料和狀態控制應該由```Container```傳入props控制，所以我將container的state中設定兩個資料。
  3. ```city``` : 代表『已經』fetch到的資料，可以讓重複的資料不要重複fetch。一個城市為一個物件，裡面包含name和已經fetch到的資料，我用一個二維陣列的方式儲存，一個row有30個資料。
4. ```window_Count``` : 代表目前用到的資料陣列的尾端index，讓```Container```知道什麼時候資料不夠，再fetch。用『ScenicSpot/Taipei』為例，```window_Count```為1，就是用到Taipei中ScenicSpot陣列中的第0、1列。
  
```javascript=
{
    // state in container
    city:[{
        name : 'cityName' , 
        ScenicSpot [ [...'30 data'] , [ ...'30 data'] ]
    }....],
    window_Count  : 0,
}
```
##### ```Container```的函式 ： 
  1. ```reachToBottom``` : 處理window滑到底的時候，應該要做的事，可能單純增加count，也可能fetch data。
  2. ```flipCityPage``` : 處理當url轉換時，把window_Count歸零，是否需要更新資料。

##### ```Container```和```Window```的分工 ： 
  1. 我的想法是：
     - ```Container``` : 負責儲存資料(```city```)，記錄目前使用到的資料長度(```window_Count```)，並在判別需要的時候發出fetch data的請求(```Container```的函式)。
     - ```Window``` : 負責偵測url的變化，與是否滑到底的發生。
  2. ```Window```的內容 ： 
     - ref其實感覺可以放在```Container```。但因為實際收到url參數的是```Window```，只有```Window```知道現在使用的purpose和```city```是哪個。因此，我把ref放在window，並由觸發```Container```的```reachToBottom```時再傳遞使用的purpose和city。
     
```javascript=
{
   this.window_ref = React.createRef();
   this.dectReachBottom = this.dectReachBottom.bind(this)
}
```
 

## Render的效能分析

### 第一點 ： 我自己分類兩個會造成re-render的事件
- 第一個 ： 當user滑到widnow底部時，會需要更改資料，這時會造成re-redner，我稱為『reachToBottom』。
- 第二個 ： 當user點選Sidebar的時候，所造成的re-rendner，我稱為『flipPage』。
### 第二點 ： 『flipepage』的re-render
- 首先，我在```Window```內有很多個```Card```和```Modal```元件來呈現資料，所以，re-render整個```Window```內的元件會是一個很大的花費。
- 我處理filpPage的方法是 ： 
  1. ```Route```元件更改url。
  2. ```Window```由route的url props偵測到改變，進行一次update lifecycle。
  3. 在componentDidUpdate時，偵測到url變換，使用繼承```Container```的函式處理，傳入新的purpose和city。
  4. ```Container```做對應的處理，可能只是單純重設```window_Count```，也可能因為新的頁面沒有data，還需要fetch data。
  
    ![](https://i.imgur.com/YMYDLbp.png =400x)
- 我這邊減少re-render的方法，是把```Card```和```Modal```元件都用React.memo包起來。
   - 如此一來，我在url變換造成的lifeCycle中```Window```的re-render並不會觸```Card```和```Modal```的re-render。
   - 所以```Card```和```Modal```的re-render只會發生一次，也就是第二個lifeCycle，```Container```將資料重新設好的時候。
  
### 第三點 ： 『reachToBottom』的re-render
- 首先，我處理『reachToBottom』的方法是
   1. ```Window```的函式偵測是否滑到底，是的話，觸發從```Container```繼承的函式。
   2. ```Container```進行處理，判斷是否需要fetch data和增加```window_Count```。
   3. 若有```Container```的state變化，觸發lifeCycle。更新整個```Window```的畫面。若資料已經fetch完了，則不會觸發LifeCycle。
 ![](https://i.imgur.com/szgGIp7.png)
- 再來，我說一下，我減少re-render的方法。
   1. 第一個就是觸發```Container```的函式會辨別當前城市的資料是否可以再fetch，如果上一次已經fetch完了，就不會再發出請求，若這次fetch的資料不滿30，也會做紀錄，讓下一次一樣到最後時，不用fetch一次空的資料。
       - 註 ： 我有在```Container```的state增加boolean，紀錄是否fetch完所有資料了。
   2. 第二， ```Card```和```Modal```用React.memo，跟前面一樣，我用React.memo包住之後，可以確保即使有資料的更新，一次也增加30個新資料而已，不會re-render之前大量已經存在的```Card```和```Modal```元件。
 
## 一些想提的點

### 既然ref放在```Window```了，為什麼```window_Count```不也放在```Window```？
  - 原因是我覺得count放在state，會造成邏輯錯亂。
  - 下面我畫了幾張圖，來解說count和ref都放在```Window```。
  
### 解釋一下，『flipPage』。

#### 1. 若在新的城市的資料還夠的情況下：
- 重設```count```的值為0即可。
- 可以只觸發一次的re-render。
     
![](https://i.imgur.com/pzUCZoN.png =400x)

#### 2. 若在新的城市的資料不夠的情況下 ： 
- url變化，被```Window```偵測，count變化。
- count變化，偵測到目前```props```的資料不夠。
- Trigger```Container```的函式，fetch data。
- ```Container```增加的資料，觸發最後的re-render。
- 需要觸發三次的re-render。
     
![](https://i.imgur.com/Konsw03.png =500x)



### 再來，我們看一下，『reachToBottom』

#### 1. 如果城市的資料還夠的 : 
- 直接設定```count+1```即可。
- 可以只要re-render一次。
      
![](https://i.imgur.com/qAKPKCS.png =550x)

#### 2. 但如果城市的資料不夠的話：
- 先呼叫```Container```的函式，取的新資料。
- 更新資料後，因為count不是由```Container```控制，所以必需由```Window```的ComponentDidUpdate時偵測，並再一次更新。
- 所以，在這邊需要 re-render 2次才可以得到需求，雖然跟```count```放在```Container```一樣，而且邏輯複雜。
  
![](https://i.imgur.com/ipzBv5I.png =550x)