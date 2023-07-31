---
title:  "[JS/jQuery] 기본 개념 정리"
categories: 
    - JS&jQuery
date: 2023-04-26
last_modified_at: 2023-04-27
---

# [JavaScript/jQuery] 기본 개념 정리


## 1. 프로토타입 기반 언어
- JavaScript는 프로토타입 기반 언어(prototype-based language).
- 모든 객체들이 메소드와 속성들을 상속 받기 위한 템플릿으로써 프로토타입 객체(prototype object)를 가진다는 의미. <br>
=> 프로토타입은 JavaScript 객체가 또다른 객체로 특성을 상속시키기 위한 메커니즘.
- 프로토타입 체인(prototype chain): <br>
  - 프로토타입 객체도 또 다시 상위 프로토타입 객체로부터 메소드와 속성을 상속 받을 수도 있고 그 상위 프로토타입 객체도 마찬가지.
  - 이로 인해 다른 객체에 정의된 메소드와 속성을 한 객체에서 사용할 수 있음.

- 상속되는 속성과 메소드들은 각 객체가 아니라 객체의 생성자의 `prototype`이라는 속성에 정의되어 있음.
- `prototype` 속성도 하나의 객체이며 프로토타입 체인을 통해 상속하고자 하는 속성과 메소드를 담아두는 버킷으로 주로 사용되는 객체임.

- `Object.is()`, `Object.keys()`등 `prototype` 버킷에 정의되지 않은 멤버들은 상속되지 않음. <br> 
=> 이것들은 Object() 생성자에서만 사용할 수 있는 멤버들.

### 1) Object.getPrototypeOf(obj)
- 해당 함수를 통해 객체의 프로토타입 객체에 바로 접근할 수 있음.

```js
var myString = 'This is my string.';
Object.getPrototypeOf(myString);  //String 객체
```

### 2) 도큐먼트 오브젝트 모델(DOM)에 접근
```js
var myDiv = document.createElement('div');
var myVideo = document.querySelector('video');
```

- 각 웹페이지가 로딩될 때, `Document` 인스턴스가 만들어지고, 전체 웹 페이지 구조와 컨텐츠 그리고 URL같은 기능들을 제공하는 `document` 가 호출됨. 
- `document`를 통해 여러 공통 메소드와 프로퍼티들을 사용할 수 있음.





## 2. 생성자 함수
- 객체를 생성하는 함수.
- `new` 연산자와 함께 사용되며, `new` 연산자는 생성자 함수를 호출하고, 생성자 함수는 객체를 생성하고 반환함.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
```
```js
const person = new Person('John Doe', 30);
```


## 3. 객체 접근법
- 점 표기법, 괄호 표기법
- 대괄호 표현의 이점 중 하나는 멤버의 값을 동적으로 변경할 수 있을 뿐아니라, 멤버 이름까지도 동적으로 사용할 수 있다는 것.

```js
// Person 생성자함수에 height의 속성과 값을 지정
var myDataName = 'height';
var myDataValue = '1.75m';
console.log(person.height); //undefined

var myDataName = 'height';
var myDataValue = '1.75m';
person[myDataName] = myDataValue; //1.75m
```



## 4. 프로토타입 수정
### 1) 메서드 추가
- `prototype`에 새 메서드를 추가하는 순간 동일한 생성자로 생성된 모든 객체에서 추가된 메서드를 바로 사용할 수 있음. <br>
=> 프로토타입 객체는 모든 인스턴스에서 공유하기 때문에 정의하는 즉시 별도의 갱신 과정 없이 접근이 가능.

```js
function Person(first, last, age, gender, interests) {

  // 속성과 메소드 정의

}

var person1 = new Person('Tammi', 'Smith', 32, 'neutral', ['music', 'skiing', 'kickboxing']);

// Person 생성자의 prototype 속성에 farewell 메서드 추가
Person.prototype.farewell = function() {
  alert(this.name.first + ' has left the building. Bye for now!');
};
```

### 2) 속성 추가
- `prototype`에 속성을 정의하는 것은 좋은 방법이 아님.

```js
Person.prototype.fullName = this.name.first + ' ' + this.name.last; //undefined undefined
```
- 이 경우 `this`는 함수 범위가 아닌 전역 범위를 가리키므로 코드가 의도대로 동작하지 않음. <br>
=> 따라서 생성자에서 정의하는 것이 일반적으로 더 좋음.

### 3) 가독성
- 일반적인 방식으로는 속성은 생성자에서, 메소드는 프로토타입에서 정의함.<br>
생성자에는 속성에 대한 정의만 있으며 메소드는 별도의 블럭으로 구분할 수 있으니 코드를 읽기가 훨씬 쉬워짐.

```js
// 생성자에서 속성 정의

function Test(a, b, c, d) {
  // 속성 정의
}

// 첫 메소드 정의

Test.prototype.x = function() { ... };

// 두번째 메소드 정의

Test.prototype.y = function() { ... };

// 그 외.
```






## 5. ECMAScript(ES)
- 자바스크립트를 표준화하기 위해 만들어진 규격





## 6. 객체 생성 방법
1. 객체 생성자를 사용하는 방식

```js
let o = new Object()
o.foo = 42
```

2. 객체 리터럴(=객체를 생성하는 문법)을 사용하는 방식

```js
let o = {
  foo : 42
}
```




## 7. jqxgrid jqgrid 차이
### 1)공통
jqxGrid와 jqGrid 모두 JavaScript 기반의 그리드 플러그인임

### 2) 차이점
- jqxGrid: <br> 
(1) JQWidgets라는 상용 라이브러리의 일부임. <br>
(2) jqxGrid는 사용자 인터페이스 및 상호 작용에 더 중점을 두고, 다중 브라우저 및 모바일 장치 지원, 사용자 지정 가능한 테마 및 다양한 플러그인을 제공함. <br>
(3) 더 많은 데이터 편집 및 서식 기능을 제공하며, 다른 프로그래밍 언어와의 통합을 지원함.
- jqGrid: 무료 오픈 소스 라이브러리



## 8. 콜백함수
### 1) 정의
- 인자로 넘겨지는 함수.
- 함수를 등록하기만 하고 어떤 이벤트가 발생했거나 특정 시점에 도달했을 때 시스템에서 호출하는 함수. <br>
> 함수는 다른 함수의 인자로 쓰일 수도 어떤 함수에 의해 리턴될 수도 있음.

### 2) 예시
```js
function findUserAndCallBack(id, cb) {
  const user = {
    id: id,
    name: "User" + id,
    email: id + "@test.com",
  };
  cb(user); //매개변수 user는 아래의 function익명 함수를 콜백 함수로 할당받음
  //cb(user); 실행될 때 이 콜백 함수가 실행됨.
}

findUserAndCallBack(1, function (user) {
  console.log("user:", user);
});
```
> 콜백 함수를 넣음에 따라 함수 내부에서 수행해주기 때문에 결과값을 return할 필요가 없다.


## 9. 비동기 함수
### (1) Javascript는 Single Thread
- 한 번에 하나의 작업만 수행이 가능
- 하지만 여러 경우에서 동시에 병렬로 처리해야하는 작업들(ex. 브라우저상에서 이미지 로딩, 스크롤 액션, 버튼 누르기 등)이 있음. <br>
=> Javascript는 비동기 함수들을 사용할 수 있게 지원해주고 있음.
- 비동기 함수: `setTimeout`, `ajax`, `Promise`객체를 반환함으로써 직접 비동기 함수를 만들 수도 있음,

### (2) Call Stack
- 함수의 호출을 스택방식으로 기록하는 자료구조.
- 프로그램에서 요청이 들어올 때마다, 순서대로 스택에 담고, 가장 나중에 들어온 작업을 먼저 처리하는 LIFO(Last In First Out) 의 구조.



## 10. DOM(Document Object Model) 객체
- HTML 문서를 객체 모델로 표현한 것. 
- `DOM`은 HTML 문서의 각 요소를 객체로 나타내어 JavaScript로 조작할 수 있도록 해줌.
- HTML 문서의 모든 요소는 DOM 객체로 표현됨. <br>
예를 들어, HTML 문서의 `<body>` 요소는 `document.body`와 같이 `document` 객체의 `body` 프로퍼티를 통해 접근할 수 있음.
> - `DOM`은 JavaScript의 `document` 객체를 통해 접근할 수 있으며, `getElementById`, `getElementsByTagName`, `getElementsByClassName` 등의 메서드를 사용하여 HTML 요소에 접근할 수 있음.
> - 마찬가지로 jQuery의 `$` 함수도 `DOM` 객체를 조작하는 것임.












## 11. localStorage
### 1) web storage란
- 저장해야할 데이터가 별로 중요하지 않거나, 유실되도 무방할 데이터라면 서버 단에 데이터를 저장하는 것이 낭비일 수가 있음.
- 웹 스토리지는 클라이언트 단, 즉 브라우저 상에 데이터를 저장할 수 있는 기술임.
- 웹 스토리지(web storage)에는 로컬 스토리지(localStorage)와 세션 스토리지(sessionStorage)가 있음.

### 2) 로컬 스토리지 vs 세션 스토리지
- 세션 스토리지는 웹페이지의 세션이 끝날 때 저장된 데이터가 지워지는 반면에, 로컬 스토리지는 웹페이지의 세션이 끝나더라도 데이터가 지워지지 않음.
- 즉, 브라우저에서 같은 웹사이트를 여러 탭이나 창에 띄우면, 여러 개의 세션 스토리지에 데이터가 서로 격리되어 저장되며, 각 탭이나 창이 닫힐 때 저장해 둔 데이터도 함께 소멸함. <br> 
반면에, 로컬 스토리지의 경우 여러 탭이나 창 간에 데이터가 서로 공유되며 탭이나 창을 닫아도 데이터는 브라우저에 그대로 남아 있음.

### 3) 기본 API
- 웹 스토리지는 기본적으로 키(key)와 값(value)으로 이루어진 데이터를 저장할 수 있음.
- 엄밀하게는 `window.localStorage`를 사용해야하지만, window 객체의 대부분의 속성이 그러하듯, 줄여서 `localStorage`로 로컬 스토리지 객체에 접근할 수 있음.
- 오직 문자형(string) 데이터 타입만 지원함.
  > 해결 방법 :
  > - JSON 형태로 데이터를 읽고 쓰기
  >```js
  > localStorage.setItem('json', JSON.stringify({a: 1, b: 2})) //undefined
  > JSON.parse(localStorage.getItem('json')) //{a: 1, b: 2}
  >```

### 4) 예시
```js
// 키에 데이터 쓰기
localStorage.setItem("key", value);

// 키로 부터 데이터 읽기
localStorage.getItem("key");

// 키의 데이터 삭제
localStorage.removeItem("key");

// 모든 키의 데이터 삭제
localStorage.clear();

// 저장된 키/값 쌍의 개수
localStorage.length;
```






## 12. this
### 1) 정의
- 지금 동작하고 있는 코드를 가지고 있는 객체를 가리킴.
- 함수가 실행될 때 동적으로 결정되는 특별한 객체를 가리킴.
- 일반적으로 함수 내부에서 `this`는 함수가 호출될 때 사용된 객체를 참조함. <br>
함수를 객체의 메서드로 호출한 경우, `this`는 해당 객체를 가리키게 됨.

### 2) 예시
```js
function EcoGrid_jqx(id, colModel, data, option) {
  this._gridid         	= id;
}

var myGrid = new EcoGrid_jqx("grid1", colModel, data, option);
```
> - 변수에 할당된 값이 객체인 경우, 해당 변수는 객체를 참조하고 있는 것.
> - `EcoGrid_jqx` 함수를 생성자로 사용하여 `myGrid` 객체를 생성하면, `this._gridid`는 `myGrid._gridid`와 같음.









