---
title:  "[JAVA] Collection 인터페이스와 구현클래스"
categories: 
    - java
date: 2023-02-24
last_modified_at: 2023-02-24
---
# [JAVA] Collection 인터페이스와 구현클래스

# 1. Collection 상속 구조
![image](https://user-images.githubusercontent.com/99089584/221071099-3b0d4735-778a-49ca-8b41-e67c073ffd0c.png)


# 2. Array(배열)와 List
## 1) Array
1. `index`와 값의 쌍으로 구성되어 있음.
2. `index`는 값에 대한 유일무이한 식별자(주민번호같은)      
*리스트에서 `index`는 몇 번째 데이터인가 정도의 의미를 가짐.
3. 논리적 저장 순서와 물리적 저장 순서가 일치 => index로 해당 원소에 접근할 수 있음.
4. 정적이므로 배열의 크기를 컴파일 이전에 정해주어야 하고, 컴파일 이후 배열의 크기를 변동할 수 없음     
(정의와 동시에 길이를 지정하며, 길이를 바꿀 수 없음)
5. 크기가 고정되어 있기 때문에 어떤 엘리먼트가 삭제되면, 삭제된 상태를 빈 공간으로 남겨두어야 함 => 메모리 낭비

## 2) List
1. 리스트에서 인덱스는 몇 번째 데이터인가 정도(순서)의 의미를 가짐.
2. 리스트는 순서가 있는 엘리먼트의 모임으로 배열과는 다르게 빈 엘리먼트는 허용하지 않음.        
=> 리스트는 배열이 가지고 있는 인덱스라는 장점을 버리고 대신 빈틈없는 데이터의 적재 라는 장점을 취함.
3. 동적이므로 크기가 정해져 있지 않음.

## 3) 사용 상황
- Array : 데이터의 크기가 정해져 있고, 추가적인 삽입 삭제가 일어 나지 않으며 검색을 필요로 할 때 유리.
- List : 데이터의 크기가 정해져 있지 않고, 삽입 삭제가 많이 일어나며, 검색이 적은 경우 유리.

# 3. ArrayList
## 1) 특징
- ArrayList는 내부에서 처음 설정한 저장 용량(capacity)가 있음.       
설정한 저장 용량 크기를 넘어서 더 많은 객체가 들어오게 되면, 배열 크기를 1.5배로 증가시킴.
- ArrayList에서 특정 인덱스의 객체를 제거하게 되면, 제거한 객체의 인덱스부터 마지막 인덱스까지 모두 앞으로 1칸씩 앞으로 이동하고, 객체를 추가하게 되면 1칸씩 뒤로 이동하게 됌.      
=> 인덱스 값을 유지하기 위해서 전체 객체가 위치가 이동.     
=> 따라서 잦은 원소의 이동, 삭제가 발생할 경우 ArrayList보다 LinkedList를 사용하는 것이 좋음.
- 사용 예시
```java
// DEFAULT_CAPACITY=10
// 기본 저장용량 10으로 리스트 생성
List<String> list = new ArrayList<>(); 

// 저장 용량을 100으로 설정해 ArrayList 생성 
List<String> list = new ArrayList<>(100);
```

## 2) Array와 ArrayList의 차이
- 배열은 크기가 고정되어있지만 arrayList는 사이즈가 동적인 배열임.
- 배열은 primitive type(int, byte, char 등)과 object 모두를 담을 수 있지만, arrayList는 object element만 담을 수 있음.
- 배열은 element들을 할당하기 위해 assignment(대입) 연산자를 써야하고, arrayList는 add() 메서드를 통해 element를 삽입함.

## 3) ArrayList의 삽입/삭제 과정
![image](https://user-images.githubusercontent.com/99089584/221090305-3f266ce0-39e0-48b7-a5c8-1ef4f321b6f5.png)

# References
- [[자료구조]Array와 List(그리고 Java List)](https://velog.io/@adam2/Array%EC%99%80-List%EA%B7%B8%EB%A6%AC%EA%B3%A0-Java-List)
- [[JAVA] Java 컬렉션(Collection) 정리](https://gangnam-americano.tistory.com/41)