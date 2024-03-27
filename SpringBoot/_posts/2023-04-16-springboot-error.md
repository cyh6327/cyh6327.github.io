---
title:  "[SpringBoot] 오류 정리"
categories: 
    - SpringBoot
date: 2023-04-16
last_modified_at: 2023-04-16
---

## 1. 프로젝트 생성시 build가 되지 않는 오류
```
A problem occurred configuring root project 'practice'.
> Could not resolve all files for configuration ':classpath'.
> Could not resolve org.springframework.boot:spring-boot-gradle-plugin:3.0.1.
```
{: file="error" }

### 원인
스프링부트의 버전이 3.X 일 경우 자바 버전은 17 이상이어야 하는데 11이였음.

### 해결
1. 환경 변수의 시스템 변수 탭에서 JAVA_HOME 변수의 값을 jdk17 설치 경로로 지정해줌.
2. cmd로 java -version 명령어를 쳐서 17버전이 적용된 것 확인
3. 인텔리제이 file -> project structure 에서 sdk를 17로 지정
4. 재시작


## 2. Could not find method compile()
```
Could not find method compile() for arguments [{group=org.mariadb.jdbc, name=mariadb-java-client}] on object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler.
```
{: file="build.gradle" }

### 원인
1. `compile`, `runtime`, `testCompile`, `testRuntime` 은 Gradle 7.0 (2021.4.9) 부터 삭제되었음.
2. 삭제된 네 명령은 각각 `implementation`, `runtimeOnly`, `testImplementation`, `testRuntimeOnly` 으로 대체되었음.

### 해결
`compile group: 'org.mariadb.jdbc', name: 'mariadb-java-client'` <br>
⇒ `implementation group: 'org.mariadb.jdbc', name: 'mariadb-java-client'`

### 참고
[🔗 Gradle Could not find method compile() 해결 방법](https://velog.io/@g0709-19/Gradle-Could-not-find-method-compile-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95)

