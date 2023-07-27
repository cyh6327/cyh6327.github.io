---
title:  "[SpringBoot] #1 프로젝트를 위한 준비"
categories: 
    - SpringBoot
date: 2023-03-27
last_modified_at: 2023-03-27
---

# [Spring Boot] #1 프로젝트를 위한 준비

## 0. 스프링 레퍼런스 문서
- [Spring Boot API](https://docs.spring.io/spring-boot/docs/current/api/)
- [Spring Data API](https://docs.spring.io/spring-data/commons/docs/current/api/)

## 1. 스프링 프로젝트 생성
- 스프링 프로젝트 생성해주는 사이트
[https://start.spring.io/](https://start.spring.io/)
![image](https://user-images.githubusercontent.com/99089584/227980531-f175f8da-d6f6-469a-bde5-9ccca4e46dda.png)
- 1에서 generate한 후 다운 받은 zip 폴더를 압축 풀음 ⇒ 해당 폴더의 build.gradle을 인텔리제이에서 열기(open as project)

## 2. 테스트 환경에서 Lombok 활용

```gradle
// * build.gradle
dependencies {
    // 테스트 환경에서 lombok 사용 가능하게 함
	testCompileOnly 'org.projectlombok:lombok:1.18.24'
	testAnnotationProcessor 'org.projectlombok:lombok:1.18.24'
}
```

## 3. 간단한 컨트롤러 실습
- 스프링 부트 프로젝트는 'Spring Web' 의존성 항목을 추가하는 경우에 라이브러리 추가 없이 자동으로 JSON 타입의 데이터를 사용할 수 있음.
  
    ```java
    // * SampleController.java
    package org.zerock.ex1.controller;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class SampleController {
        @GetMapping("/hello")
        public String[] hello() {
            return new String[] {"Hello", "World"};
        }
    }
    ```

- 컨트롤러 생성 후 `Ex1Application` 클래스의 main() 실행 ⇒ 브라우저로 'http://localhost:8080/hello' 호출. <br>
![image](https://user-images.githubusercontent.com/99089584/228006130-a4b3a204-d5c2-4c23-94dd-f4ea2ec80093.png)
