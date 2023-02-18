---
title:  "Spring Security"
categories: 
    - spring
date: 2023-02-15
last_modified_at: 2023-02-19
---

# Spring Security
참고한 글 : https://mangkyu.tistory.com/76
# 0. 용어

# 1. Spring Web Security란
- Spring Security는 Spring 기반의 애플리케이션의 보안(인증과 권한, 인가 등)을 담당하는 스프링 하위 프레임워크.
- Spring Security는 '인증'과 '권한'에 대한 부분을 Filter 흐름에 따라 처리하고 있음.

## 2. 인증(Authorizatoin)과 인가(Authentication)
### 1) 인증(Authentication): 해당 사용자가 본인이 맞는지를 확인하는 절차
- AuthenticationManager : 스프링 시큐리티에서 인증을 담당
- ProviderManager : 인증에 대한 처리를 AuthenticationProvider라는 타입의 객체를 이용해서 처리를 위임함
- AuthenticationProvider : 실제 인증 작업 진행.
- UserDetailService : 사용자의 정보와 사용자가 가진 권한의 정보를 처리해서 반환
![KakaoTalk_20230219_005722608](https://user-images.githubusercontent.com/99089584/219875639-0468db6f-0a16-4e72-93d1-09c6a7311b3d.jpg)

### 2) 인가(Authorization): 인증된 사용자가 요청한 자원에 접근 가능한지를 결정하는 절차 

### 3) 과정
![image](https://user-images.githubusercontent.com/99089584/219874815-976059a6-5da2-4a84-9039-6d4212247ce9.png)
- Spring Security는 기본적으로 인증 절차를 거친 후에 인가 절차를 진행하게 되며, 인가 과정에서 해당 리소스에 대한 접근 권한이 있는지 확인을 하게 됌.
- Spring Security에서는 이러한 인증과 인가를 위해 Principal(=접근 주체: 보호받는 Resource에 접근하는 대상)을 아이디로, Credential(=비밀번호:  Resource에 접근하는 대상의 비밀번호)을 비밀번호로 사용하는 Credential 기반의 인증 방식을 사용함.

# 2. 로그인/로그아웃







