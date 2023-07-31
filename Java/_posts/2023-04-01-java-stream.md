---
layout: post
title:  "[Java] Stream의 개념 및 사용법"
categories: [Java]
tags: [Stream, 병렬]
date: 2023-04-01
last_modified_at: 2023-04-01
---

## 1. 스트림(Stream)이란?
- 컬렉션(배열 포함)의 저장 요소를 하나씩 참조해서 람다식(함수적-스타일(functional-style))으로 처리할 수 있도록 해주는 반복자.

## 2. 반복자 스트림
```java
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

public class IteratorVsStreamExample {
	
	public static void main(String[] args) {
		
		List<String> list = Arrays.asList("홍","신","김");
		
		//Iterator 이용
		Iterator<String> iter = list.iterator();
		while(iter.hasNext()) {
			String name = iter.next();
			System.out.println(name);
		}
		
		System.out.println();
		
		//Stream 이용
		Stream<String> stream = list.stream();
		stream.forEach( name -> System.out.println(name) );
	}

}
```

## 3. 스트림의 특징
### 1) 람다식으로 요소 처리 코드를 제공함.
```java
public class Student {

	private String name;
	private int score;
	
	public Student(String name, int score) {
		this.name = name;
		this.score = score;
	}

	public String getName() {
		return name;
	}

	public int getScore() {
		return score;
	}
	
}
```

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class LambdaExpressionsExample {

	public static void main(String[] args) {
		
		List<Student> list = Arrays.asList(
				new Student("홍", 90),
				new Student("신", 92)
		);
		
		Stream<Student> stream = list.stream();
		stream.forEach( s-> {
			String name = s.getName();
			int score = s.getScore();
			System.out.println(name + "-" + score);
		});
		
	}
}
```

### 2) 내부 반복자를 사용하므로 병렬 처리가 쉬움.
- 외부 반복자 : `index`를 이용하는 `for문`, `Iterator`를 이용하는 `while문`
- 내부 반복자 : 컬렉션 내부에서 요소들을 반복시키고, 개발자는 요소당 처리해야 할 코드만 제공하는 코드 패턴
- 내부 반복자는 요소들의 반복 순서를 변경하거나, 멀티 코어 CPU를 최대한 활용하기 위해 요소들을 분배시켜 병렬 작업을 할 수 있게 도와주기 때문에 하나씩 처리하는 순차적 외부 반복자보다는 효율적으로 요소를 반복시킬 수 있음.
- 스트림은 람다식으로 요소 처리 내용만 전달할 뿐, 반복은 컬렉션 내부에서 일어남.

> #### ＊ 병렬(parallel) 처리란?
> - 한 가지 작업을 서브 작업으로 나누고, 서브 작업들을 분리된 스레드에서 병렬적으로 처리하는 것.
> - 병렬 처리 스트림을 이용하면 런타임시 하나의 작업을 서브 작업으로 자동으로 나누고, 서브 작업의 결과를 자동으로 결합해서 최종 결과물을 생성함.
> - 병렬 처리 스트림 선언 예시 : <br>
> `List<String> list = new ArrayList<>();` <br>
> `Stream<String> parallelStream = list.parallelStream();`


### 3) 스트림은 중간 처리와 최종 처리를 할 수 있음.
- 중간 처리 : 매핑, 필터링, 정렬 수행
- 최종 처리 : 반복, 카운팅, 평균, 총합 등 집계 처리 수행
- 예시 <br>
  1. 학생 객체를 요소로 가지는 컬렉션이 있다고 가정.
  2. 중간 처리 : 학생의 점수를 뽑아냄(Student 객체를 점수로 매핑)
  3. 최종 처리 : 점수의 평균값을 산출함(집계)

#### 예시 코드

```java
import java.util.Arrays;
import java.util.List;

public class MapAndReduceExample {
	
	public static void main(String[] args) {
		List<Student> studentList = Arrays.asList(
				new Student("홍", 10),
				new Student("신", 20),
				new Student("유", 30)
		);
		
		double avg = studentList.stream()
				// 중간 처리(학생 객체를 점수로 매핑
				.mapToInt(Student :: getScore)
				// 최종 처리(평균 점수)
				.average()
				.getAsDouble();
		
		System.out.println("평균 점수 = " + avg);
	}

}
```

## 4. 스트림의 종류
- `Stream` : 객체 요소 처리
- `IntStream`, `LongStream`, `DoubleStream` : 각각 `int`, `long`, `double` 요소 처리

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class StreamExample {
	
	public static int sum;
	
	public static void main(String[] args) {
		
		List<Student> studentList = Arrays.asList(
				new Student("홍", 10),
				new Student("신", 20),
				new Student("유", 30)
		);
		
		// 컬렉션으로부터 스트림 얻기
		Stream<Student> stream = studentList.stream();
		stream.forEach( s-> System.out.println(s.getName()) );
		
		System.out.println("=======================================");
		
		String[] setArray = {"홍","신","유"};
		// 배열로부터 스트림 얻기
		Stream<String> strStream = Arrays.stream(setArray);
		strStream.forEach( str -> System.out.println(str) );
		
		System.out.println("=======================================");
		
		// 정수 범위를 소스로 하는 스트림
		// rangeClosed() : 첫 번째 매개값에서부터 두 번째 매개값까지 순차적으로 제공하는 IntStream을 리턴
		IntStream intStream = IntStream.rangeClosed(1, 100);
		intStream.forEach( n -> sum += n);
		System.out.println("총합: " + sum);
		
	}

}
```

## 5. 스트림 파이프라인
- 리덕션(`Reduction`) : 
  - 대량의 데이터를 가공해서 축소하는 것.
  - ex) 데이터의 합계, 평균값, 카운팅, 최대값, 최소값 등이 리덕션의 결과물
- 파이프라인(`pipelines`) : 
  - 여러 개의 스트림이 연결되어 있는 구조.
  - 스트림은 중간 처리와 최종 처리를 파이프라인으로 해결함.
  - `Stream` 인터페이스에는 많은 중간 처리 메서드가 있는데, 이 메서드들은 중간 처리된 스트림을 리턴하며, 이 스트림에서 다시 중간 처리 메서드를 호출해서 파이프라인을 형성하게 됨.

#### 남자 평균 나이 구하기 예제 코드
```java
public class Member {
	
	public static int MALE = 0;
	public static int FEMALE = 1;
	
	private String name;
	private int sex;
	private int age;
	
	public Member(String name, int sex, int age) {
		this.name = name;
		this.sex = sex;
		this.age = age;
	}

	public int getSex() {
		return sex;
	}

	public int getAge() {
		return age;
	}
	
}
```

```java
import java.util.Arrays;
import java.util.List;

public class StreamPipelinesExample {
	
	public static void main(String[] args) {
		
		List<Member> list = Arrays.asList(
			new Member("홍", Member.MALE, 30),
			new Member("김", Member.FEMALE, 20),
			new Member("신", Member.MALE, 45),
			new Member("박", Member.FEMALE, 27)
		);
		
		// 남자 평균 나이 구하기
		double ageAvg = list.stream()
				.filter( m -> m.getSex()==Member.MALE )
				.mapToInt(Member :: getAge)
				.average()
				.getAsDouble();
		
		System.out.println("남자 평균 나이 : " + ageAvg);
	}

}
```
