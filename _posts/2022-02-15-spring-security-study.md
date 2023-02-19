---
title:  "Spring Security"
categories: 
    - spring
date: 2023-02-15
last_modified_at: 2023-02-20
---

# Spring Security
참고한 글 : https://mangkyu.tistory.com/76
# 0. 용어
- WAS(Web Application Server) :     
  1) DB 조회나 다양한 로직 처리를 요구하는 동적인 컨텐츠를 제공하기 위해 만들어진 Application Server  
  2) “웹 컨테이너(Web Container)” 혹은 “서블릿 컨테이너(Servlet Container)”라고도 불림.       
  Container란 JSP, Servlet을 실행시킬 수 있는 소프트웨어를 말함.  
  즉, WAS는 JSP, Servlet 구동 환경을 제공함.

- JSESSIONID : 세션을 유지하는데 사용되는 쿠키(Tomcat에서 발행. WAS마다 다른 이름을 사용함.)

# 1. Spring Web Security란
- Spring Security는 Spring 기반의 애플리케이션의 보안(인증과 권한, 인가 등)을 담당하는 스프링 하위 프레임워크.
- Spring Security는 '인증'과 '권한'에 대한 부분을 Filter 흐름에 따라 처리하고 있음.

# 2. 인증(Authorizatoin)과 인가(Authentication)
## 1) 인증(Authentication): 해당 사용자가 본인이 맞는지를 확인하는 절차
- AuthenticationManager : 스프링 시큐리티에서 인증을 담당
- ProviderManager : 인증에 대한 처리를 AuthenticationProvider라는 타입의 객체를 이용해서 처리를 위임함
- AuthenticationProvider : 실제 인증 작업 진행.
- UserDetailService : 사용자의 정보와 사용자가 가진 권한의 정보를 처리해서 반환
![KakaoTalk_20230219_005722608](https://user-images.githubusercontent.com/99089584/219875639-0468db6f-0a16-4e72-93d1-09c6a7311b3d.jpg)

## 2) 인가(Authorization): 인증된 사용자가 요청한 자원에 접근 가능한지를 결정하는 절차 

## 3) 과정
![image](https://user-images.githubusercontent.com/99089584/219874815-976059a6-5da2-4a84-9039-6d4212247ce9.png)
- Spring Security는 기본적으로 인증 절차를 거친 후에 인가 절차를 진행하게 되며, 인가 과정에서 해당 리소스에 대한 접근 권한이 있는지 확인을 하게 됌.
- Spring Security에서는 이러한 인증과 인가를 위해 Principal(=접근 주체: 보호받는 Resource에 접근하는 대상)을 아이디로, Credential(=비밀번호:  Resource에 접근하는 대상의 비밀번호)을 비밀번호로 사용하는 Credential 기반의 인증 방식을 사용함.

# 3. 로그인/로그아웃
## 1) security-context.xml
`<security:intercept-url>` : 특정한 URI에 접근할 때 인터셉터를 이용해서 접근을 제한하는 설정
## 2) AccessDeniedHandler 구현 방식
1. 특정한 uri 지정
   - 사용자가 접근했던 uri 자체의 변화는 없음.  
   ex) /admin uri로 접근 => 지정했던 uri(에러페이지)의 결과만 보이고 uri는 /admin 그대로임.
2. AccessDeniedHandler 인터페이스의 구현체 지정
    - 접근 제한이 된 경우에 다양한 처리를 하고 싶을 때 인터페이스를 직접 구현.  
    ex) 접근 제한이 되었을 때 쿠키나 세션에 특정한 작업을 하거나, HttpServletResponse에 특정한 헤더 정보를 추가하는 등의 행위
    - `response.sendRedirect("/ycc/error/403");` : 접근 제한에 걸리는 경우 리다이렉트 하는 방식으로 동작되는데, 이 과정에서 uri가 변경됌(/ycc/error/403)

## 3) CSRF(Cross-site request forgery) 공격과 토큰
### 1. CSRF 공격
   - CSRF 공격 : 서버에서 받아들이는 요청을 해석하고 처리할 때 어떤 출처에서 호출이 진행되었는지 따지지 않기 때문에 생기는 허점을 노리는 공격 방식 = 사이트간 요청 위조.    
   ex) 이메일에 첨부된 링크를 누르면 내 은행계좌의 돈이 빠져나가는 방식의 해킹 등
  - CSRF 공격을 막기 위한 방법  
    1. 사용자의 요청에 대한 출처를 의미하는 referer 헤더를 체크
    2. REST방식에서 사용되는 PUT, DELETE와 같은 방식을 이용
    3. CSRF토큰

### 2. CSRF 토큰
   - 스프링 시큐리티에서 POST 방식을 이용하는 경우 기본적으로 CSRF 토큰을 이용하게 됌.
   - CSRF 토큰 : 
   1. 서버에 들어온 요청이 실제 서버에서 허용한 요청이 맞는지 확인하기 위한 토큰.  
   2. CSRF Token은 임의의 난수를 생성하고 세션에 저장함.    
   사용자가 POST요청을 할 때, 해당 난수 값(토큰값)을 포함해서 서버로 전송시키고, 서버에서는 요청을 받을 때마다 세션에 저장된 토큰값과 요청 파라미터에 전달된 토큰값이 같은지 체크함.  
   만일 토큰값이 다르다면 작업을 처리하지 않는 방식.

# 4. JDBC를 이용하는 간편 인증/권한 처리
### 1. BCryptPasswordEncoder 클래스를 이용한 패스워드 보호
- 암호화가 필요한 이유 : 대부분의 사용자가 여러 웹 사이트를 이용하는데 이 때 동일한 패스워드를 사용하다가 어느 한 웹 사이트에서 비밀번호가 유출되면 이 사람이 가입된 모든 웹 사이트가 해킹된 일이 벌어질수 있음.        
따라서 암호화를 해두면 설사 서버가 털려서 패스워드가 유출된다 하더라도 해당 사용자의 이메일로 가입된 다른 웹사이트에 접근하지 못할 것.

   










