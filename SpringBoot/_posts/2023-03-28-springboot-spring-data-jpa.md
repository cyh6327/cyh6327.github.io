---
title:  "[SpringBoot] #2 Maria 데이터베이스와 Spring Data JPA"
categories: 
    - SpringBoot
tags: [MariaDB, ORM, JPA, Hibernate, SpringDataJAP]
<<<<<<< HEAD
date: 2023-03-28 01:00:00
=======
date: 2023-03-28
>>>>>>> ee0efa97c556676e0d629447e63d6a4f26ea9e01
last_modified_at: 2023-03-28
---

## 1. Maria 데이터베이스 설정
#### Maria DB :
오픈 소스로 사용 가능, MySQL과 거의 동일한 기능 제공, 클라우드 환경에서도 오라클 데이터베이스에 비해 적은 비용으로 사용 가능하다는 장점
1. 'mariadb.org' 에서 다운
2. HeidiSQL 실행 ⇒ 암호 입력후 '열기' ⇒ 우클릭-새로생성-데이터베이스 생성(bootex) ⇒ 사람 아이콘-사용자 계정 추가-사용자 이름,암호 설정-접근 허용 객체 추가(방금 만든 데이터베이스 선택)

## 2. Spring Data JPA를 이용하는 프로젝트 생성
- 프로젝트 생성시 db 사용하기 위해 'Spring Data JPA' 의존성 추가
![image](https://user-images.githubusercontent.com/99089584/227992216-4e17426c-e5e7-41a8-997d-19308b1f7e74.png)

#### main() 실행 시 에러 발생

```
Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.

Reason: Failed to determine a suitable driver class
```
{: file="error" }

⇒ Spring Data JPA 라이브러리가 추가되면서 자동으로 이에 관련된 설정은 추가되었으나(스프링 부트의 특성) 구체적인 값이 지정되지 않아서 발생한 문제. <br>
⇒ 'mvnrepository.com' 에서 MariaDB 드라이버의 gradle 설정 복사 ⇒ `build.gradle`에 추가 ⇒ 아이콘 클릭해서 라이브러리 반영.

```gradle
dependencies {
    // https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client
    implementation group: 'org.mariadb.jdbc', name: 'mariadb-java-client', version: '3.1.0'
}
```
{: file="build.gradle" }
    


## 3. 데이터베이스 설정을 위한 `application.properties` 파일
- resources 하위 폴더에 있음.
- 스프링 부트는 설정 파일로 properties 파일이나 yml 파일을 만들어서 세팅함.

```properties
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/bootex
spring.datasource.username=bootuser
spring.datasource.password=bootuser
```
{: file="application.properties" }

- `External Libraries` : 라이브러리 저장 폴더


## 4. Spring Data JPA란?
### 1) ORM(Object Relational Mapping)
- 객체지향 패러다임을 관계형 패러다임으로 매핑해주는 개념.
- '객체지향'의 구조가 '관계형 데이터베이스'와 유사하다는 점에서 시작.
- 객체지향 ↔ 관계형 데이터베이스
  - 클래스(데이터 구조를 잡음) ↔ 테이블(데이터를 보관하는 틀을 만듦)
  - 인스턴스라는 '공간'에 데이터 보관 ↔ 하나의 'Row'에 데이터를 저장
  - 객체(데이터 + 행위(메서드)) ↔ 개체(=entity, 데이터만을 의미)
  - 참조(어떤 객체가 다른 객체들과 어떤 관계를 맺고 있는지) ↔ 관계(테이블 사이의 관계를 통해 구조적인 데이터를 표현)
- 즉, ORM은 '객체지향'과 '관계형' 사이의 변환 기법을 의미하는 것.
- 특정 언어에 국한되는 개념이 아님.

### 2) JPA(Java Persistence API)
- Java 언어를 통해서 데이터베이스와 같은 영속 계층을 처리하고자 하는 스펙.
- ORM을 Java 언어에 맞게 사용하는 '스펙' ⇒ JPA는 Java라는 언어에 국한된 개념.
- JPA는 단순한 스펙이므로 해당 스펙을 구현하는 구현체마다 회사의 이름이나 프레임워크의 이름이 다름. ⇒ 가장 유명한 것은 'Hibernate'

### 3) Hibernate
- 스프링 부트는 JPA의 구현체 중에서 'Hibernate'라는 구현체를 이용함.
- Hibernate는 오픈소스로 ORM을 지원하는 프레임워크.
- 단독으로 프로젝트에 적용이 가능한 독립된 프레임워크.

### 4) Spring Data JAP
- Hibernate를 스프링 부트에서 쉽게 사용할 수 있는 추가적인 API를 제공함.

### 5) 구조
![image](https://user-images.githubusercontent.com/99089584/228011992-5bb88046-af18-4664-9b8b-72da83394898.png)


