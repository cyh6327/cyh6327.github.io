---
title:  "[SpringBoot] #4 CRUD 구현"
categories: 
    - SpringBoot
tags: [JpaRepository]
date: 2023-03-28
last_modified_at: 2023-03-28
---

# [Spring Boot] #4 CRUD 구현

## 1. 테스트 코드를 통한 CRUD 연습
> #### ＊ JpaRepository의 CRUD 메서드
> - `insert`: save(엔티티 객체)
> - `select`: findById(키 타입), getOne(키 타입)
> - `update`: save(엔티티 객체)
> - `delete`: deleteById(키 타입), delete(엔티티 객체)

- MemoRepository 인터페이스 타입의 실제 객체가 어떤 것인지 확인하는 테스트 코드 작성.

```java
package org.zerock.ex2.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MemoRepositoryTests {
    @Autowired
    MemoRepository memoRepository;

    @Test
    public void testClass() {

        System.out.println(memoRepository.getClass().getName());
        // 출력값: jdk.proxy3.$Proxy111

    }
}
```
{: file="MemoRepositoryTests.java" }

- 스프링이 내부적으로 해당 클래스를 자동으로 생성하는데(AOP 기능) 이 때의 클래스 이름이 작성한 적이 없는 클래스의 이름으로 출력되는 것을 확인(동적 프록시라는 방식으로 만들어짐)

## 2. 등록 작업 테스트
- 100개의 새로운 Memo 객체를 생성하고 MemoRepository를 이용해서 이를 insert하는 테스트 코드 작성.

    ```java
    @Test
    public void testInsertDummies() {

        IntStream.rangeClosed(1,100).forEach(i -> {
            Memo memo = Memo.builder().memoText("Sample..."+i).build();
            memoRepository.save(memo);
        });

    }
    ```
    {: file="MemoRepositoryTests.java" }

## 3. 조회 작업 테스트
### 3-1. findById()
#### 코드

```java
@Test
public void testSelect() {

    Long mno = 100L;

    Optional<Memo> result = memoRepository.findById(mno);

    System.out.println("======================================");

    if(result.isPresent()) {
        Memo memo = result.get();
        System.out.println(memo);
    }
}
```
{: file="MemoRepositoryTests.java" }

#### 실행 결과

![image](https://user-images.githubusercontent.com/99089584/228109229-58d57e22-2be2-46b9-81ff-477b8fadde7b.png)
_`findById()`를 실행한 순간에 이미 SQL처리가 되었고, '====' 부분은 SQL 처리 이후에 실행됨._

### 3-2. getOne()
#### 코드

```java
@Transactional
@Test
public void testSelect2() {

    Long mno = 100L;

    Memo memo = memoRepository.getOne(mno);

    System.out.println("======================================");

    System.out.println(memo);

}
```
{: file="MemoRepositoryTests.java" }

#### 실행 결과

![image](https://user-images.githubusercontent.com/99089584/228109682-cc0d64b0-2f18-441f-a8eb-f5ef14cf0082.png)

- 실제 객체가 필요한 순간까지 SQL을 실행하지 않음.
- `getOne()` 호출 후 '===' 부분이 먼저 실행되고 `System.out.println(memo)`이 실행되면서 실제 객체를 사용하는 순간에 SQL이 동작함.


## 4. 수정 작업 테스트
#### 코드
```java
@Test
public void testUpdate() {

    Memo memo = Memo.builder().mno(100L).memoText("Update Text").build();

    System.out.println(memoRepository.save(memo));
}
```
{: file="MemoRepositoryTests.java" }

#### 실행 결과

![image](https://user-images.githubusercontent.com/99089584/228113008-5be9cc6d-fd53-49a6-9ac6-b14ba25956f4.png)
  - select 쿼리로 해당 번호의 Memo 객체를 확인하고, 이를 update함.
  - JPA는 엔티티 객체들을 메모리상에 보관하려고 하기 때문에 특정한 엔티티 객체가 존재하는지 확인하는 select가 먼저 실행되고 해당 @Id를 가진 엔티티 객체가 있다면 update, 그렇지 않다면 insert를 실행하게 됨.



## 5. 삭제 작업 테스트
#### 코드

```java
@Test
public void testDelete() {

    Long mno = 100L;
    memoRepository.deleteById(mno);
}
```
{: file="MemoRepositoryTests.java" }

#### 실행 결과

![image](https://user-images.githubusercontent.com/99089584/228113668-a9ab133a-6e79-4c83-83f9-29940b55dd31.png)

- 삭제하려는 번호(mno)의 엔티티 객체가 있는지 먼저 확인 후, 이를 삭제.


