---
title:  "[Dart] Dart 기본"
categories: 
    - Flutter
tags: [Dart]
date: 2023-08-06
last_modified_at: 2023-08-06
---

## 1. DartPad

[🔗 https://dartpad.dev/](https://dartpad.dev/)

## 2. 출력
```dart
void main() {
    print('Hello World');
}
```

## 3. 변수 타입
```dart
void main() {
    // var은 자동으로 대입하는 값의 타입으로 유추함
    var name = 'yeonhee';
    String name2 = 'YeonHee';
    String name3 = 'Choi';
    int num = 10;
    double num2 = 1.5;

    // 타입체크
    print(name.runtimeType);   //String

    // 속성이나 메서드를 출력할 경우에는 괄호로 묶어줘야함
    print('${name2.runtimeType} ${name3}');
    print('$name2 $name3');
}
```

## 4. dynamic
```dart
    // dynamic : 모든 타입을 할당할 수 있음
    dynamic name = '연희';
    dynamic num = 3;

    // dynamic 과 var
    // dynamic 은 재선언 할 수 있지만 var은 선언할 때의 타입으로 고정되어버려서 변경 불가
    dynamic name2 = 'yh';
    var name3 = 'yeonhee';
    name2 = 1;
    //name3 = 1; // error
```

## 5. nullable / non-nullable
- 모든 타입은 두 가지로 나뉜다.
1. 해당 타입만 들어갈 수 있는 경우 (`non-nullable`)
2. 해당 타입과 `null`까지 들어갈 수 있는 경우 (`nullable`)

```dart
String name = 'yh';
//name = null; // error

// ?를 붙이면 nullable로 선언 가능   
String? name2 = 'yeonhee';
name2 = null; 
print(name2);   //null
// !는 null이 아니라는 의미(=null이 될 수 없다)
// nullable한 값에 ! 를 붙이면 현재 이 값은 null이 아니다 라는 의미
print(name2!);
```

## 6. final, const
```dart
// 공통 : 재선언 불가
final String name = 'yh';
const String name2 = 'yeonhee';

// 공통 : final/const는 var기능까지 제공하므로 타입 생략 가능
final name3 = 'apple';
const name4 = 'banana';
```

- 차이점
1. `final` : 빌드 타임의 값을 몰라도 된다.
2. `const` : 빌드 타임의 값을 알고 있어야 한다. (즉, 코드를 작성하는 순간에 이 코드의 값을 알고 있어야 한다)


## 7. ++, \--
```dart
int number = 2; //2
number ++;  //3
number --;  //2

number += 3;
number -= 2;
```


## 8. ??=
```dart
double? num = 2.0;
num = null;     //null
// ??= : num이 null이면 오른쪽 값을 할당
num ??= 3.0;    //3.0
```


## 9. 타입 체크
```dart
int num = 1;
print(num is int);      //true
print(num is String);   //false

print(num is! int);     //false
print(num is! String);  //true
```


## 10. enum(열거형)
- 열거형(enum)을 정의하는 데이터 형식.
- 열거형은 특정 값들의 집합을 나타내는 타입으로, 각 값은 상수로 취급된다.

```dart
enum Color {
  red,
  green,
  blue,
}

void main() {
  Color myColor = Color.green;

  switch (myColor) {
    case Color.red:
      print("The color is red");
      break;
    case Color.green:
      print("The color is green");
      break;
    case Color.blue:
      print("The color is blue");
      break;
  }
}
```


## 11. 함수

### 1) optional parameter
```dart
// {}를 사용해 optional parameter임을 명시
// int age = 0 처럼 기본값 할당 가능
void printUserInfo(String name, {int age = 0, String? country}) {
  // 중략
}

void main() {
  // 함수 호출 시 optional parameter를 생략할 수 있다
  printUserInfo("John");
}
```

### 2) named parameter
- 함수 호출 시 매개변수의 이름을 명시적으로 지정하여 함수에 값을 전달하는 방식.
- 매개변수의 순서를 신경쓰지 않고 함수를 호출할 수 있다.

```dart
void main() {
    addNumbers(y: 20, x: 10);
}

addNumbers({
    // required : 필수값
    required int x,
    required int y,
    // 기본값을 지정해주면서 optional parameter로 사용 가능
    int z = 30,
}) {
    // 중략
}
```


### 3) positional parameter + named parameter
- `x`는 순서 고정(`positional parameter`), 나머지는 `named parameter`

```dart
void main() {
    addNumbers(10, y: 20);
}

addNumbers(int x, {
    required int y,
    int z = 30,
}) {
    // 중략
}
```



### 4) 화살표 함수

```dart
void main() {
    addNumbers(10, y: 20);
}

addNumbers(int x, {
    required int y,
    int z = 30,
}) => x + y + z;
```



## 12. typedef
`typedef` : 함수 형식에 이름을 부여하는 기능을 제공하는 키워드.
- `typedef`를 사용하면 함수의 형식을 미리 정의하여 코드의 가독성을 높이고, 함수 형식을 재사용할 수 있게 된다.
- 함수 형식은 함수의 시그니처를 의미하며, 매개변수의 타입과 반환 타입으로 구성된다.

```dart
void main() {
    int result = calculate(10, 20, add);
    print(result);  //30

    int result2 = calculate(10, 20, subtract);
    print(result2); //-10
}

// signature
typedef Operation = int Function(int x, int y);

int add(int x, int y) => x + y;

int subtract(int x, int y) => x - y;

int calculate(int x, int y, Operation operation) {
    return operation(x, y);
}
```

#### 해설
1. `Operation`은 `int` 반환값과 두 개의 `int` 매개변수를 갖는 함수를 대표하는 타입이다.
2. `add` 함수와 `subtract` 함수는 각각 `Operation` 타입의 함수와 호환되는데, <br>
이는 두 함수가 `int` 반환값과 두 개의 `int` 매개변수를 가지므로 `Operation` 형식을 만족하기 때문이다. <br>
⇒ `typedef`를 사용하여 정의한 함수 형식(`Operation` 타입)에 맞는 함수는 자동으로 해당 함수 형식에 매칭된다. <br>
⇒ 즉, `add` 함수와 `subtract` 함수의 타입은 `Operation` 이다.



## Reference
[🔗 Dart #1 기본기](https://www.inflearn.com/course/%ED%94%8C%EB%9F%AC%ED%84%B0-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?inst=8e073d05#curriculum)
