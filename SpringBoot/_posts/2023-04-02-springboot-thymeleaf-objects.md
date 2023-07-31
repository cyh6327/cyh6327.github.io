---
title:  "[SpringBoot] #8 화면 구성을 위한 Thymeleaf 사용 - 2"
categories: 
    - SpringBoot
tags: [Thymeleaf, fragment, template]
<<<<<<< HEAD
date: 2023-04-02 02:00:00
=======
date: 2023-04-02
>>>>>>> ee0efa97c556676e0d629447e63d6a4f26ea9e01
last_modified_at: 2023-04-02
---

## 1. Thymeleaf의 기본 객체와 LocalDateTime
Thymeleaf에는 내부적으로 여러 종류의 기본 객체를 지원함.

### 1) `sno`를 5자리로 포맷해서 출력
```java
<li th:each="dto : ${list}">
    [[${#numbers.formatInteger(dto.sno,5)}]]
</li>
```
![image](https://user-images.githubusercontent.com/99089584/229338697-d8fe24c5-f35a-44ac-8334-787e0c0effd8.png)

### 2) LocalDateTime 포맷팅
`LocalDate`타입이나 `LocalDateTime`을 좀 더 편하게 처리하기 위해 `build.gradle`에 의존성 추가

```gradle
dependencies {
	implementation 'org.thymeleaf.extras:thymeleaf-extras-java8time:3.0.4.RELEASE'
}
```

```java
<li th:each="dto : ${list}">
    [[${dto.sno}]] --- [[${#temporals.format(dto.regTime, 'yyyy/MM/dd')}]]
</li>
```

![image](https://user-images.githubusercontent.com/99089584/229339276-f96db46d-8c75-4d38-b097-eb509d4c6b23.png)


## 2. Thymeleaf의 레이아웃
### 1) include 방식의 처리
특정한 부분을 다른 내용으로 변경할 수 있는 `th:insert`, `th:replace`
- `th:replace` : 기존의 내용을 완전히 대체
- `th:insert` : 기존 내용의 바깥쪽 태그는 그대로 유지하면서 추가되는 방식

### 1-1) exLayout1.html
- `exLayout1.html`은 내부적으로 다른 파일(`fragment1.html`)에 있는 일부분을 조각처럼 가져와서 구성할 것임. <br>
- `th:replace`의 `::` 뒤에는 `fragment`의 이름을 지정하거나 CSS의 #id와 같은 선택자를 사용할 수 있음.
- `::`이하를 생략하면 해당 파일의 전체 내용을 가져옴.

```html
<body>
<h1>Fragment Test</h1>

<h1>Layout 1 - 1</h1>
<div th:replace="~{/fragments/fragment1 :: part1}"></div>

<h1>Layout 1 - 2</h1>
<div th:insert="~{/fragments/fragment1 :: part2}"></div>

<h1>Layout 1 - 3</h1>
<th:block th:replace="~{/fragments/fragment1 :: part3}"></th:block>
</body>
```
{: file="exLayout1.html" }


### 1-2) `th:block`의 쓰임새
- th:block 미사용시

```html
<div th:each="user : ${userList}">
  <span th:text="user.username}">username</span>
  <span th:text="user.age}">age</span>
</div>

<div th:each="user : ${userList}">
<span th:text="${user.username} + ' & ' + ${user.age}">username&age</span>
</div>
```
- th:block 사용

```html
<th:block th:each="user : ${userList}">
  <div>
      <span th:text="user.username}">username</span>
      <span th:text="user.age}">age</span>
  </div>
  <div>
      <span th:text="${user.username} + ' & ' + ${user.age}">username&age</span>
 </div>	
</th:block> 
```

### 1-3) fragment1.html
조각이 될 파일을 담는 fragments 폴더 <br>
![image](https://user-images.githubusercontent.com/99089584/229339785-55466b2f-c523-43ed-80ba-1e002c5d0e50.png)

```html
<body>
  <div th:fragment="part1">
    <h2>Part 1</h2>
  </div>

  <div th:fragment="part2">
    <h2>Part 2</h2>
  </div>

  <div th:fragment="part3">
    <h2>Part 3</h2>
  </div>
</body>
```
{: file="fragment1.html" }

실행 결과 <br>
![image](https://user-images.githubusercontent.com/99089584/229340113-3c82841d-2d8c-4db6-9ce2-1d9732dde2f2.png) <br>
⇒ `th:insert`를 사용한 part2 부분은 `<div>`태그 내에 다시 `<div>`태그가 생성됨.


### 1-4) fragment2.html (전체 가져오기)
```html
<div>
    <hr/>
    <h2>Fragment2 File</h2>
    <h2>Fragment2 File</h2>
    <h2>Fragment2 File</h2>
    <hr/>
</div>
```
{: file="fragment2.html" }

⇒ 전체 내용을 특정 부분에 갖다붙이는 것이므로 html코드(`<body>`등)이 필요하지 않음. <br>

```html
<!-- fragment2 뒤에 '::' 생략함 -->
<div style="border: 1px solid blue">
    <th:block th:replace="~{/fragments/fragment2}"></th:block>
</div>
```
{: file="exLayout1.html" }

![image](https://user-images.githubusercontent.com/99089584/229340807-780e1ee3-889d-44b2-89d4-df80dfdbef05.png)


## 2) 파라미터 방식의 처리
- Thymeleaf를 이용하면 특정한 '태그'를 파라미터처럼 전달해서 다른 `th:fragment`에서 사용할 수 있음.

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
  <div th:fragment="target(first, second)">
    <style>
      .c1 {
        background-color : red;
      }
      .c2 {
        background-color : blue;
      }
    </style>

    <div class="c1">
      <th:block th:replace = "${first}"></th:block>
    </div>

    <div class="c2">
      <th:block th:replace = "${second}"></th:block>
    </div>
  </div>
</body>
</html>
```
{: file="fragment3.html" }

<br>

- 선언된 `target`부분에 `first`와 `second`라는 파라미터를 받을 수 있도록 구성.

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/fragments/fragment3:: target(~{this:: #ulFirst}, ~{this:: #ulSecond})}">
    <ul id="ulFirst">
        <li>AAA</li>
        <li>BBB</li>
        <li>CCC</li>
    </ul>

    <ul id="ulSecond">
        <li>111</li>
        <li>222</li>
        <li>333</li>
    </ul>
</th:block>
```
{: file="exLayout2.html" }

<br>

![image](https://user-images.githubusercontent.com/99089584/229343166-c434d22c-ffed-48ad-ac2d-2d4666eeecc2.png)
- `exLayout2.html`에서 id선택자로 `#ulFirst`와 `#ulSecond`태그를 `fragment3.html`로 전송하고, `fragment3.html`에서 해당 태그를 각각 `first`와 `second`로 받음.
- `fragment3.html`의 `<div>`태그 내부에 `exLayout2.html`에서 받아온 태그들(first와 second로 받은)을 출력함.
- 최종적으로 `exLayout2.html`에서 `th:replace`가 전부 감싸고 있으므로 `fragment3.html`의 코드에 `exLayout2.html`에서 받아온 태그들이 포함되서 출력됨.


## 3. 레이아웃 템플릿 만들기
- 앞에서 파라미터로 필요한 영역을 전달해서 처리할 수 있다면 레이아웃 전체를 하나의 페이지로 구성하고, 필요한 부분을 파라미터로 전달하는 방식으로 공통의 레이아웃을 사용할 수 있다는 의미가 됨.

### 1) layout1.html
![image](https://user-images.githubusercontent.com/99089584/229344140-b7a2d73b-a2ae-4094-80b8-6b9aa735cb36.png)

↓ 전체적인 레이아웃(=템플릿)
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<!-- content라는 파라미터를 받을 수 있게 설정-->
<th:block th:fragment="setContent(content)">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

  <style>
    * {
      margin: 0;
      padding: 0;
    }
    .header {
      width: 100vw;
      height: 20vh;
      background-color: aqua;
    }
    .content {
      width: 100vw;
      height: 70vh;
      background-color: lightgray;
    }
    .footer {
      width: 100vw;
      height: 10vh;
      background-color: green;
    }
  </style>

  <div class="header">
    <h1>HEADER</h1>
  </div>
  <!-- CONTENT 영역을 변경 가능하도록 수정 -->
  <div class="content">
    <!-- <h1>CONTENT</h1> -->
    <!-- 파라미터로 전달되는 content를 출력 -->
    <th:block th:replace = "${content}"></th:block>
  </div>
  <div class="footer">
    <h1>FOOTER</h1>
  </div>

</body>
</th:block>
</html>
```

### 2) layout1.html을 사용하기 위한 exTemplate.html 생성
- 전체 내용은 `layout1.html`로 처리하고, 파라미터로 현재 파일의 content 부분만을 전달.

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/layout/layout1 :: setContent(~{this::content})}">

  <th:block th:fragment="content">
    <h1>exTemplate Page</h1>
  </th:block>

</th:block>
```
{: file="exTemplate.html" }

![image](https://user-images.githubusercontent.com/99089584/229344507-a2e916f2-2bbe-4b17-9c9e-161f0047cc91.png)


## 4. 부트스트랩 템플릿 적용
<span>[🔗 부트스트랩 템플릿](https://startbootstrap.com/templates)</span>
##### 1. 다운받은 파일을 resources의 static폴더 내로 복사.
##### 2. layout 폴더에 `basic.html` 파일을 추가하고 위에서 복사한 `index.html`의 내용을 그대로 복붙.
##### 3. `basic.html` 파일 수정

- Thymeleaf와 관련된 설정 추가 + `content` 파라미터 전달받을 수 있는 구조로 설정

  ```html
  <!DOCTYPE html>
  <html lang="en" xmlns:th="http://www.thymeleaf.org">

  <th:block th:fragment="setContent(content)">
  <head>
  ```
  {: file="basic.html" }

  <br>

- 링크를 Thymeleaf의 링크로 처리

  ```html
  <!-- Favicon-->
  <link rel="icon" type="image/x-icon" th:href="@{/assets/favicon.ico}" />
  <!-- Core theme CSS (includes Bootstrap)-->
  <link th:href="@{/css/styles.css}" rel="stylesheet" />
  <!-- Bootstrap core JS-->
  <script th:href="@{https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js}"></script>
  <!-- Core theme JS-->
  <script th:href="@{/js/scripts.js}"></script>    
  ```
  {: file="basic.html" }

  <br>

- `container-fluid` 부분에 파라미터로 전송되는 `content`를 출력하도록 수정

  ```html
  <!-- Page content-->
  <div class="container-fluid">
      <th:block th:replace = "${content}"></th:block>
  </div>
  ```
  {: file="basic.html" }

  <br>

##### 4. `exSidebar.html` 추가
- `basic.html`에 전달하는 파라미터(=content)로 `th:fragment="content"`를 전송.

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.thymeleaf.org">

    <th:block th:replace="~{/layout/basic :: setContent(~{this::content})}">
    <th:block th:fragment="content">
        <h1>exSidebar Page</h1>
    </th:block>
    </th:block>
    ```
    {: file="basic.html" }

    <br>

##### 5. 적용 결과
![image](https://user-images.githubusercontent.com/99089584/229345999-718d7ea4-23d4-453a-afed-f2687e0bd505.png)