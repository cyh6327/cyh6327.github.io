---
title:  "[SpringBoot] #3 Spring Data JPA 실습 설정"
categories: 
    - SpringBoot
date: 2023-03-28
last_modified_at: 2023-03-28
---

# [Spring Boot] #3 Spring Data JPA 실습 설정

## 0. 기타
- 자동 import 기능 설정<br>
File ⇒ Settings ⇒ Auto Import 검색 ⇒ 체크박스 선택
![image](https://user-images.githubusercontent.com/99089584/228097914-6f27a13e-3769-426a-ae07-96f183fa46d6.png)

- sysout 자동완성 => 'sout' 입력 후 ctrl+space

## Spring Data JPA가 개발에 필요한 것
1. JPA를 통해서 관리하게 되는 객체(엔티티객체)를 위한 엔티티 클래스.
2. 엔티티 객체들을 처리하는 기능을 가진 Repository.

## 1. 엔티티 클래스 작성

```java
// * Memo.java
package org.zerock.ex2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "tbl_memo")
@ToString
@Getter
@Setter
@Builder    // 객체 생성할 수 있게 처리
// @Builder를 이용하면서 컴파일 에러 발생하지 않게 처리
@AllArgsConstructor
@NoArgsConstructor
public class Memo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mno;

    @Column(length = 200, nullable = false)
    private String memoText;
}
```

### `@Entity`
- 해당 클래스가 엔티티를 위한 클래스이며, 해당 클래스의 인스턴스들이 JPA로 관리되는 엔티티 객체라는 것을 의미함.
- 옵션에 따라 자동으로 테이블 생성 가능 <br>
=> `@Entity`가 있는 클래스의 멤버 변수에 따라서 자동으로 컬럼들도 생성됨.

### `@Table`
- 데이터베이스상에서 엔티티 클래스를 어떠한 테이블로 생성할 것인지에 대한 정보를 담기 위한 어노테이션.

### `@Id`, `@GeneratedValue`
- `@Id` : Primary Key에 해당하는 특정 필드를 `@Id`로 지정.
- `@GeneratedValue` : 자동으로 생성되는 번호를 사용하기 위해서 사용.
- `strategy = GenerationType.IDENTITY` : 키 생성 전략
  1. AUTO(default) : JPA 구현체(스프링 부트에서는 Hibernate)가 생성 방식을 결정.
  2. IDENTITY : 사용하는 데이터베이스가 키 생성을 결정.

### `@Column`
- 추가적인 필트(컬럼)이 필요한 경우에 활용.
- nullable, name, length 등 다양한 속성 지정 가능.


## 2. Spring Data JPA를 위한 스프링 부트 설정

```properties
# * application.properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true
```

### `spring.jpa.hibernate.ddl-auto`
- 프로젝트 실행 시에 자동으로 DDL(create, alter, drop 등)을 생성할 것인지를 결정하는 설정.
- update로 설정했으므로 변경이 필요한 경우에는 alter로 변경되고, 테이블이 없는 경우에는 create 됨.

### `spring.jpa.properties.hibernate.format_sql`
- Hibernate가 동작하면서 발생하는 SQL을 포맷팅해서 출력.
- 실행되는 SQL의 가독성을 높여줌.

### `spring.jpa.show-sql`
- JPA 처리 시에 발생하는 SQL을 보여줄 것인지를 결정.


## 3. JpaRepository 인터페이스
- Spring Data JPA에는 여러 종류의 인터페이스 기능을 통해 JPA관련 작업을 별도의 코드 없이 처리할 수 있게 지원함.
- ex) CRUD 작업이나 페이징, 정렬 등의 처리도 인터페이스의 메서드를 호출하는 형태로 처리함.
- JpaRepositroy 상속 구조 <br>
![image](https://user-images.githubusercontent.com/99089584/228103623-d61b4d7f-7507-4237-9447-91c74a5a39a9.png)

## 4. JPARepository 사용하기
- JPARepository 인터페이스를 상속하는 MemoRepository 선언. <br>
=> Spring Data JPA는 인터페이스 선언만으로도 자동으로 스프링의 빈으로 등록됨. (스프링이 내부적으로 인터페이스 타입에 맞는 객체들을 생성해서 빈으로 등록)

```java
// * MemoRepository.java
package org.zerock.ex2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.ex2.entity.Memo;

public interface MemoRepository extends JpaRepository<Memo, Long> {
}
```
