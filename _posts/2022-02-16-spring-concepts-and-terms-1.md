---
title:  "스프링 개념, 용어 정리"
categories: 
    - spring
date: 2023-02-16
last_modified_at: 2023-02-16
---

# 1. Servlet(서블릿)
## 1) 정의
- 클라이언트의 요청을 처리하고, 그 결과를 반환하는 
Servlet 클래스의 구현 규칙을 지킨 자바 웹 프로그래밍 기술
- 서블릿이란 자바를 사용하여 웹을 만들기 위해 필요한 기술
- 클라이언트가 어떠한 요청을 하면 그에 대한 결과를 다시 전송해주어야 하는데, 이러한 역할을 하는 자바 프로그램

## 2) Servlet 특징
1. 클라이언트의 요청에 대해 동적으로 작동하는 웹 어플리케이션 컴포넌트
2. html을 사용하여 요청에 응답한다.
3. Java Thread를 이용하여 동작한다.
4. MVC 패턴에서 Controller로 이용된다.
5. HTTP 프로토콜 서비스를 지원하는 javax.servlet.http.HttpServlet 클래스를 상속받는다.
6. UDP보다 처리 속도가 느리다.
7. HTML 변경 시 Servlet을 재컴파일해야 하는 단점이 있다.
   

- 일반적으로 웹서버는 정적인 페이지만을 제공함.     
그렇기 때문에 동적인 페이지를 제공하기 위해서 웹서버는 다른 곳에 도움을 요청해 동적인 페이지를 작성해야 함.  
동적인 페이지로는 사용자가 요청한 시점에 페이지를 생성해서 전달해 주는 것을 의미함.     
여기서 웹서버가 동적인 페이지를 제공할 수 있도록 도와주는 어플리케이션이 서블릿이며, 동적인 페이지를 생성하는 어플리케이션이 CGI임.

## 3) Servlet 동작 방식
![image](https://user-images.githubusercontent.com/99089584/219299845-f871b7cb-2cef-4066-a415-e70d93dd9259.png)
1. 사용자(클라이언트)가 URL을 입력하면 HTTP Request가 Servlet Container로 전송.
2. 요청을 전송받은 Servlet Container는 HttpServletRequest, HttpServletResponse 객체를 생성.
3. web.xml을 기반으로 사용자가 요청한 URL이 어느 서블릿에 대한 요청인지 찾음.
4. 해당 서블릿에서 service메소드를 호출한 후 클리아언트의 GET, POST여부에 따라 doGet() 또는 doPost()를 호출함.
5. doGet() or doPost() 메소드는 동적 페이지를 생성한 후 HttpServletResponse객체에 응답을 보냄.
6. 응답이 끝나면 HttpServletRequest, HttpServletResponse 두 객체를 소멸시킴.
  

# 2. Dispatcher-Servlet(디스패처 서블릿)
## 1) 개념
- dispatch는 "보내다"라는 뜻을 가지고 있음.     
디스패처 서블릿은 HTTP 프로토콜로 들어오는 모든 요청을 가장 먼저 받아 적합한 컨트롤러에 위임해주는 프론트 컨트롤러(Front Controller)임

- 클라이언트로부터 어떠한 요청이 오면 Tomcat(톰캣)과 같은 서블릿 컨테이너가 요청을 받게 되고, 이 모든 요청을 프론트 컨트롤러인 디스패처 서블릿이 가장 먼저 받게 됌.     
그러면 디스패처 서블릿은 해당 요청을 처리해야 하는 컨트롤러를 찾아서 작업을 위임함.

- Front Controller : 주로 서블릿 컨테이너의 제일 앞에서 서버로 들어오는 클라이언트의 모든 요청을 받아서 처리해주는 컨트롤러로써, MVC 구조에서 함께 사용되는 디자인 패턴

## 2) 장점
- Spring MVC는 DispatcherServlet이 등장함에 따라 web.xml의 역할을 상당히 축소시켜주었음.    
- 과거에는 모든 서블릿을 URL 매핑을 위해 web.xml에 모두 등록해주어야 했지만, dispatcher-servlet이 해당 어플리케이션으로 들어오는 모든 요청을 핸들링해주고 공통 작업을 처리면서 상당히 편리하게 이용할 수 있게 되었음.   
- 컨트롤러를 구현해두기만 하면 디스패처 서블릿이 알아서 적합한 컨트롤러로 위임을 해주는 구조가 되었음.

