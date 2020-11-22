# Whois-to-Tweet-at-GAS
ドメインの「Whois」を参照して、更新時刻・作成時刻・有効期限が更新されていたからツイートするGAS<br>

Googleのスプレッドシートを新規作成し、下のように入力してください。
![Github用の説明画像(Whois)](https://user-images.githubusercontent.com/74809846/99899194-b96f9880-2cea-11eb-9397-c2f943fdbd6b.png)
***全セルの表示形式を「数字」→「書式なしテキスト」にしてください。***


`https://docs.google.com/spreadsheets/d/********************************************/edit#gid=0`  
↑の*部分がスプレッドシートIDです。Code.gsの10行目にコピペしてください。

なお、このプログラムはTwitter APIが必須になりますのでご注意ください。<br>


「プロジェクトのプロパティ」から下記のように設定してください。
![Github用の説明画像(Whois)2](https://user-images.githubusercontent.com/74809846/99899138-3cdcba00-2cea-11eb-9c72-b52590a02294.png)


GASとTwitter APIの連携は下記サイトを参考にしてますので、サイト通りに連携してください。<br>
>https://tech-cci.io/archives/4228

また、ライブラリで下記コードを入力、追加してください。

`1CXDCY5sqT9ph64fFwSzVtXnbjpSfWdRymafDrtIZ7Z_hwysTY7IIhi7s`<br>
`1rgo8rXsxi1DxI_5Xgo_t3irTw1Y5cxl2mGSkbozKsSXf2E_KBBPC3xTF`
