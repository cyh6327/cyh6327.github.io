---
layout: post
title:  "[Java] 람다식(Lambda Expressions)의 개념 및 사용법"
categories: [Java]
date: 2023-04-01
last_modified_at: 2023-04-01
---

# [JAVA] 람다식(Lambda Expressions)의 개념 및 사용법

## 1. 람다식이란?
- 함수적 프로그래밍 : 병렬 처리와 이벤트 지향 프로그래밍에 적합함. <br>
=> 객체 지향 프로그래밍과 함수적 프로그래밍을 혼합함으로써 더욱 효율적인 프로그래밍이 될 수 있음.
- 람다식 : 익명 함수(anonymous function)를 생성하기 위한 식.
- 자바에서 람다식을 사용할 때의 장점
    - (1) 자바 코드가 매우 간결해짐.
    - (2) 컬렉션의 요소를 필터링하거나 매핑해서 원하는 결과를 쉽게 집계할 수 있음.
- 람다식의 형태는 매개 변수를 가진 코드 블록이지만, 런타임 시에는 익명 구현 객체를 생성함.
- `Runnable` 인터페이스 구현 코드 <br>

```java
// Runnable 인터페이스의 익명 구현 객체를 생성하는 전형적인 코드
Runnable runnable = new Runnable() {
    public void run() {...}
};

// 위 익명 구현 객체를 람다식으로 표현
Runnable runnable = () -> {...};
```
- 람다식은 `(매개변수)->{실행코드}` 형태로 작성되며, 런타임 시에 인터페이스의 익명 구현 객체로 생성됨.


## 2. 람다식 기본 문법
### 1) 람다식 작성법
`(타입 매개변수, ...) -> { 실행문; ... }`
- `(타입 매개변수, ...)` : 오른쪽 중괄호 {} 블록을 실행하기 위해 필요한 값을 제공하는 역할.
- `->` : 매개 변수를 이용해서 중괄호 {}를 실행한다는 뜻

### 2) 예시
` a -> System.out.println(a); `
- 매개 변수 타입은 런타임 시에 대입되는 값에 따라 자동으로 인식될 수 있으므로 람다식에서는 매개 변수 타입을 일반적으로 언급하지 않음.
- 하나의 매개변수만 있다면 괄호 생략 가능.
- 하나의 실행문만 있다면 중괄호 생략 가능.


### 2-1) 예시

`(x, y) -> { return x + y; };` <br>
↓ 중괄호에 return문만 있을 경우 생략 <br>
`(x, y) -> x + y`


## 3. 타겟 타입과 함수적 인터페이스
- 자바는 메서드를 단독으로 선언할 수 없고 항상 클래스의 구성 멤버로 선언하기 때문에 람다식은 단순히 메서드를 선언하는 것이 아니라 이 메서드를 가지고 있는 '객체'를 생성해 냄.
- 람다식은 인터페이스의 익명 구현 객체를 생성함. <br>
=> 인터페이스는 직접 객체화할 수 없기 때문에 구현 클래스가 필요한데, 람다식은 익명 구현 클래스를 생성하고 객체화함.
- 람다식은 대입될 인터페이스의 종류에 따라 작성 방법이 달라지기 때문에 람다식이 대입될 인터페이스를 람다식의 타겟 타입(target type)이라고 함.


## 4. 함수적 인터페이스(@FunctionalInterface)
- 람다식이 하난의 메서드를 정의하기 때문에 두 개 이상의 추상 메서드가 선언된 인터페이스는 람다식을 이용해서 구현 객체를 생성할 수 없음.
- 함수적 인터페이스(functional interface) : 하나의 추상 메서드가 선언된 인터페이스
- `@FunctionalInterface` <br>
함수적 인터페이스를 작성할 때 두 개 이상의 추상 메서드가 선언되지 않도록 컴파일러가 체크해주는 기능. <br>
=> 두 개 이상의 추상 메서드가 선언되면 컴파일 오류 발생시킴.


## 5-1. 매개변수와 리턴값이 없는 람다식
```java
@FunctionalInterface
public interface MyFunctionalInterface {
	
	// 람다식 MyFunctionalInterface fi = () -> {...}
	// 해당 람다식에서 매개변수가 없는 이유는 method()가 매개변수를 가지지 않기 때문.
	public void method();
}
```
```java
public class MyFunctionalInterfaceExample {
	
	public static void main(String[] args) {
		
		MyFunctionalInterface fi;
		
		fi = () -> {
			String str = "method call1";
			System.out.println(str);
		};
		// 람다식이 대입된 인터페이스의 참조 변수는 method()를 호출할 수 있음.
		// method() 호출은 람다식의 중괄호{}를 실행시킴.
		fi.method();
		
		fi = () -> { System.out.println("method call2"); };
		fi.method();
		
		fi = () -> System.out.println("method call3");
		fi.method();
		
	}

}
```

## 5-2. 매개변수가 있는 람다식
```java
@FunctionalInterface
public interface MyFunctionalInterface2 {
	
	// 람다식 MyFunctionalInterface2 fi = x -> {...}
	public void method(int x);
	
}
```
```java
public class MyFunctionalInterfaceExample2 {
	
	public static void main(String[] args) {
		
		MyFunctionalInterface2 fi;
		
		fi = x -> System.out.println(x*5);
		fi.method(2);	// 매개값으로 2를 줬으므로 위 람다식의 x 변수에 2가 대입됨 | 결과: 10
		
	}

}
```

## 5-3. 리턴값이 있는 람다식
```java
@FunctionalInterface
public interface MyFunctionalInterface3 {
	
	// 람다식 MyFunctionalInterface3 fi = (x,y) -> { ...; return값; }
	public int method(int x, int y);
    
}
```
```java
public class MyFunctionalInterfaceExample3 {
	
	public static void main(String[] args) {
		
		MyFunctionalInterface3 fi;
		
		fi = (x, y) -> x + y;
		System.out.println(fi.method(2, 5));
		
		fi = (x, y) -> sum(x, y);
		System.out.println(fi.method(2, 5));
		
	}

	public static int sum(int x, int y) {
		return (x+y);
	}

}
```

