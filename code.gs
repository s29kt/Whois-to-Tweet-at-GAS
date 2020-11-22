function whois(){
  var message  = "";

  var URL      = "ドメイン";  //更新を感知したいドメイン
  var response = UrlFetchApp.fetch("http://api.whoisproxy.info/whois/" + URL);   /* https://chanshige.hatenablog.com/entry/2019/02/16/184907 */
  var json     = JSON.parse(response.getContentText()); //apiをjsonに変換
  var Datelist = json["results"]["detail"]["date"];   //jsonからdate部分を引っ張り出す
  
  //----------スプレッドシート-------------------------------------------------------------------------------
  var SpreadSheetId = SpreadsheetApp.openById('スプレッドシートID');
  var Sheet         = SpreadSheetId.getActiveSheet(); 
  var lastRow       = Sheet.getLastRow();
  //------------------------------------------------------------------------------------------------------
  
  
  //-------------------------------
  /*2020年11月8日現在*/
  var oldUpdatedDate    = Sheet.getRange(lastRow,2).getValue();
  var oldCreationDate   = Sheet.getRange(lastRow,3).getValue();
  var oldExpirationDate = Sheet.getRange(lastRow,4).getValue();
  var oldCheckDate      = Sheet.getRange(lastRow,6).getValue();
  //-------------------------------
  
  //引っ張り出したdateを文字列型にして分割
  var UpdatedDate    = Datelist[0].toString().split(": ");
  var CreationDate   = Datelist[1].toString().split(": ");
  var ExpirationDate = Datelist[2].toString().split(": ");
  var CheckDate      = "";
  
  //dateを日本時間に変換して色々調整
  UpdatedDate    = "更新時刻:" + Utilities.formatDate(new Date(UpdatedDate   [1]), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  CreationDate   = "作成時刻:" + Utilities.formatDate(new Date(CreationDate  [1]), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  ExpirationDate = "有効期限:" + Utilities.formatDate(new Date(ExpirationDate[1]), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  CheckDate      = Utilities.formatDate(new Date(),'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  
  
  if((UpdatedDate !== oldUpdatedDate) || (CreationDate !== oldCreationDate) || (ExpirationDate !== oldExpirationDate)){
    //スプレッドシートに書き込み
    var CheckDate_write       = Sheet.getRange(lastRow+1,1).setValue(CheckDate);
    var UpdatedDate_write     = Sheet.getRange(lastRow+1,2).setValue(UpdatedDate);
    var CreationDate_write    = Sheet.getRange(lastRow+1,3).setValue(CreationDate);
    var ExpirationDate_write  = Sheet.getRange(lastRow+1,4).setValue(ExpirationDate);
    
    
    var text1 = "[" + URL + "]のドメイン更新が検知されました。\n\n";
    var text2 = "--Whois検知内容---------------\n";
    var text3 = UpdatedDate + "\n" + CreationDate + "\n" + ExpirationDate + "\n";
    var text4 = "----------------------------------\n\n";
    message = text1 + text2 + text3 + text4 + "確認時刻:" + CheckDate;
    //toTweet(message);
    Logger.log(message);
    
    var text5 = "前回確認時点\n";
    var text6 = "前回確認:" + oldCheckDate + "\n\n";
    var text7 = oldUpdatedDate + "\n" + oldCreationDate + "\n" + oldExpirationDate + "\n";
    var text8 = "----------------------------------\n";
    message = text5 + text6 + text7 + text8 + "確認時刻:" + CheckDate;
    //toTweet(message);
    Logger.log(message);
  }else{
    var CheckDate_write = Sheet.getRange(lastRow,6).setValue(CheckDate);
  }
 
  Logger.log(UpdatedDate);
  Logger.log(CreationDate);
  Logger.log(ExpirationDate);
}


// ツイート用のAPIを起動する関数
function toTweet(message) {
  var twitterService = getService();
  Logger.log(message);
  
  if (twitterService.hasAccess()) {
    // 投稿
    var twMethod = { method:"POST" };
    twMethod.payload = { status: message };
    var response = twitterService.fetch("https://api.twitter.com/1.1/statuses/update.json", twMethod);
    
    //Logger.log(response.getContentText());
    
  } else {
    //Logger.log(service.getLastError());
  }
}


// サービス取得(絶対触らないこと)
function getService() {
  return OAuth1.createService('Twitter')
  .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
  .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
  .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
  // 設定した認証情報をセット
  .setConsumerKey(PropertiesService.getScriptProperties().getProperty("CONSUMER_API_KEY"))
  .setConsumerSecret(PropertiesService.getScriptProperties().getProperty("CONSUMER_API_SECRET"))
  .setCallbackFunction('authCallback')
  // 認証情報をプロパティストアにセット（これにより認証解除するまで再認証が不要になる）
  .setPropertyStore(PropertiesService.getUserProperties());
}





/*******************************************************
使わないからやーつ。認証が切れたらまた実行ね
https://tech-cci.io/archives/4228
*******************************************************/

// 認証用URL取得
function getOAuthURL() {
  Logger.log(getService().authorize());
}

//  認証成功時に呼び出される処理を定義
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('success!!');
  } else {
    return HtmlService.createHtmlOutput('failed');
  }    
}
