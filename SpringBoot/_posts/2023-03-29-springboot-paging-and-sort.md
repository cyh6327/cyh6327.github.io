---
title:  "[SpringBoot] #5 페이징과 정렬 처리"
categories: 
    - SpringBoot
tags: [Paging, Pageable, Sort]
date: 2023-03-29
last_modified_at: 2023-03-29
---

## 1. 페이징/정렬 처리하기
- JPA가 실제 데이터베이스에서 사용하는 SQL의 처리를 자동으로 하기 때문에 개발자들은 SQL이 아닌 'API의 객체와 메서드를 사용하는 형태'로 페이징 처리를 할 수 있게 됨.
- Spring Data JPA에서 페이징 처리와 정렬은 `findAll()` 메서드를 사용함.
    > #### ＊ `findAll()` :
    > `PagingAndSortRepository` 인터페이스의 메서드.
- [Interface PagingAndSortingRepository<T,ID>](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html) <br>
![image](https://user-images.githubusercontent.com/99089584/228426109-e32c1fa0-fbbb-4337-8b11-848bd7fcee3e.png)



## 2. Pageable 인터페이스
### 1) `Pageable` 인터페이스
- 페이지 처리에 필요한 정보를 전달하는 용도의 타입으로, 인터페이스이기 때문에 실제 객체를 사용할 때는 구현체인 `PageRequest`라는 클래스를 사용.

### 2) `PageRequest` 클래스
- `PageRequest` 클래스의 생성자는 `protected`로 선언되어 `new`를 이용할 수 없음. <br>
⇒ 객체를 생성하기 위해 static한 `of()`를 사용.

![image](https://user-images.githubusercontent.com/99089584/228426864-4ade5aa7-5fd5-4cf1-9498-a2fda925a426.png)

![image](https://user-images.githubusercontent.com/99089584/228433855-ea4bb018-969a-4075-86e4-995952939dfb.png)
_[🔗 [Link] Class PageRequest Reference](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/PageRequest.html)_

> #### ＊ `of()`의 형태
> - `of(int page, int size)` : 0부터 시작하는 페이지 번호와 개수(size)
> - `of(int page, int size, Sort sort)` : 페이지 번호와 개수, 정렬 관련 정보


## 3. 페이징 처리
- Spring Data JPA를 이용할 때 페이지 처리는 반드시 0부터 시작.

### 1) 페이징 쿼리

```java
@Test
public void testPageDefault() {

    //1페이지 10개
    Pageable pageable = PageRequest.of(0,10);
    Page<Memo> result = memoRepository.findAll(pageable);

    System.out.println(result);

}
```

![image](https://user-images.githubusercontent.com/99089584/228431007-e801cf11-5a07-445b-b40e-84f2e46e831a.png) <br>
- 첫 번째 쿼리 : 페이징 처리에 사용되는 `limit`구문 사용됨.
- 두 번째 쿼리 : `count()`를 이용해 전체 개수를 처리. <br>
⇒ `findAll()`에 `Pageable`타입의 파라미터를 전달하면 페이징 처리에 관련된 쿼리들을 실행하고, 이 결과들을 이용해 리턴 타입으로 지정된 `Page<엔티티 타입>` 객체로 저장함.

### 2) Page<엔티티 타입>의 메서드

```java
System.out.println(result);
System.out.println("----------------------------------");
System.out.println("Total Pages: " + result.getTotalPages());   //총 몇 페이지
System.out.println("Total Count: " + result.getTotalElements());    //전체 개수
System.out.println("Page Number : " + result.getNumber());      //현재 페이지 번호. 0부터 시작.
System.out.println("Page Size : " + result.getSize());          //페이지당 데이터 개수
System.out.println("has next page? : " + result.hasNext());     //다음 페이지 존재 여부
System.out.println("first page? : " + result.isFirst());        //시작 페이지(0) 존재 여부
```

![image](https://user-images.githubusercontent.com/99089584/228431778-3425c6bf-9db6-4ea6-a380-2867b61d93b0.png)

### 3) 실제 페이지의 데이터 처리

```java
for(Memo memo : result.getContent()) {
    System.out.println(memo);
}
```

![image](https://user-images.githubusercontent.com/99089584/228431959-3b4caa68-fab2-4310-9d71-b6db15f9f229.png)


## 4. 정렬 조건 추가
- `Sort`클래스도 `protected`로 선언되어 있으므로, 객체 생성하기 위해 접근제한자가 `static`인 `by()`를 이용. <br>
![image](https://user-images.githubusercontent.com/99089584/228433962-e79f72fc-179e-4d72-a4bd-351a8ccea65c.png)

### 1) 테스트 1

 ```java
@Test
public void testSort() {
    Sort sort1 = Sort.by("mno").descending();

    Pageable pageable = PageRequest.of(0, 10, sort1);

    Page<Memo> result = memoRepository.findAll(pageable);

    result.get().forEach(memo -> {
        System.out.println(memo);
    });
}
```

#### 쿼리
![image](https://user-images.githubusercontent.com/99089584/228434541-8b44285d-be92-4352-a6d1-a9d7af3bd7ff.png)
  - 페이징 처리만 했을 때의 쿼리와 비교했을 때 `order by`구문이 추가된 것을 알 수 있음.

#### 실행 결과(역순 정렬)
![image](https://user-images.githubusercontent.com/99089584/228435372-ee15ccb7-9bef-4762-8a2e-514b7049ee7e.png)


### 2) 테스트 2
- 정렬 조건은 `Sort`객체의 `and()`를 이용해 여러 개의 정렬 조건을 다르게 지정할 수 있음.

    ```java
    @Test
    public void testSort() {
        Sort sort1 = Sort.by("mno").descending();
        Sort sort2 = Sort.by("memoText").ascending();
        Sort sortAll = sort1.and(sort2);    //and를 이용한 연결

        Pageable pageable = PageRequest.of(0, 10, sortAll);
    }
    ```

    ![image](https://user-images.githubusercontent.com/99089584/228436581-67ef110c-fb78-474b-b7c0-8692d4ddc23d.png)

