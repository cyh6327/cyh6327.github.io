---
layout: post
title:  "[Spring Security] #1 스프링 시큐리티 기본 개념과 동작 원리"
categories: [Spring]
tags: [WAS, SpringWebSecurity, Authorizatoin, Authentication, SecurityContext]
date: 2023-03-04
last_modified_at: 2023-03-04
---

## 용어
### 1. WAS(Web Application Server) :     
- DB 조회나 다양한 로직 처리를 요구하는 동적인 컨텐츠를 제공하기 위해 만들어진 `Application Server`  
- 웹 컨테이너(`Web Container`) 혹은 서블릿 컨테이너(`Servlet Container`)라고도 불림.       
  `Container`란 `JSP`, `Servlet`을 실행시킬 수 있는 소프트웨어를 말함.  
  즉, `WAS`는 `JSP`, `Servlet` 구동 환경을 제공함.

### 2. JSESSIONID
세션을 유지하는데 사용되는 쿠키(`Tomcat`에서 발행. `WAS`마다 다른 이름을 사용함.)


## 1. Spring Web Security란
### 1) 정의
- Spring 기반의 애플리케이션의 보안(인증과 권한, 인가 등)을 담당하는 스프링 하위 프레임워크.
- '인증'과 '권한'에 대한 부분을 `Filter` 흐름에 따라 처리하고 있음.

### 2) 인증이 되지 않은 상황에서의 요청
- 스프링 시큐리티를 이용하게 되면 모든 요청은 `Session`을 발급 받음(스프링 시큐리티는 세션과 쿠키를 이용한 기술임)		
- `Session`을 발급받으면 클라이언트의 쿠키에 `JSESSIONID`라는 키로 `SessionID`가 저장됨.		
- `AuthenticationFilter`는 해당 요청의 `JSESSIONID`를 확인하여 매핑되는 인증 정보가 `SecurityContext`에 있는지 판단 후 없다면 Login 페이지로 이동시킴.



## 2. 인증(Authorizatoin)과 인가(Authentication)
### 1) 인증(Authentication): 해당 사용자가 본인이 맞는지를 확인하는 절차
- `AuthenticationManager` : 스프링 시큐리티에서 인증을 담당
- `ProviderManager` : 인증에 대한 처리를 `AuthenticationProvider`라는 타입의 객체를 이용해서 처리를 위임함
- `AuthenticationProvider` : 실제 인증 작업 진행.
- `UserDetailService` : 사용자의 정보와 사용자가 가진 권한의 정보를 처리해서 반환
![KakaoTalk_20230219_005722608](https://user-images.githubusercontent.com/99089584/219875639-0468db6f-0a16-4e72-93d1-09c6a7311b3d.jpg)

### 2) 인가(Authorization): 인증된 사용자가 요청한 자원에 접근 가능한지를 결정하는 절차 

### 3) 과정
![image](https://user-images.githubusercontent.com/99089584/219874815-976059a6-5da2-4a84-9039-6d4212247ce9.png)
- Spring Security는 기본적으로 인증 절차를 거친 후에 인가 절차를 진행하게 되며, 인가 과정에서 해당 리소스에 대한 접근 권한이 있는지 확인을 하게 됨.
- Spring Security에서는 이러한 인증과 인가를 위해 `Principal`(=접근 주체: 보호받는 `Resource`에 접근하는 대상)을 아이디로, `Credential`(=비밀번호:  `Resource`에 접근하는 대상의 비밀번호)을 비밀번호로 사용하는 `Credential` 기반의 인증 방식을 사용함.



## 2-1. Authentication 객체
### 1. 정의
- 사용자의 인증 정보를 저장하는 토큰 개념으로 사용.
- 인증 시) id와 password를 담고 인증 검증을 위해 전달되어 사용됨.
- 인증 후) 최종 인증 결과(user 객체, 권한 정보)를 담고 `SecurityContext`에 저장되어 전역적으로 참조가 가능함.

### 2. Authentication 객체 내부 구조
  - `principal`: 사용자 아이디 혹은 User객체를 저장
  - `credentials`: 사용자 비밀번호
  - `authorities`: 인증된 사용자의 권한 목록
  - `details`: 인증 부가 정보
  - `Authenticated`: 인증 여부(`Boolean`)

### 3. Authentication 객체의 사용 흐름
![Authentication](https://user-images.githubusercontent.com/99089584/222873909-ff177fa6-7142-4308-81a0-53c704d11868.png)

1. 사용자가 로그인을 시도(username + password 입력 및 전달)
2. `usernamePasswordAuthenticationFilter`(인증필터)가 요청정보를 받아서 정보 추출을 하여 인증객체 (`Authentication`)을 생성함.
3. `AuthenticationManager`가 인증객체를 가지고 인증처리를 수행함.
<br>
⇒ 인증이 실패하게 되면 예외 발생.
4. 인증 성공 후 `Authentication` 인증객체를 만들어서 내부의 `Principal, Credentials, Authorities, Authenticated` 들을 채워넣는다. 
5. `SecurityContextHolder`객체 안의 `SecurityContext`에 저장함.		
<br>
⇒ 인증객체를 전역적으로 사용할 수 있게 됨.


### 4. 사용자 별 Authentication 인증 객체를 어떻게 구분하는가? 
- `SecurityContextHolder`라는 전역 객체 안에 `SecurityContext`에 인증 객체를 저장하는데, 이 `SecurityContextHolder`는 `ThreadLocal`에 저장되기 때문에 각기 다른 쓰레드별로 다른 `SecurityContextHolder` 인스턴스를 가지고 있어서 사용자 별로 각기 다른 인증 객체를 가질 수 있음.



## 2-2. 스프링 시큐리티 인증 아키텍쳐
1. Http Request 수신 (로그인 양식으로 인증 요청)
   - 스프링 시큐리티는 필터로 동작함.
   - 요청이 들어오면 인증과 권한을 위한 필터들을 통하게 됨.

2. 로그인 요청을 받으면 `AuthenticationFilter`가 `HttpServletRequest`에서 사용자가 보낸 아이디와 패스워드를 인터셉트함.		
<br>
`AuthenticationFilter`는 기본적으로 로그인 폼으로부터 오는 데이터를 username과 password로 인식하고 있으므로, `<input>`태그의 `name` 속성을 각각 username과 password로 지정해야 함.
<br>
이렇게 넘어온 username과 password를 이용해 `UsernamePasswordAuthenticationToken`이라는 인증 객체를 만들고, username과 password가 유효한 계정인지 판단하기 위해 `AuthenticationManager`에게 위임함.

3. `AuthenticationProvider`의 구현체에서는 토큰에 있는 계정 정보가 유효한지 판단하는 로직을 구현해야 함.(DB로부터 조회해오는)

4. `UserDetailsService`는 username 기반의 `UserDetails`를 검색함.
<br>
`UserDetailsService`를 상속받은 서비스 객체는 `loadUserByUsername()`을 재정의하여 DB에 계정 정보를 확인하는 로직을 구현하고 디비 정보가 유효하다면 유저의 상세 정보를 이용해 새로운 `UserPasswordAuthenticationToken`을 발급함.

5. `User`객체의 정보들을 `UserDetails`가 `UserDetailsService`에 전달함.

6. `AuthenticationProvider`는 `UserDetails` 객체를 전달 받은 이후 실제 사용자의 입력정보와 `UserDetails` 객체를 가지고 인증을 시도함.

7. 유저의 인증이 성공하면 전체 인증정보를 리턴하고 실패한다면 `AuthenticationException`을 던짐.



## 3. 시큐리티 세션 관련
### 1) 동작 흐름
1. 시큐리티는 "~/login" 주소로 요청이 오면 가로채서 로그인을 진행함.
2. 로그인 진행이 완료되면 시큐리티_session을 만들고 `SecurityContextHolder`(= 시큐리티 인메모리 세션 저장소)에 저장함.
3. 시큐리티가 갖고있는 시큐리티_session에 들어갈 수 있는 Object(=`Athentication` 객체)는 정해져 있음.
4. `Authentication` 안에 `User` 정보가 있어야 함.
5. `User` 객체 타입은 `UserDetails` 객체임.

### 2) Security Session ⇒ Authentication ⇒ UserDetails
- 시큐리티_Session에 접근해서 `Authentication`을 꺼내고 거기서 `UserDetails` 타입 `User`를 꺼내면 우리가 원하는 유저 객체를 꺼낼 수 있게 되는 것.

### 3) 정리
1. 스프링 시큐리티는 오는 모든 접근 주체에 대해 `Authentication`를 생성함.
2. `Authentication`은 `SecurityContext`에 저장됨.
3. `SecurityContext`는 `SecurityContextHolder`가 관리함.
4. 따라서, 시큐리티 세션들을 `SecurityContextHolder` 메모리 저장소에 저장하고, 꺼내서 사용하게 되는 것임.


## 4. 인증 저장소(SecurityContext, SecurityContextHolder)
### 1) SecurityContext
- `Authentication` 객체가 저장되는 보관소로 필요 시 언제든지 `Authentication` 객체를 꺼내어 쓸 수 있도록 제공되는 클래스
- `ThreadLocal`에 저장되어 아무 곳에서나 참조가 가능하도록 설계함

> #### * ThreadLocal: Thread마다 할당된 고유 공간(공유X) 
> - 다른 `Thread`로부터 안전함.
> - `get, set, remove api`가 있음.
> - set 한 이후 get할 때 장소의 제약이 없음.  <br>
>    ex) A메서드에서 set한 내용을 B메서드에서 get하는것이 가능

- 인증이 완료되면 `HttpSession`에 저장되어 어플리케이션 전반에 걸쳐 전역적인 참조가 가능함.

### 2) SecurityContextHolder
- `SecurityContext` 객체를 저장하고 감싸고 있는 wrapper 클래스
- `SecurityContextholder.clearContext()`: `SecurityContext`기본 정보 초기화 메서드


## References
- [Spring Security를 이용한 회원 로그인 구현과 동작 원리 정리 (+SecurityFilterChain 기능 정리 )](https://sjparkk-dev1og.tistory.com/113)
- [[SpringBoot] Spring Security란?](https://mangkyu.tistory.com/76)
- [Springboot JWT 로그인 - (3) UserDetails, UserDetailsService 이해](https://ws-pace.tistory.com/249)
- [스프링 시큐리티 주요 아키텍처 이해](https://catsbi.oopy.io/f9b0d83c-4775-47da-9c81-2261851fe0d0)
- [코드로 배우는 스프링 웹 프로젝트](http://www.yes24.com/Product/Goods/64340061)