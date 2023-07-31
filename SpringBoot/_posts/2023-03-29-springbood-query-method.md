---
title:  "[SpringBoot] #6 쿼리 메서드(Query Methods) 기능과 @Query"
categories: 
    - SpringBoot
tags: [Query, QueryMethod, Pageable, Paging, NativeSQL]
<<<<<<< HEAD
date: 2023-03-29 02:00:00
=======
date: 2023-03-29
>>>>>>> ee0efa97c556676e0d629447e63d6a4f26ea9e01
last_modified_at: 2023-03-29
---

## Spring Data JPA의 검색 조건 처리를 위한 3가지 방법
- 쿼리 메서드 : <br>
메서드의 이름 자체가 쿼리의 구문으로 처리되는 기능.
- `@Query` : <br>
SQL과 유사하게 엔티티 클래스의 정보를 이용해서 쿼리를 작성하는 기능.
- Querydsl 등의 동적 쿼리 처리 기능.

## 1. 쿼리 메서드(Query Methods)
- 메서드의 이름 자체가 query문이 되는 기능.
- `And`, `Or`, `Between` 등이 있음.

### 1) 인터페이스의 추가
```java
public interface MemoRepository extends JpaRepository<Memo, Long> {

    List<Memo> findByMnoBetweenOrderByMnoDesc(Long from, Long to);
}
```
{: file="MemoRepository.java" }

- 메서드의 이름에 `Between`이 포함되어 있으므로 쿼리문에서 `between` 구문을 사용할 것임.
- 메서드의 이름에 `OrderByMnoDesc`가 포함되어 있으므로 쿼리문에서 mno 기준 내림차순으로 `order by` 정렬할 것임.

### 2) 테스트 코드
```java
@Test
public void testQueryMethods() {
    List<Memo> list = memoRepository.findByMnoBetweenOrderByMnoDesc(70L,80L);

    for(Memo memo : list) {
        System.out.println(memo);
    }
}
```

### 3) 실행 결과
![image](https://user-images.githubusercontent.com/99089584/228533757-ef06f83a-e510-48e6-96da-03b5262ce5c1.png)


## 1-1. 쿼리 메서드와 Pageable의 결합
- 쿼리 메서드는 `Pageable` 파라미터를 같이 결합해서 사용할 수 있음.

### 1) 인터페이스의 추가
```java
public interface MemoRepository extends JpaRepository<Memo, Long> {

    Page<Memo> findByMnoBetween(Long from, Long to, Pageable pageable);
}
```
{: file="MemoRepository.java" }

### 2) 테스트 코드
```java
@Test
public void testQueryMethodWithPageable() {
    Pageable pageable = PageRequest.of(0, 10, Sort.by("mno").descending());
    Page<Memo> result = memoRepository.findByMnoBetween(10L, 50L, pageable);
    result.get().forEach(memo -> System.out.println(memo));
}
```

### 3) 실행 결과
![image](https://user-images.githubusercontent.com/99089584/228536760-85fe82e7-db6e-40e6-8f50-46088d747987.png)
_`Sort`를 이용하는 부분이 적용됨._


## 1-2. deleteBy로 시작하는 삭제 처리
- 쿼리 메서드를 이용해 `deleteBy`로 메서드의 이름을 시작하면 특정한 조건에 맞는 데이터를 삭제할 수 있음.

### 1) 인터페이스의 추가
```java
public interface MemoRepository extends JpaRepository<Memo, Long> {
    void deleteMemoByMnoLessThan(Long num);
}
```
{: file="MemoRepository.java" }

### 2) 테스트 코드
```java
@Commit
@Transactional
@Test
public void testDeleteQueryMethods() {
    memoRepository.deleteMemoByMnoLessThan(10L);
}
```
#### `@Transactional`
1. `select`문으로 해당 엔티티 객체들을 가져오는 작업
2. 각 엔티티를 삭제하는 작업 <br>
위 두개의 작업이 같이 이루어지기 때문에 사용.

#### `@Commit`
  - 최종 결과를 커밋하기 위해 사용.
  - 이를 적용하지 않으면 테스트 코드의 `deleteBy...`는 기본적으로 롤백 처리되어서 결과가 반영되지 않음.

### 3) 실행 결과
- SQL을 이용하듯이 한 번에 삭제가 이루어지지는 않고, 각 엔티티 객체를 하나씩 삭제함. <br>
⇒ `@Query`를 이용해 개선.


## 2. `@Query` 어노테이션
- 쿼리 메서드는 검색 기능을 작성할 때는 편리하지만, 조인이나 복잡한 조건을 처리해야 하는 경우는 불편할 때가 많음. <br>
⇒ 간단한 처리만 쿼리메서드를 이용하고, 나머지는 `@query`를 이용.
- `@Query`의 value는 JPQL(Java Persistence Query Language, 객체지향 쿼리)로 작성.
- 객체지향 쿼리:
    - 테이블 대신 엔티티 클래스를 이용.
    - 테이블의 칼럼 대신 클래스에 선언된 필드를 이용.
    - SQL과 상당히 유사.


## 2-1. @Query의 파라미터 바인딩 방식
### 1) :파라미터 이름
```java
@Transactional
@Modifying
@Query("update Memo m set m.memoText = :memoText where m.mno = :mno")
int updateMemoText(@Param("mno") Long mno, @Param("memoText") String memoText);
```
### 2) :#{객체}
```java
@Transactional
@Modifying
@Query("update Memo m set m.memoText = :#{#param.memoText} where m.mno = :#{#param.mno}")
int updateMemoText(@Param("param") Memo memo);
```


## 2-2. @Query와 페이징 처리
- 쿼리 메서드와 마찬가지로 `Pageable` 타입의 파라미터를 적용하면 페이징 처리와 정렬에 대한 부분을 작성하지 않아도 됨.
- 쿼리 메서드 예제와 같이 리턴 타입을 `Page<엔티티 타입>`으로 지정하는 경우에는 `count`를 처리하는 쿼리를 적용할 수 있음. <br>
⇒ `countQuery` 속성 적용시켜 주기.
```java
@Query(value = "select m from Memo m where m.mno > :mno",
        countQuery = "select count(m) from Memo m where m.mno > :mno")
Page<Memo> getListWithQuery(Long mno, Pageable pageable);
```


### 2-3. Object[] 리턴
- 쿼리 메서드의 경우에는 엔티티 타입의 데이터만을 추출하지만, `@Query`를 이용하는 경우에는 현재 필요한 데이터만을 `Object[]`의 형태로 선별적으로 추출할 수 있다는 장점이 있음.
- ex) `JOIN`이나 `GROUP BY`를 이용할 때, 적당한 엔티티 타입이 존재하지 않는 경우가 많은데, 이 때 Object[] 타입을 리턴 타입으로 지정.
```java
@Query(value = "select m.mno, m.memoText, CURRENT_DATE from Memo m where m.mno > :mno",
        countQuery = "select count(m) from Memo m where m.mno > :mno")
Page<Object[]> getListWithQueryObject(Long mno, Pageable pageable);
```


### 2-4. Native SQL 처리
- `@Query`의 강력한 기능은 데이터베이스 고유의 SQL 구문을 그대로 활용하는 것.
- `@Query`의 `nativeQuery`속성값을 true로 지정하면 일반 SQL을 그대로 사용할 수 있음.
```java
@Query(value = "select * from memo where mno > 0", nativeQuery = true)
List<Object[]> getNativeResult();
```