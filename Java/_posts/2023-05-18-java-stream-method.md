---
layout: post
title:  "[Java] Stream 메서드"
categories: [Java]
tags: [Stream, map, boxed]
date: 2023-05-18
last_modified_at: 2023-05-18
---

## 1. IntStream
### 1) range() / rangeClosed() 차이
- `range()` : 종료 값을 포함하지 않음. <br>
`rangeClosed()` : 종료값을 포함해서 반환.

#### 예시

```java
IntStream.range(0, 5).forEach(System.out::println);         // 0~4
IntStream.rangeClosed(0, 5).forEach(System.out::println);   // 0~5
```

## 2. map()
- `map()`연산은 스트림의 각 요소를 주어진 함수(Function)에 적용하여 새로운 스트림으로 변환(매핑)하는데 사용됨. <br>
- 원래의 데이터를 재가공하고 변환하는 용도(스트림에 있는 숫자들을 제곱한다거나, 객체의 특정 속성을 추출하는 등)로 사용. <br>
- 원본 스트림을 변경하지 않고 새로운 스트림을 생성하므로, 원본 데이터를 유지한 채로 변환된 데이터를 다룰 수 있음.

```java
@Data
// 다양한 곳에서 사용할 수 있도록 제네릭 타입을 이용해 DTO와 EN이라는 타입을 지정.
public class PageResultDTO<DTO, EN> {
    
    private List<DTO> dtoList;
    
    public PageResultDTO(Page<EN> result, Function<EN, DTO> fn) {
        dtoList = result.stream().map(fn).collect(Collectors.toList());
    }
}
```


## 3. boxed()
### 1) 사용 이유
- `IntStream` 같이 원시 타입에 대한 스트림 자원을 클래스 타입(ex. `IntStream -> Stream<Integer>`)으로 전환하여 전용으로 실행 가능한 기능을 수행하기 위함. <br>
ex) `int` 자체로는 `Collection`에 못 담기 때문에 `Integer` 클래스로 변환하여 `List<Integer>` 로 담기 위해 사용.




