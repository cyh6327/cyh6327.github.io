---
title:  "[SpringBoot] #9 Querydsl 설정 및 테스트코드"
categories: 
    - SpringBoot
date: 2023-04-16
last_modified_at: 2023-05-16
---

# [Spring Boot] #9 Querydsl 설정 및 테스트코드

## 1. 프로젝트의 와이어프레임
- 프로젝트를 구성할 때는 가장 먼저 와이어프레임(화면 설계서)를 제작하고 진행하는 것이 좋음.
### 장점
1. 화면의 URI와 전달하는 파라미터 등을 미리 결정할 수 있음.
2. 데이터베이스 설계에 필요한 컬럼들을 미리 파악하는데 도움이 됨.

## 2. 프로젝트 생성
### 1) `build.gradle` 설정
1) MariaDB 관련 JDBC 드라이버 추가
2) JPA관련 설정 추가
```gradle
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	annotationProcessor 'org.projectlombok:lombok'
	providedRuntime 'org.springframework.boot:spring-boot-starter-tomcat'
	testImplementation ('org.springframework.boot:spring-boot-starter-test'){
		exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
	}
	implementation group: 'org.mariadb.jdbc', name: 'mariadb-java-client'
}
```

### 2) application.properties 설정
데이터베이스 관련 설정 추가(프로젝트 ex2에서의 설정과 동일)
```properties
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/bootex
spring.datasource.username=bootuser
spring.datasource.password=bootuser

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true

spring.thymeleaf.cache=false
```

### 3) 컨트롤러/화면 관련 준비
1. 프로젝트 ex3의 layout폴더를 templates 폴더로 복사
2. 프로젝트 ex3의 static 하위 파일 복붙
3. templates 폴더에 guestbook 폴더 추가
4. GuestbookController.java 생성

    ```java
    package com.example.guestbook.controller;

    import lombok.extern.log4j.Log4j2;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;

    @Controller
    @RequestMapping("/guestbook")
    @Log4j2
    public class GuestbookController {
        
        @GetMapping({"/","/list"})
        public String list() {
            log.info("list..............");
            return "/guestbook/list";
        }
        
    }
    ```
5. templates\guestbook 에 list.html 생성

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.thymeleaf.org">

    <th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">

        <th:block th:fragment="content">
            <h1>GuestBook List Page</h1>
        </th:block>

    </th:block>
    ```


## 3. 자동으로 처리되는 날짜/시간 설정
### 1) BaseEntity.java 생성

#### BaseEntity를 만들어 나누는 이유 :

- 코드 재사용과 공통 필드를 관리하기 위함. <br>
`BaseEntity`는 여러 개의 엔티티에서 공통으로 사용되는 필드와 로직을 정의하는 추상 클래스임. <br>
아래의 `BaseEntity`에는 생성 시간(regdate)과 최종 수정 시간(modDate)을 나타내는 두 개의 필드가 있는데, 이러한 공통 필드는 다양한 엔티티에서 사용될 수 있으며, 각 엔티티마다 필드를 중복해서 정의하지 않고, `BaseEntity`에서 정의함으로써 코드의 중복을 피할 수 있음.

```java
package com.example.guestbook.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(value = {AuditingEntityListener.class})
@Getter
abstract class BaseEntity {

    @CreatedDate    //JPA에서 엔티티의 생성 시간을 처리
    //updatable = false를 해줌으로써 객체를 데이터베이스에 반영할 때 regdate 컬럼값은 변경되지 않음
    @Column(name = "regdate", updatable = false)
    private LocalDateTime regdate;

    @LastModifiedDate   //최종 수정 시간을 처리
    @Column(name = "moddate")
    private LocalDateTime modDate;
}
```
`@MappedSuperclass` : <br>
- 이 어노테이션이 적용된 클래스는 테이블로 생성되지 않음.
- 실제 테이블은 `BaseEntity` 클래스를 상속한 엔티티의 클래스로 데이터베이스 테이블이 생성됨.
  

`@EntityListeners(value = {AuditingEntityListener.class})` : <br>
- JPA는 JPA만의 고유한 메모리 공간(=context)을 이용해서 엔티티 객체들을 관리함.
- JPA에서 사용하는 엔티티 객체들은 영속 콘텍스트라는 곳에서 관리되는 객체. <br>
=> 이 객체들이 변경되면 결과적으로 데이터베이스에 이를 반영하는 방식.
- JPA 방식에서는 엔티티 객체가 유지되고 필요할 때 꺼내서 재사용하는 방식이므로, 이러한 엔티티 객체에는 어떤 변화가 일어나는 것을 감지하는 리스너(listenr)가 있음.
- JPA 내부에서 엔티티 객체가 생성/변경되는 것을 감지하는 역할은 `AuditingEntityListener`로 이루어지고, 이를 통해 regDate, modDate에 적절한 값이 지정됨.

### 2) GuestbookApplication.java 설정 추가
```java
package com.example.guestbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing	//AuditingEntityListener 를 활성화시키기 위함
public class GuestbookApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuestbookApplication.class, args);
	}

}
```


## 4. 엔티티 클래스 설정
### 1) Guestbook.java

```java
package com.example.guestbook.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Guestbook extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gno;
    
    @Column(length = 100, nullable = false)
    private String title;
    
    @Column(length = 1500, nullable = false)
    private String content;
    
    @Column(length = 50, nullable = false)
    private String writer;
    
}
```
![image](https://user-images.githubusercontent.com/99089584/232305931-aeb187be-3fe0-4c30-aca6-186c71c575de.png)

### 2) JpaRepository를 상속받는 GuestbookRepository 인터페이스 생성
```java
package com.example.guestbook.repository;

import com.example.guestbook.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestbookRepository extends JpaRepository<Guestbook, Long> {
}
```

## 5. Querydsl 설정
- JPA의 쿼리 메서드의 기능과 `@Query`는 선언할 때 고정된 형태의 값을 가진다는 단점이 있음.
- 복잡한 조합을 사용하는 경우의 수가 많은 상황에서는 동적으로 쿼리를 생성해서 처리할 수 있는 기능이 필요.
- Querydsl : 복잡한 검색조건이나 조인, 서브 쿼리 등의 기능 구현 가능
- [www.querydsl.com](www.querydsl.com)
- Querydsl는 작성된 엔티티 클래스를 그대로 이용하는 것이 아니라 'Q도메인' 이라는 것을 이용해야 함.

### 1) build.gradle 파일에 querydsl 관련 설정 추가
```gradle
buildscript {
	ext {
		queryDslVersion = "5.0.0"
	}
}

plugins {
	id 'base'
	id 'java'
	id 'war'
	id 'org.springframework.boot' version '3.0.5'
	id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'

	implementation "com.querydsl:querydsl-jpa:${queryDslVersion}:jakarta"

	annotationProcessor(

			"jakarta.persistence:jakarta.persistence-api",

			"jakarta.annotation:jakarta.annotation-api",

			"com.querydsl:querydsl-apt:${queryDslVersion}:jakarta")

	testCompileOnly 'org.projectlombok:lombok'
	testAnnotationProcessor 'org.projectlombok:lombok'

}

tasks.named('test') {
	useJUnitPlatform()
}




sourceSets {
	main {
		java {
			srcDirs = ["$projectDir/src/main/java", "$projectDir/build/generated"]
		}
	}
}

compileJava.dependsOn('clean')
```

gradle - clean 및 compileJava 해주면 build 폴더 안에 아래와 같은 구조 및 클래스가 생성됨.
![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/859493e3-9eff-42ae-8bc5-3ad5bec2d04b)


![image](https://user-images.githubusercontent.com/99089584/232309201-2e1a4457-a674-4c6a-9d38-d948e7437d0f.png)


### 2) GuestbookRepository 인터페이스에서 QuerydslPredicateExecutor를 상속받게 설정
```java
package com.example.guestbook.repository;

import com.example.guestbook.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface GuestbookRepository extends JpaRepository<Guestbook, Long>,
        QuerydslPredicateExecutor<Guestbook> {
}
```


## 6. 엔티티의 테스트
### 1) 더미데이터 넣기
GuestbookRepositoryTests 생성 후 300개의 테스트 데이터 insert
```java
package com.example.guestbook.repository;

import com.example.guestbook.entity.Guestbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

@SpringBootTest
public class GuestbookRepositoryTests {

    @Autowired
    private GuestbookRepository guestbookRepository;

    @Test
    public void insertDummies() {
        IntStream.rangeClosed(1,300).forEach(i -> {
            Guestbook guestbook = Guestbook.builder()
                    .title("Title..." + i)
                    .content("Content..." + i)
                    .writer("user" + (i % 10))
                    .build();
            System.out.println(guestbookRepository.save(guestbook));
        });
    }
}
```
실행 후 생성된 데이터 확인

![image](https://user-images.githubusercontent.com/99089584/232309880-829b7a1b-43c3-4e5e-ac9f-7ca7ef5b95eb.png) <br>

생성시 `moddate`와 `regdate`값을 넣어주지 않았음에도 자동으로 채워졌음. <br>
=> `BaseEntity`의 `@CreatedDate`와 `@LastModifiedDate` 어노테이션은 JPA에서 엔티티가 생성/수정될 때의 시간을 자동으로 설정해주는 역할을 함. <br>
즉, 새로운 `Guestbook` 객체가 생성되면 해당 객체의 `regdate`와 `modDate` 필드는 현재 시간으로 자동으로 설정됨.

### 2) 수정 시간 테스트
- 엔티티 클래스는 가능하면 setter 관련 기능을 만들지 않는 것이 권장되지만, 필요에 따라서는 수정 기능을 만들기도 함.<br>
단, 엔티티 객체가 애플리케이션 내부에서 변경되면 JPA를 관리하는 쪽이 복잡해질 우려가 있기 때문에 가능하면 최소한의 수정이 가능하도록 하는 것을 권장.

- `title`과 `content`를 수정할 수 있도록 `Guestbook` 클래스 수정

    ```java
    package com.example.guestbook.entity;

    import jakarta.persistence.*;
    import lombok.*;

    @Entity
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public class Guestbook extends BaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long gno;

        @Column(length = 100, nullable = false)
        private String title;

        @Column(length = 1500, nullable = false)
        private String content;

        @Column(length = 50, nullable = false)
        private String writer;

        // setter 추가. 단축키는 alt + insert
        public void setTitle(String title) {
            this.title = title;
        }

        public void setContent(String content) {
            this.content = content;
        }
        
    }
    ```

- 수정 테스트 코드 작성

    ```java
    @Test
    public void updateTest() {
        //존재하는 번호로 테스트
        Optional<Guestbook> result = guestbookRepository.findById(300L);

        if(result.isPresent()) {
            Guestbook guestbook = result.get();

            guestbook.setTitle("Change Title....");
            guestbook.setContent("Change Content....");

            guestbookRepository.save(guestbook);
        }
    }
    ```

- `Optional<>` <br>
자바 8에서 도입된 클래스로, 값이 존재할 수도 있고 없을 수도 있는 객체를 감싸는 래퍼(Wrapper) 클래스. <br>
사용하는 이유는 null 값으로 인해 발생하는 NullPointerException을 방지하고, 코드의 가독성을 높이기 위해서.

- 데이터 수정결과 확인
![image](https://user-images.githubusercontent.com/99089584/232311925-519a4d37-4dae-4548-ac9a-e3c79774917f.png) <br>
=> `content`와 `title`의 값이 수정됐고, moddate 컬럼의 값도 변경됨.


### 3) 단일 항목 검색 테스트
- 단일 항목 검색 테스트 코드 작성

    ```java
    @Test
    public void testQuery1() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("gno").descending());

        // Q도메인 클래스를 이용하면 엔티티 클래스에 선언된 title, content같은 필드들을 변수로 활용할 수 있음.
        QGuestbook qGuestbook = QGuestbook.guestbook;

        String keyword = "1";

        // where문에 들어가는 조건들(and, or, not, ...)을 넣어주는 컨테이너
        BooleanBuilder builder = new BooleanBuilder();

        // 조건 생성
        BooleanExpression expression = qGuestbook.title.contains(keyword);

        // 조건 결합
        builder.and(expression);

        // 페이지 처리와 동시에 검색 처리가 가능해짐.
        Page<Guestbook> result = guestbookRepository.findAll(builder, pageable);

        result.stream().forEach(guestbook -> {
            System.out.println(guestbook);
        });
    }
    ```


### 4) 다중 항목 검색 테스트
- title 혹은 content에 특정한 키워드가 있고 gno > 0 인 조건 처리

    ```java
        @Test
        public void testQuery2() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("gno").descending());

        QGuestbook qGuestbook = QGuestbook.guestbook;

        String keyword = "1";

        BooleanBuilder builder = new BooleanBuilder();

        BooleanExpression exTitle = qGuestbook.title.contains(keyword);
        BooleanExpression exContent = qGuestbook.content.contains(keyword);
        BooleanExpression exAll = exTitle.or(exContent);

        builder.and(exAll);
        builder.and(qGuestbook.gno.gt(0L));

        Page<Guestbook> result = guestbookRepository.findAll(builder, pageable);

        result.stream().forEach(guestbook -> {
            System.out.println(guestbook);
        });
    }
    ```





