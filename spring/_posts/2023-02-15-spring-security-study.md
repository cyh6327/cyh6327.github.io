---
layout: post
title:  "Spring Security"
categories: [spring]
date: 2023-02-15
last_modified_at: 2023-02-25
---

# Spring Security
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
## 1) BCryptPasswordEncoder 클래스를 이용한 패스워드 보호
- 암호화가 필요한 이유
  1. 대부분의 사용자가 여러 웹 사이트를 이용하는데 이 때 동일한 패스워드를 사용하다가 어느 한 웹 사이트에서 비밀번호가 유출되면 이 사람이 가입된 모든 웹 사이트가 해킹된 일이 벌어질수 있음.        
  따라서 암호화를 해두면 설사 서버가 털려서 패스워드가 유출된다 하더라도 해당 사용자의 이메일로 가입된 다른 웹사이트에 접근하지 못할 것.
  2. 비밀번호를 암호화 함으로써 비밀번호 데이터가 노출되더라도 확인하기 어렵도록 만들어 줄 수 있음.

## 2) JUnit을 사용한 자바 단위테스트
- 단위테스트란?   
특정 소스코드의 모듈이 의도한 대로 작동하는지 검증하는 테스트.    
즉, 함수 및 메소드에 대한 테스트를 하는 작업.
1. [MemberTest.java] PasswordEncoder를 이용해서 암호화된 비밀번호를 tb_user 테이블에 insert하면서 사용자 데이터 생성

2. [AuthTest.java] user_auth 테이블에 사용자의 권한 부여하는 insert문 실행


# 5. 커스텀 UserDetailsService 활용
- UserDetailsService : 원하는 객체를 인증과 권한 체크에 활용할 수 있음
## 1) MemberMapper.xml
### 1. `<resultMap>`
- User 객체를 가져오는 경우, 한 번에 tb_user와 user_auth를 조인해서 처리할 수 있는 방식으로 `<resultMap>` 을 사용함   
- 하나의 MemberDto 인스턴스는 내부적으로 여러 개의 AuthDto를 가지는데 이를 '1+N 관계'라고 함.   
즉, 하나의 데이터가 여러 개의 하위 데이터를 포함하고 있는 것을 의미.    
- `<resultMap>` : 하나의 결과에 부가적으로 여러 개의 데이터를 처리하는 경우 1:N의 결과를 처리할 수 있게 해주는 태그.
```xml
	<resultMap type="MemberDto" id="memberMap">
		<id property="user_id" column="user_id"/>
		<result property="user_id" column="user_id"/>
		<result property="user_name" column="user_name"/>
		<result property="user_pw" column="user_pw"/>
		<result property="user_gender" column="user_gender"/>
		<result property="user_birth_date" column="user_birth_date"/>
		<result property="user_email" column="user_email"/>
		<result property="user_phone_number" column="user_phone_number"/>
		<result property="user_postcode" column="user_postcode"/>
		<result property="user_rNameAddr" column="user_rnameaddr"/>
		<result property="user_detailAddr" column="user_detailaddr"/>
		<result property="user_regdate" column="user_regdate"/>
		<result property="user_grade" column="user_grade"/>
		<result property="user_social_type" column="user_social_type"/>
		<collection property="authList" resultMap="authMap"></collection>
	</resultMap>
	 	
	<resultMap type="AuthDto" id="authMap">
		<result property="user_id" column="user_id"/>
		<result property="auth" column="auth"/>
	</resultMap>
  ```
- `id="memberMap"`인 `<resultMap>`은 `<result>`와 `<collection>`을 이용해 바깥쪽 객체(MemberDto의 인스턴스)와 안쪽 객체들(AuthDto의 인스턴스들)을 구성할 수 있음.

### 2. `resultMap="memberMap"`인 select문
```xml
	<select id="read" parameterType="String"  resultMap="memberMap">
		SELECT 
			tb_user.user_id , user_name, user_pw, user_gender, user_birth_date, user_email, user_phone_number,
			user_postcode, user_rnameaddr, user_detailaddr, user_regdate, user_grade, user_social_type, auth
		FROM tb_user tb_user, user_auth user_auth 
		where tb_user.user_id = user_auth.user_id 
		and tb_user.user_id = #{user_id}
	</select>  
```
- user의 auth가 2개 이상일 경우, 해당 쿼리의 결과로 auth컬럼 값은 다르지만, 나머지 tb_user 컬럼 값은 동일하게 출력됌.

## 2) CustomUserDetailsService 구성
### 1. `AuthenticationProvider`
```xml
	<security:authentication-manager >
		<security:authentication-provider user-service-ref="customUserDetailsService">
			<security:password-encoder ref="bcryptPasswordEncoder" />
		</security:authentication-provider>
	</security:authentication-manager>
```
- `AuthenticationProvider` : db에서 가져온 정보와 input 된 정보가 비교되서 체크되는 로직이 포함되어있는 인터페이스.
- db에서 사용자 정보를 가지고 오려면 `UserDetailsService`의 `loadUserByUsername()` 메서드가 리턴해주는 값(=UserDetails)을 가지고 사용이 가능함.
- 리턴된 user 정보를 가지고 PasswordEncoder bean을 사용하여서 input 된 비밀번호와 매칭 시켜주는 방식.

### 2. `Authentication`
- `Authentication` 객체의 경우 사용자(=form 또는 로그인 로직에서 가지고온 정보)의 정보가 담겨져 있음.
- `Authentication`는 로그인 아이디, 로그인 비밀번호를 객체에서 가지고 올 수 있음.

## 3) MemberDto를 UserDetails 타입으로 변환하기
- 최종적으로 MemberDto의 인스턴스를 스프링 시큐리티의 UserDetails 타입으로 변환하는 작업을 처리해야 함.
- 변환 후 [CustomUserDetailsService.java]에서 [CustomUser.java]를 반환하도록 수정.
- [CustomUser.java] : UserDetails를 구현한 User 클래스를 상속받는 클래스.
### 흐름
1. `UserDetailsService`의 `loadUserByUsername()`은 내부적으로 MemberMapper를 이용해서 MemberDto를 조회함.
2. 만일 MemberDto의 인스턴스를 얻을 수 있다면 CustomUser 타입의 객체로 변환 후 반환함.
3. [CustomUserDetailsService.java] 적용 코드
```java
	@Override
	// DB에 있는 사용자의 정보를 UserDetails타입으로 가져옴 
	// 입력된 정보와 DB에 저장되어있는 정보를 비교, 두 개의 정보가 다르다면 UsernameNotFoundException을 통해 예외처리
	public UserDetails loadUserByUsername(String user_id) throws UsernameNotFoundException {
		
	    MemberDto dto = null;
		try {
			dto = service.read(user_id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// null이 아니면 CustomUser를 반환
		return dto == null ? null : new CustomUser(dto);

	}
```

# 6. 스프링 시큐리티를 JSP에서 사용하기
## 1) 개요
- 단순히 JDBC를 이용하지 않고, `CustomUserDetailsService`와 같이 별도의 인증/권한 체크를 하는 가장 큰 이유는 JSP 등에서 단순히 사용자의 아이디(username) 정도가 아닌 사용자의 이름이나 이메일과 같은 추가적인 정보를 이용하기 위해서임.

## 2) JSP에서 로그인한 사용자 정보 보여주기(시큐리티와 관련된 정보 출력)
### 1. 시큐리티 관련 태그 라이브러리 선언			
```jsp
<%@taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
```
### 2. `<sec:authentication>` 태그와 `principal` 속성 사용
- `<sec:authentication property="principal" />` :	
</br>							
  - `principal` = `UserDetailsService`에서 반환된 객체 = `loadUserByUsername()`에서 반환된 `CustomUser` 객체 
  - 즉, `principal` = `CustomUser`를 의미하므로 	
  </br>	
  `principal.member`는 `CustomUser` 객체의 `getMember()`를 호출함
  </br>	 			
  => [CustomUser.java] 에서 `this.member = dto;` 부분.
  </br>	
  여기서 파라미터로 받은 dto는 로그인한 사용자의 정보를 의미.	
  </br>		
  => 즉, dto는 [CustomUserDetailsService.java] 에서 `service.read(user_id)`로 매퍼 구문 실행후 select된 사용자의 정보(dto)를
  </br>			
  `return dto == null ? null : new CustomUser(dto)` 
  </br>	
  CustomUser 객체로 변환한 것임.
  </br>			
  [CustomUserDetailsService.java]
	```java
		@Override
		// DB에 있는 사용자의 정보를 UserDetails타입으로 가져옴 
		// 입력된 정보와 DB에 저장되어있는 정보를 비교, 두 개의 정보가 다르다면 UsernameNotFoundException을 통해 예외처리 
		public UserDetails loadUserByUsername(String user_id) throws UsernameNotFoundException {
				
			MemberDto dto = null;
			try {
				dto = service.read(user_id);
			} catch (Exception e) {
				e.printStackTrace();
			}
			// null이 아니면 CustomUser를 반환
			return dto == null ? null : new CustomUser(dto);

		}
	```
- 예시
	- [MemberDto.java]
		```java
		public class MemberDto {

			private String user_id;
			private String user_name;

		}
		```	

	- jsp
		```jsp
		<p>사용자 아이디 : <sec:authentication property="principal.member.user_id" /></p>	//user0
		<p>사용자 이름 : <sec:authentication property="principal.member.user_name" /></p>	//회원0
		```


## 3) 표현식을 이용하는 동적 화면 구성
- 사용자의 로그인 상태에 따라 다른 화면 구성하기
	```jsp
	<sec:authorize access="isAnonymous()">	//익명의 사용자의 경우(로그인을 하지 않은 경우도 해당)
		<a href="/customLogin">로그인</a>
	</sec:authorize>

	<sec:authorize access="isAuthenticated()">	//인증된 사용자면 true
		<a href="/customLogout">로그아웃</a>
	</sec:authorize>
	```

# 7. 자동로그인(remember-me)
## 1. 개요
- 자동 로그인 기능을 처리하는 방식 중에서 가장 많이 사용되는 방식은 로그인이 되었던 정보를 데이터베이스를 이용해서 기록해 두었다가 사용자의 재방문 시 세션에 정보가 없으면 데이터베이스를 조회해서 사용하는 방식임.
- 서버의 메모리상에만 데이터를 저장하는 방식보다 좋은 점은 데이터베이스에 정보가 공유되기 때문에 좀 더 안정적으로 운영이 가능하다는 점.

## 2. 데이터베이스를 이용하는 자동 로그인
- 스프링 시큐리티에서 `remember-me` 기능은 지정된 이름의 테이블을 생성하면 지정된 SQL문이 실행되면서 이를 처리하는 방식이 있음.
### 1) 시큐리티에서 제공하는 로그인 정보 유지 테이블 생성
```sql
create table persistent_logins 
(
	username varchar(16) not null,
	series varchar(64) primary key,
	token varchar(64) not null,
	last_used timestamp not null
);
```

### 2) [security-context.xml]
- `data-source-ref="dataSource"` 지정해서 데이터베이스 이용
	```xml
	<!-- 자동로그인 30일 설정 -->
		<security:remember-me data-source-ref="dataSource" token-validity-seconds="2592000"/>
	```

### 3) [loginForm.jsp]
- 자동로그인 체크박스에 `name="remember-me"` 설정
	```jsp
	<input class="form-check-input" type="checkbox" name="remember-me" >자동로그인
	```

### 4) 구동 체크
- 자동로그인 체크 후 로그인 시 `remember-me` 쿠키 생성됌
![image](https://user-images.githubusercontent.com/99089584/221355994-d4fd38ec-d7a4-4f71-9143-40ec65fabe68.png)
- `persistent_logins` 테이블에 값 들어온 것 확인
![image](https://user-images.githubusercontent.com/99089584/221356043-d46ab4db-6b7e-40ac-b3b0-86c853196d4d.png)

### 5) 로그아웃 시 쿠키 삭제
- 자동 로그인 기능일 이용하는 경우에 사용자가 로그아웃을 하면 자동 로그인에 사용하는 쿠키도 삭제해 주도록 함
- `delete-cookies="remember-me, JSESSION_ID"` 속성 추가
	```xml
	<security:logout logout-url="/logout" invalidate-session="true" delete-cookies="remember-me, JSESSION_ID" />
	```

# 8. 기존 프로젝트에 스프링 시큐리티 접목하기
## 1) 특정 작업 시(게시글 생성, 동아리 생성 등) 스프링 시큐리티 처리
- `@PreAuthorize("isAuthenticated()")` 어노테이션 사용	
</br>	
=> 로그인한 사용자만이 해당 기능을 사용할 수 있음.
- [ClubController.java]
	- 동아리 생성은 로그인한 사용자만 허용
		```java
		@GetMapping("/club/createForm")
		@PreAuthorize("isAuthenticated()")
		public String clubCreateForm() {
			return "club/clubCreateForm";
		}
		```

## 2) 게시물의 수정/삭제
- 수정/삭제 메서드를 실행하기 전에 `@PreAuthorize` 을 사용함으로써 로그인한 사용자(=principal.username)와 현재 파라미터로 전달되는 작성자(writer)가 일치하는지 체크.
- ex) `@PreAuthorize("principal.username == #writer")`
- `#writer`의 `#`은 파라미터에 접근할 수 있는 접두문자를 의미.	
</br>	
=> 따라서 `#writer`는 파라미터로 전달되는 `writer`객체이 접근할 수 있음.

## 3) Ajax와 스프링 시큐리티 처리
### 1. X-CSRF-TOKEN 헤더 전송
스프링 시큐리티가 적용되면 POST, PUT, PATCH, DELETE와 같은 방식으로 데이터를 전송하는 경우에는 반드시 추가적으로 'X-CSRF-TOKEN'과 같은 헤더 정보를 추가해서 CSRF 토큰값을 전달하도록 수정해야 함.

```jsp
var csrfHeaderName = "${_csrf.headerName}";	//X-CSRF-TOKEN
var csrfTokenValue = "${_csrf.token}";
```

### 2. ajaxSend()를 사용해 모든 Ajax 전송 시 CSRF 토큰을 같이 전송하도록 세팅
```javascript
$(document).ajaxSend(function(e, xhr, options) {
	xhr.setRequestHeader(csrfHeaderName, csrfTokenValue);
});
```



# References
- [[SpringBoot] Spring Security란?](https://mangkyu.tistory.com/76)
- [코드로 배우는 스프링 웹 프로젝트](http://www.yes24.com/Product/Goods/64340061)
- [Spring | Security Authentication Provider](https://velog.io/@ewan/Spring-Security-Custom-Authentication-Provider)
- [Spring Security @PreAuthorize, @PostAuthorize 를 사용하는 신박한 전처리 후처리 기법](https://steemit.com/kr-dev/@igna84/spring-security-preauthorize-postauthorize)



   










