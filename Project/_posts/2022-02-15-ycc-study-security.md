---
title:	"YoungCultureCenter 프로젝트 - security"
categories: 
    - Project
date: 2023-02-15
last_modified_at: 2023-02-21
---
# YoungCultureCenter 프로젝트 - security
# security-context.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:security="http://www.springframework.org/schema/security"
	xsi:schemaLocation="http://www.springframework.org/schema/security 
		http://www.springframework.org/schema/security/spring-security.xsd
		http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans.xsd">
			
<!-- 		CustomAccessDeniedHandler Class를 bean으로 등록 			 -->
<bean id="customAccessDenied" class="com.youngtvjobs.ycc.member.security.CustomAccessDeniedHandler"></bean>
<!-- 		CustomLoginSuccessHandler Class를 bean으로 등록 			 -->
<bean id="customLoginSuccess" class="com.youngtvjobs.ycc.member.security.CustomLoginSuccessHandler"></bean>
<bean id="bcryptPasswordEncoder" class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder" />
<bean id="customUserDetailsService" class="com.youngtvjobs.ycc.member.security.CustomUserDetailsService"></bean>
<bean id="CustomUserLoginFailHandler" class="com.youngtvjobs.ycc.member.security.CustomLoginFailHandler"></bean>

	<security:http>
		<!-- intercept-url: 특정 url 패턴은 권한이 있어야 허용 설정  -->
		<security:intercept-url pattern="/" access="permitAll"/>
		<security:intercept-url pattern="/mypage/pwcheck" access="isAuthenticated()"/>
		<security:intercept-url pattern="/mypage/forget" access="permitAll"/>
		<security:intercept-url pattern="/mypage/inquiry/**" access="hasAnyRole('ROLE_MEMBER','ROLE_ADMIN')"/>
		<security:intercept-url pattern="/admin/**" access="hasRole('ROLE_ADMIN')" />
		<security:intercept-url pattern="/board/notice" access="permitAll" />
		<security:intercept-url pattern="/board/event" access="permitAll" />
		<security:intercept-url pattern="/board/write" access="hasRole('ROLE_ADMIN')" />
		<security:intercept-url pattern="/board/remove" access="isAuthenticated()" />
		<security:intercept-url pattern="/board/edit" access="isAuthenticated()" />
		<security:intercept-url pattern="/course/search" access="permitAll" />
		<security:intercept-url pattern="/course/**" access="isAuthenticated()" />
		<security:intercept-url pattern="/rental/locker/info" access="permitAll" />
		<security:intercept-url pattern="/rental/locker" access="permitAll" />
		<security:intercept-url pattern="/rental/locker/reservation" access="isAuthenticated()" />
		<security:intercept-url pattern="/rental/studyroom" access="isAuthenticated()" />
		<security:intercept-url pattern="/rental/place" access="isAuthenticated()" />
		<!-- <security:intercept-url pattern="/rental/place/do" access="isAuthenticated()" /> -->
		<security:intercept-url pattern="/search/**" access="permitAll" />
		<security:intercept-url pattern="/club/**" access="isAuthenticated()" />
		<security:intercept-url pattern="/club" access="permitAll" />
		
		<!-- 접근 후 에러페이지  -->
		<security:access-denied-handler ref="customAccessDenied"/>
		<!-- 로그인페이지 -->
		<security:form-login login-page="/login" authentication-success-handler-ref="customLoginSuccess" /> 
		<!-- 자동로그인 30일 설정 -->
		<security:remember-me data-source-ref="dataSource" token-validity-seconds="2592000"/>
		<!-- 로그아웃 URI지정, 로그아웃을 했을 때 세션 무효화 설정 , 자동로그인 쿠키 삭제  -->
		<security:logout logout-url="/logout" invalidate-session="true" delete-cookies="remember-me, JSESSION_ID" />

	</security:http>
	
	<security:authentication-manager >
		<security:authentication-provider user-service-ref="customUserDetailsService">
			<security:password-encoder ref="bcryptPasswordEncoder" />
		</security:authentication-provider>
	</security:authentication-manager>

</beans>
```
# 1. `<security:form-login>`
## 1) Spring Security에서 제공하는 인증방식
## 2) 동작 방식
1. 사용자가 Server에 특정 URL을 요청하였을 때 해당 URL이 인증이 필요할 경우 Server는 Login 페이지를 return하게 됌	
2. 사용자는 username(ID)와 password를 입력하여 로그인 요청을 하면 Post mapping으로 해당 데이터가 서버에 전송됌
3. Server는 해당 로그인 정보를 확인하고, 해당 유저 정보가 존재한다면 Session과 Token을 생성하고 저장해둠		

이러한 과정을 거친 후 사용자가 원래 접속하려던 url에 접속 요청을 할 경우 세션에 저장된 인증 토큰으로 접근을 할 수 있게되며,			 	
세션에 인증토큰이 있는 동안은 해당 사용자가 인증된 사용자라 판단하여 인증을 유지하게 됌


# 2. 자동로그인
## 1) 태그, 속성
- `<security:remember-me>` 태그를 이용해서 구현
- `data-source-ref` : DataSource를 지정하고 테이블(=persistence_logins)을 이용해서 기존 로그인 정보를 기록
- `token-validity-seconds` : 쿠키의 유효시간


## 2) 자동로그인 사용 방식
- 자동 로그인 기능을 처리하는 방식 중 가장 많이 사용되는 방식은 로그인이 되었던 정보를 데이터베이스를 이용해서 기록해 두었다가 사용자의 재방문 시 세션에 정보가 없으면 데이터베이스를 조회해서 사용하는 방식	
- 서버의 메모리상에만 데이터를 저장하는 방식보다 좋은 점은 데이터베이스에 정보가 공유되기 때문에 좀 더 안정적으로 운영이 가능하다는 점


## 3) persistence_logins 테이블
- 스프링 시큐리티에서 'remember-me' 기능은 지정된 이름의 테이블(persistence_logins)을 생성하면 지정된 SQL문이 실행되면서 이를 처리하는 방식을 지원함
- persistence_logins : Spring Security의 공식 문서에 나오는 로그인 정보를 유지하는 테이블명
![image](https://user-images.githubusercontent.com/99089584/219022294-0a666b1e-f017-4419-a6a4-3d1567478ee2.png)


## 4) 자동로그인 체크박스 설정
`<input>` 태그에서 `name=remember-me`로 설정
