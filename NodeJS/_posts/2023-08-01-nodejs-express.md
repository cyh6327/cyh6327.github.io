---
title:  "[Node.js] Express를 이용한 웹서버 구축"
categories: 
    - NodeJS
tags: [Express, route, router]
date: 2023-08-01
last_modified_at: 2023-08-01
---


## 1. 설치 및 초기세팅

##### 1. 새 폴더를 만들고 터미널에서 `cd C:\test-node` 커맨드를 통해 이동해준다.

##### 2. `npm init` 엔터키 눌러주면서 전부 기본값으로 설치
⇒ `package.json` 파일 생성됨

##### 3. 만든 폴더에 `app.js` 생성

```js
const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.send('hello NodeJs');
})

app.listen(3001, () => console.log('sever onload'));
```
{: file="app.js" }

##### 4. 터미널에서 `node app` 커맨드로 `app.js`실행

##### 5. 3001 포트 접속해 결과 확인

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/bcf8287f-0baf-4eb8-a1f8-416de2b81e7d)


## 2. Html 페이지 로드하기

##### 1. views 폴더 생성후 `index.html` 파일 생성

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

##### 2. `app.js` 수정 

```js
const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.render("index.html");
})
app.listen(3001, () => console.log('sever onload'));
```
{: file="app.js" }

- `render()` : 템플릿 엔진을 사용해 템플릿을 렌더링 후 반환함.
- `render()` 메서드는 `Express` 애플리케이션의 *라우터 핸들러 함수에서 호출.

> #### * `res.render(view [, locals] [, callback])`
> - `view` : 렌더링할 뷰 템플릿 파일의 이름을 지정. <br> 
> 기본적으로 `Express`는 뷰 템플릿 파일을 `views`라는 디렉토리 아래에서 찾음.
> - `locals` (option) : 뷰 템플릿에 전달할 데이터를 객체 형태로 전달.
> - `callback` (option) : 렌더링이 완료된 후 호출될 콜백 함수.

<br>

#### * 라우터 핸들러 함수
- 클라이언트로부터 특정 경로로 HTTP 요청이 도착했을 때 실행되며, 요청에 대한 응답을 생성하거나 추가적인 처리를 수행하는 함수.
- 이 핸들러 함수는 두 개 이상 호출할 수 있다.

```js
app.get('/', function(req, res, next){
    // res.send("First");
    console.log("First");
    next();
}, function (req, res) {
  res.send("Second");
})
```

> `send()`는 HTTP 응답 헤더(Content-Type)를 설정해 전송하는 메서드이다. <br>
> 첫번째 라우터 핸들링 함수에서 `send()`를 해버리면 이미 전송된 헤더를 set 할 수 없어 오류가 발생하므로 마지막 핸들링 함수에서 `send()` 해줘야 함.
{: .prompt-warning }

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/105c2d44-0f95-48e6-aaa7-448f18a43ca6)
_첫 번째 라우터 함수로 First 로그가 출력됨_

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/e95fba37-4650-4705-90ad-2626a9ea6012)
_두 번째 라우터 함수가 실행되면서 Second 문자열이 전송됨_


## 3. Error: Cannot find module 'html' 에러 발생
- 기본적으로 `Express`는 `jade` 템플릿을 사용하기 때문에 발생한 에러. <br>
⇒ `ejs` 모듈(=Embedded JavaScript)을 설치해 템플릿 설정을 변경해줘야 함.
 

1. `npm install ejs`

2. 템플릿 설정 변경 코드 추가

```js
app.engine('html', require('ejs').renderFile);
```
{: file="app.js" }

> #### * engine(viewEngineName, renderFunction) :
> - `engine` 메서드를 사용해 특정 뷰 엔진을 설정하면, 해당 뷰 엔진을 사용하여 `Express` 애플리케이션에서 뷰 템플릿 파일을 렌더링할 수 있게 됨.
> - `viewEngineName` : 뷰 엔진의 이름을 지정하는 문자열. <br>
> 이 이름은 뷰 템플릿 파일의 확장자를 나타내는 역할을 하며, 뷰 엔진의 이름은 보통 뷰 템플릿 파일의 확장자와 동일하게 지정됨.
> - `renderFunction(filePath, options, callback)` : 뷰 템플릿 파일을 렌더링하는 함수. <br>
>   - `filePath` : 렌더링할 뷰 템플릿 파일의 경로
>   - `options` : 뷰 템플릿에 전달할 데이터

<br>

```js
app.set('view engine', 'html');
```
{: file="app.js" }

- `view engine` 속성을 `html`로 지정함으로써 렌더링할 때 `.html` 확장자를 붙이지 않아도 됨. <br>
(해당 속성 설정 안 할 경우 확장자 필수로 붙여줘야 함)


## 4. 최종 코드
```js
const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render("index");
});
app.listen(3001, () => console.log('sever onload'));
```


#### 실행 결과

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/ca76ec25-5369-4c82-93ce-17d6d2c82638)



## References
- [Expressjs.com](https://expressjs.com/en/4x/api.html#app)
- [[ Express ] Express 첫 시작, 라우팅과 미들웨어](https://charles098.tistory.com/168)
- [[Nodejs] 노드 express 템플릿으로 html 사용하기](https://boheeee.tistory.com/12)
