---
title:  "[Spring] 스프링 개념, 용어 정리 - 1"
tags: [Servlet, Dispatcher-Servlet, Filter, Interceptor, AOP]
categories: 
    - Spring
date: 2023-02-16
last_modified_at: 2023-03-26
---

## 용어
### 1. J2EE (Java 2 Enterprise Edition)
자바 기술로 기업환경의 어플리케이션을 만드는데 필요한 스펙들을 모아둔 스펙 집합



## 1. Servlet(서블릿)
### 1) 정의
- 클라이언트의 요청을 처리하고, 그 결과를 반환하는 
`Servlet` 클래스의 구현 규칙을 지킨 자바 웹 프로그래밍 기술
- 서블릿이란 자바를 사용하여 웹을 만들기 위해 필요한 기술
- 클라이언트가 어떠한 요청을 하면 그에 대한 결과를 다시 전송해주어야 하는데, 이러한 역할을 하는 자바 프로그램



### 2) Servlet 특징
1. 클라이언트의 요청에 대해 동적으로 작동하는 웹 어플리케이션 컴포넌트
2. `html`을 사용하여 요청에 응답한다.
3. `Java Thread`를 이용하여 동작한다.
4. `MVC` 패턴에서 Controller로 이용된다.
5. HTTP 프로토콜 서비스를 지원하는 `javax.servlet.http.HttpServlet` 클래스를 상속받는다.
6. `UDP`보다 처리 속도가 느리다.
7. HTML 변경 시 `Servlet`을 재컴파일해야 하는 단점이 있다.
   
- 일반적으로 웹서버는 정적인 페이지만을 제공함.     
그렇기 때문에 동적인 페이지를 제공하기 위해서 웹서버는 다른 곳에 도움을 요청해 동적인 페이지를 작성해야 함.  
동적인 페이지로는 사용자가 요청한 시점에 페이지를 생성해서 전달해 주는 것을 의미함.     
여기서 웹서버가 동적인 페이지를 제공할 수 있도록 도와주는 어플리케이션이 서블릿이며, 동적인 페이지를 생성하는 어플리케이션이 `CGI`임.



### 3) Servlet 동작 방식
![image](https://user-images.githubusercontent.com/99089584/219299845-f871b7cb-2cef-4066-a415-e70d93dd9259.png)

1. 사용자(클라이언트)가 URL을 입력하면 `HTTP Request`가 `Servlet Container`로 전송.
2. 요청을 전송받은 `Servlet Container`는 `HttpServletRequest`, `HttpServletResponse` 객체를 생성.
3. `web.xml`을 기반으로 사용자가 요청한 URL이 어느 서블릿에 대한 요청인지 찾음.
4. 해당 서블릿에서 service메소드를 호출한 후 클라이언트의 `GET`, `POST`여부에 따라 `doGet()` 또는 `doPost()`를 호출함.
5. `doGet()` or `doPost()` 메소드는 동적 페이지를 생성한 후 `HttpServletResponse` 객체에 응답을 보냄.
6. 응답이 끝나면 `HttpServletRequest`, `HttpServletResponse` 두 객체를 소멸시킴.
  

## 2. Dispatcher-Servlet(디스패처 서블릿)
### 1) 개념
- `dispatch`는 "보내다"라는 뜻을 가지고 있음.     
디스패처 서블릿은 HTTP 프로토콜로 들어오는 모든 요청을 가장 먼저 받아 적합한 컨트롤러에 위임해주는 프론트 컨트롤러(`Front Controller`)임

- 클라이언트로부터 어떠한 요청이 오면 `Tomcat`(톰캣)과 같은 서블릿 컨테이너가 요청을 받게 되고, 이 모든 요청을 프론트 컨트롤러인 디스패처 서블릿이 가장 먼저 받게 됨.     
그러면 디스패처 서블릿은 해당 요청을 처리해야 하는 컨트롤러를 찾아서 작업을 위임함.

- `Front Controller` : <br>
주로 서블릿 컨테이너의 제일 앞에서 서버로 들어오는 클라이언트의 모든 요청을 받아서 처리해주는 컨트롤러로써, `MVC` 구조에서 함께 사용되는 디자인 패턴

### 2) 장점
- `Spring MVC`는 `DispatcherServlet`이 등장함에 따라 `web.xml`의 역할을 상당히 축소시켜주었음.    
- 과거에는 모든 서블릿을 URL 매핑을 위해 `web.xml`에 모두 등록해주어야 했지만, `dispatcher-servlet`이 해당 어플리케이션으로 들어오는 모든 요청을 핸들링해주고 공통 작업을 처리면서 상당히 편리하게 이용할 수 있게 되었음.   
- 컨트롤러를 구현해두기만 하면 디스패처 서블릿이 알아서 적합한 컨트롤러로 위임을 해주는 구조가 되었음.

### 3) 정적 자원(Static Resources)의 처리
- `Dispatcher Servlet`이 모든 요청을 처리하다보니 이미지나 HTML/CSS/JavaScript 등과 같은 정적 파일에 대한 요청마저 모두 가로채는 까닭에 정적자원(`Static Resources`)을 불러오지 못하는 상황도 발생하곤 했음. <br>
⇒ 애플리케이션 요청을 탐색하고 없으면 정적 자원 요청으로 처리하는 방식으로 해결

### 4) Dispatcher-Servlet의 동작 방식
디스패처 서블릿을 통해 클라이언트의 요청을 처리할 컨트롤러를 찾아서 위임하고, 그 결과를 받아오는 식.


## 3. Filter
### 1) 정의
- 필터(`Filter`)는 `J2EE` 표준 스펙 기능으로 디스패처 서블릿(`Dispatcher Servlet`)에 요청이 전달되기 전/후에 url 패턴에 맞는 모든 요청에 대해 부가작업을 처리할 수 있는 기능을 제공함.
- 디스패처 서블릿은 스프링의 가장 앞단에 존재하는 프론트 컨트롤러이므로, 필터는 스프링 범위 밖에서 처리가 되는 것.
- 즉, 스프링 컨테이너가 아닌 톰캣과 같은 웹 컨테이너에 의해 관리가 되는 것이고(스프링 빈으로 등록은 된다), 디스패처 서블릿 전/후에 처리하는 것
![image](https://user-images.githubusercontent.com/99089584/219376053-e9ebc887-e795-471c-8076-7c2a05b9edb8.png)


### 2) 필터(Filter) vs 인터셉터(Interceptor) 차이
![image](https://user-images.githubusercontent.com/99089584/219389879-cc3b85bb-65d3-43d0-9cd3-7d74865957c5.png)

### 3) 필터(Filter)의 용도 및 예시
1. 스프링과 무관하게 전역적으로 처리해야 하는 작업들을 처리
2. 인터셉터보다 앞단에서 동작하므로 전역적으로 해야하는 보안 검사(XSS 방어 등)를 하여 올바른 요청이 아닐 경우 차단을 할 수 있음.  
그러면 스프링 컨테이너까지 요청이 전달되지 못하고 차단되므로 안정성을 더욱 높일 수 있다.
3. 웹 애플리케이션에 전반적으로 사용되는 기능(이미지나 데이터의 압축, 문자열 인코딩 등)을 구현하기에 적당함.    
4. `Filter`는 다음 체인으로 넘기는 `ServletRequest/ServletResponse` 객체를 조작할 수 있다는 점에서 `Interceptor`보다 훨씬 강력한 기술임.


## 4. 인터셉터(Interceptor)
### 1) 정의
- 인터셉터(`Interceptor`)는 `J2EE` 표준 스펙인 필터(`Filter`)와 달리 Spring이 제공하는 기술로써,  
디스패처 서블릿(`Dispatcher Servlet`)이 컨트롤러를 호출하기 전과 후에 요청과 응답을 참조하거나 가공할 수 있는 기능을 제공함.   
- 웹 컨테이너에서 동작하는 필터와 달리 인터셉터는 스프링 컨텍스트에서 동작을 하는 것.
- 디스패처 서블릿은 핸들러 매핑을 통해 적절한 컨트롤러를 찾도록 요청하는데, 그 결과로 실행 체인(`HandlerExecutionChain`)을 돌려줌.    
이 실행 체인은 1개 이상의 인터셉터가 등록되어 있다면 순차적으로 인터셉터들을 거쳐 컨트롤러가 실행되도록 하고, 인터셉터가 없다면 바로 컨트롤러를 실행한다.

![image](https://user-images.githubusercontent.com/99089584/219386252-433596dd-1b96-4fb8-8593-570dbec3b39b.png)

## 2) 인터셉터(Interceptor)의 용도 및 예시
1. 클라이언트의 요청과 관련되어 전역적으로 처리해야 하는 작업들을 처리.     
⇒ 세부적으로 적용해야 하는 인증이나 인가와 같이 클라이언트 요청과 관련된 작업  
ex) 특정 그룹의 사용자는 어떤 기능을 사용하지 못하는 경우가 있는데, 이러한 작업들은 컨트롤러로 넘어가기 전에 검사해야 하므로 인터셉터가 처리하기에 적합
2. 인터셉터는 필터와 다르게 `HttpServletRequest`나 `HttpServletResponse` 등과 같은 객체를 제공받으므로 객체 자체를 조작할 수는 없음.    
대신 해당 객체가 내부적으로 갖는 값은 조작할 수 있으므로 컨트롤러로 넘겨주기 위한 정보를 가공하기에 용이함.     
ex) 사용자의 ID를 기반으로 조회한 사용자 정보를 `HttpServletRequest`에 넣어줄 수 있음


## 5. AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)
### 1) 정의
- `Advice` : 타겟 오브젝트에 적용하는 부가 기능을 담은 오브젝트
- `PointCut` : 메소드 선정 알고리즘을 담은 오브젝트
- 핵심 기능에 부여되는 부가 기능을 효과적으로 모듈화하는 방법을 찾다가, 어드바이스와 포인트컷을 결합한 어드바이스가 발전하여 `AOP`가 만들어지게 됨.
- 이러한 부가 기능 모듈은 기존의 객체지향 설계와 구분되는 새로운 특성이 있어서 `Aspect`라고 불리기 시작함.
- `Aspect` : 애플리케이션의 핵심 기능을 담고 있지는 않지만 애플리케이션을 구성하는 한 가지 요소로써 핵심 기능에 부가되어 의미를 갖는 모듈
- 애플리케이션의 핵심적인 기능에서 부가적인 기능을 분리하여 독특한 모듈로 만들고 설계하여 개발하는 방법을 `AOP`라고 부름.

## References
- [[JSP] 서블릿(Servlet)이란?](https://mangkyu.tistory.com/14)
- [[Spring] Dispatcher-Servlet(디스패처 서블릿)이란? 디스패처 서블릿의 개념과 동작 과정](https://mangkyu.tistory.com/18)
- [[Spring] 필터(Filter) vs 인터셉터(Interceptor) 차이 및 용도 - (1)](https://mangkyu.tistory.com/173)   
- [코드로 배우는 스프링 웹 프로젝트](http://www.yes24.com/Product/Goods/64340061)
