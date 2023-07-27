---
layout: post
title:  "[Java] Iterator의 개념 및 사용법"
categories: [Java]
date: 2023-03-31
last_modified_at: 2023-03-31
---

## 1. Iterator란?
자바의 `Collection`에 저장되어 있는 요소들을 순회하는 인터페이스.

---

## 2. Iterator 사용법
### 1) 정의방법
`Iterator<T> iterator = Collection.iterator();`

### 2) Iterator 메서드 종류
![image](https://user-images.githubusercontent.com/99089584/229153012-34f03b71-5065-4c2d-b7a6-84e19c05a088.png)
- `hasNext()` : 다음 요소가 있는지 판단
- `next()` : 다음 요소를 가져옴
- `remove()` : 가져온 요소를 삭제

### 3) 예시 코드
```java
public class IteratorTest {
 
    public static void main(String[] args) {
        
        List<Integer> list = new ArrayList<Integer>();
 
        for(int i = 0;i <= 100; i++) {
            list.add(i);
        }
        
        Iterator<Integer> iter = list.iterator();
        
        while(iter.hasNext()) {
            int data = iter.next();
            System.out.print(data);
        }
        
    }
    
}
```

---

## 3. Iterator과 반복문
```java
for(int i = 0; i<= 100; i++) {
        list.get(i);
}
```
### 1) 반복문
- `get(0)`부터 `get(100)`까지를 수행하게 될 때, 0부터 100까지 총 101번의 요소를 조회하는 것이 아님.
-  `get(int index)` 메서드는 시작 주소부터 index 만큼 요소들을 밟아가며 조회하는 메서드이기 때문.
- 만약 5번째 값을 조회한다면 처음 시작주소부터 시작하여 다음주소를 타고... 타고.. 를 총 5번 반복해야 함. <br>
=> `get` 메서드가 실행되며 i 값이 증가할 때마다 메모리적으로 조회해야 하는 요소는 1번, 2번, 3번, 4번... 101번까지 증가하는 것 = 총 5151번을 조회해야 함.

### 2) Iterator
- `Iterator`는 1부터 101번째까지의 요소에 대해 내부적으로 객체로 생성한 후 순차적으로 조회함.
- 처음 주소로 돌아갈 필요가 없기때문에 `next` 메서드를 통해 조회 시 요소의 개수인 101번만 조회를 하게됨.
<br>

> #### 💡 속도 차이
> - `Iterator`를 구현하기 위해 객체를 생성하는 부분에서 시간이 더 걸리기 때문에 반복문보다 속도면에서 조금 불리.


## 4. 사용 이유
- Collection 프레임워크에 대해 공통으로 사용이 가능함. <br>
=> 컬렉션 종류에 관계없이 일관성 있게 프로그래밍할 수 있음. <br>
=> 소스 코드에 어떠한 컬렉션을 사용할지 정해지지 않았지만 컬렉션 내에 보관한 모든 내용을 출력하는 등의 작업을 먼저 하길 원한다면 Iterator를 사용하는 것은 좋은 선택.
- 사용법이 간단함.


## References
- [[Iterator] 레퍼런스 문서](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Iterator.html)
- [[자료구조] Iterator란? Iterator 사용 이유](https://tlatmsrud.tistory.com/61)
- [[JAVA] Iterator이란? 사용방법과 예제 & 장점과 단점](https://junghn.tistory.com/entry/JAVA-Iterator%EC%9D%B4%EB%9E%80-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%98%88%EC%A0%9C-%EC%9E%A5%EC%A0%90%EA%B3%BC-%EB%8B%A8%EC%A0%90)