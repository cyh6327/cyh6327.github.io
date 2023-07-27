---
title:  "[JS/jQuery] 자바스크립트 기초 문제 정리"
categories: 
    - JS&jQuery
tags: [hoisting, static, primitive type, reference type, prototype, new, this]
date: 2023-07-14
last_modified_at: 2023-07-14
---

[https://github.com/lydiahallie/javascript-questions/blob/master/ko-KR/README-ko_KR.md](https://github.com/lydiahallie/javascript-questions/blob/master/ko-KR/README-ko_KR.md)


## 1. 호이스팅(hoisting)
- 함수 안에 있는 선언들을 모두(초기화 제외) 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것을 말함.
- 인터프리터가 변수와 함수의 메모리 공간을 선언 전에 미리 할당하는 것을 의미.
- `var`로 선언한 변수의 경우 호이스팅 시 `undefined`로 변수를 초기화함. 
- 반면 `let`과 `const`로 선언한 변수도 호이스팅 대상이지만, `var`와 달리 호이스팅 시 메모리 공간만 할당하는 선언만 될 뿐 `undefined`로 변수를 초기화하지는 않음. <br> 
⇒ 따라서 변수의 초기화를 수행하기 전에 읽는 코드가 먼저 나타나면 참조할 대상이 없으므로 예외가 발생함. (`reference error`)

```js
function sayHi() {
  console.log(name);	//undefined 
  console.log(age);		//ReferenceError
  var name = 'Lydia';
  let age = 21;
}

sayHi();
```




## 3. 화살표 함수의 `this` 키워드는 일반 함수와는 다르게 현재 주변 스코프를 참조한다

```js
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius,
};

console.log(shape.diameter());  //20
console.log(shape.perimeter());	//NaN
```

- `perimeter`를 호출할 때 `this`는 `shape`객체가 아닌 주변 스코프(전역)를 참조함.
- 전역 스코프에는 `radius`라는 값이 없기 때문에 `undefined` 반환.






## 6. 모든 객체는 서로를 동일하게 설정하면 참조로 상호작용한다
- 즉, 하나의 객체를 변경하면 모든 객체가 변한다.

```js
let c = { greeting: 'Hey!' };
let d;

d = c;
c.greeting = 'Hello';
console.log(d.greeting);	//Hello
```

### +) 위 예시를 const로 바꿔서 실행시켰더니
- `Uncaught SyntaxError: Missing initializer in const declaration` 에러가 났다.
- js에서 `const`는 상수를 의미하는 변수였다.

> #### * 상수(constant) :
> - 프로그램이 변경할 수 없는 값을 의미.
> - 재할당을 통해 변경할 수 없으며, 재선언할 수도 없다.

⇒ 따라서 `var`, `let`과는 다르게 `const`는 선언시 초기화를 해줘야 한다.





## 8. static

```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: 'purple' });
console.log(freddie.colorChange('orange'));		//TypeError
```

- `static` 메서드는 해당 생성자에서만 살아있도록 설계되었기 때문에 어떤 자식들도 상속받을 수 없다.
- js에서 class의 인스턴스인 객체를 만들었다면 해당 객체는 클래스를 상속받는 자식 객체이다.
- 따라서 자식인 `freddie` 객체는 `static` 메서드를 상속받을 수 없기 때문에 `TypeError` 발생.







## 10. js에서 함수는 객체이다(원시형 이외는 모두 객체)

### 1) 원시 자료형(primitive type)
- 원시 자료형이 할당될 때에는 변수에 값(value) 자체가 담긴다.
- `string, number, bigint, boolean, undefined, symbol, null`

> #### * null :
> - JavaScript의 설계 결함으로 인해 `typeof null`을 실행하면 `object`라는 결과가 반환됨.
> - 이는 오래된 버그로 인해 발생한 문제로, JavaScript의 초기 버전에서 발생한 호환성 이슈임.
> - 실제로 `null`은 객체가 아닌 원시값이며, 객체의 특성을 갖지 않음.
> - 따라서 `null`은 원시형으로 간주되어야 함.

### 2) 자료 참조형(reference type)
- 참조 자료형이 할당될 때는 보관함의 주소(reference)가 담긴다.
- 자바스크립트에선 원시 자료형이 아닌 모든 것은 참조 자료형이다.
- 참조형은 원시형 데이터의 집합이다.
- 배열([])과 객체({}), 함수(function(){})가 대표적이다.
- 참조 자료형을 변수에 할당할 때는 변수에 값이 아닌 주소를 저장한다.
- 동적으로 크기가 변하는 데이터를 보관하기위해 변수가 아닌 다른곳(힙 영역)에 데이터를 저장하고 변수에는 그 주소만 할당한다.

### +) `const`로 선언된 변수 배열에 `Array.push`를 적용할 수 있는 이유
- `const`는 배열의 주소가 변경되는 것을 방지하지만, 배열 내부의 요소를 수정하거나 추가하는 것은 허용되기 때문.





## 11. 메서드를 `prototype` 속성에 추가하기

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const member = new Person('Lydia', 'Hallie');
Person.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

console.log(member.getFullName());	//TypeError
```

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.getFullName = function () {
	  return `${this.firstName} ${this.lastName}`;
  };
}
```
- 이렇게 내부에 메서드를 추가하면 정상적으로 작동 되지만 일반적으로 생성자 함수에 메서드를 추가하는 건 좋지 않음.

### 메서드를 `prototype` 속성에 추가
```js
Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
```
- 이렇게 외부에 메서드를 `prototype` 속성에 추가하기
- +) `prototype` 사용시 장점 : <br>
	1. 메모리 사용과 성능 면에서 이점이 있음.
  2. 객체 인스턴스 간에 공유되는 메서드를 가지고 싶을 때 효과적.
	
	



### 12. `new` 키워드와 `this` 참조
- `new`를 사용한 경우, `this`는 생성한 새로운 빈 객체를 참조하지만, `new`를 추가하지 않으면 전역 변수를 참조함.

```js
var firstName = "Choi";
var lastName = "Yeonhee";

console.log(firstName);	//Choi
console.log(lastName);	//Yeonhee

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const lydia = new Person('Lydia', 'Hallie');
const sarah = Person('Sarah', 'Smith');

console.log(lydia);		//Person {firstName: "Lydia", lastName: "Hallie"}
console.log(sarah);		//undefined
console.log(firstName);	//Sarah
console.log(lastName);	//Smith
```