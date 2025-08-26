# サンプル Markdown

以下は機能サンプルです。

## 通常テキスト

段落。**強調** や *斜体*、`インラインコード`。

## リンク

[内部リンク](#part1)
[Google Map](https://www.google.co.jp/maps/)
[Yahoo!](https://www.yahoo.co.jp)

<a id = "part1">内部リンク</a>

## 画像

![猫](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/2880px-Cat_poster_1.jpg)

## リスト

- りんご
- バナナ
- みかん

1. 番号付き
2. リスト

## コード (Prism ハイライト)

```js
// JavaScript サンプル
const msg = 'Hello Prism!';
console.log(msg);
function fib(n){return n<2?n:fib(n-1)+fib(n-2)}
```

## Mermaid 図

```mermaid
sequenceDiagram
  participant U as User
  participant A as App
  participant S as Service
  U->>A: 画面を開く
  A->>S: データ要求
  S-->>A: JSON 応答
  A-->>U: レンダリング
```

```mermaid
flowchart LR
  A[開始] --> B{条件?}
  B -- Yes --> C[処理1]
  B -- No  --> D[処理2]
  C --> E[終わり]
  D --> E[終わり]
```

```mermaid
timeline
    title プログラミング技術の進化とパラダイムシフト
   
    1990s : 手続き型プログラミング時代
           : C言語
           : 構造化プログラミング
           : Pascal, Fortran
          
    2000s : オブジェクト指向全盛期
           : C++, Java
           : デザインパターン
           : UML modeling
          
    2005  : .NET Framework 2.0
           : Generic プログラミング
           : C# 2.0
           : Visual Studio 2005
          
    2007  : C# 3.0 革命
           : LINQ (Language Integrated Query)
           : ラムダ式
           : 拡張メソッド
           : 宣言型プログラミングの普及
          
    2010s : マルチパラダイム時代
           : 関数型プログラミング
           : 非同期プログラミング
           : クラウドコンピューティング
          
    2012  : C# 5.0
           : async/await
           : 並列プログラミング
           : Task-based Asynchronous Pattern
          
    2015  : Modern C#
           : C# 6.0-7.0
           : Pattern Matching
           : Null安全性の向上
          
    2019  : .NET Core統合
           : C# 8.0-9.0
           : Records
           : Init-only properties
          
    2020s : 現代的プログラミング
           : Minimal APIs
           : Source Generators
           : Native AOT
           : Cloud-Native Development
```

## 表

| 項目 | 値 |
|------|----|
| A    | 10 |
| B    | 20 |

## 引用

> 引用ブロック

## 数式

**ベクトルの絶対値**
```math
\vec{a} = (x, y)
```
```math
\lvert \vec{a} \rvert = \sqrt{x^2+y^2} \
```

**2点 a とb の距離 d**
```math
d = \lvert \vec{a} - \vec{b} \rvert
```

## 終わり

以上。
