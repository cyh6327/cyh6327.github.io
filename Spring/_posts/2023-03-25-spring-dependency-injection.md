---
title:  "[Spring] 의존성 주입(Dependency Injection, DI)"
categories: 
    - Spring
tags: [의존성주입, Dependency Injection, DI, Annotation, final, lombok, Autowired]
date: 2023-03-25
last_modified_at: 2023-03-26
---

## 1. 의존성 주입의 개념 및 필요성
### 1) 의존성 주입이란?
- Spring 프레임워크에서 지원하는 3가지 핵심 프로그래밍 모델 중 하나
- 외부에서 두 객체 간의 관계를 결정해주는 디자인 패턴으로, 인터페이스를 사이에 둬서 클래스 레벨에서는 의존관계가 고정되지 않도록 하고 런타임 시에 관계를 동적으로 주입하여 유연성을 확보하고 결합도를 낮출 수 있게 해줌.
> #### ＊ 의존성이란?
> - 한 객체가 다른 객체를 사용할 때 의존성이 있음.
> - 예를 들어 다음과 같이 `Store` 객체가 `Pencil` 객체를 사용하고 있는 경우에 우리는 `Store`객체가 `Pencil` 객체에 의존성이 있다고 표현함. <Br>
> ⇒ `public class Store { private Pencil pencil; }`


- 두 객체 간의 관계(의존성)를 맺어주는 것을 의존성 주입이라고 하며 생성자 주입, 필드 주입, 수정자 주입 등 다양한 주입 방법이 있음. (Spring 4부터는 생성자 주입을 강력히 권장하고 있음)
![image](https://user-images.githubusercontent.com/99089584/227720015-d9343c14-06f3-4cb2-91e8-fb4e66f2bbc3.png)



## 2) 의존성 주입 사용
```java
public interface Product {

}

public class Pencil implements Product {

}
```
```java
public class Store {

    private Product product;

    public Store(Product product) {
        this.product = product;
    }

}
```
- `Store`와 `Pencil`이 강하게 결합되지 않게 외부에서 상품을 주입`(Injection)`받아야 함.
- `Store`에서 `Product` 객체를 주입하기 위해서는 애플리케이션 실행 시점에 필요한 객체(빈)를 생성해야 하며, 의존성이 있는 두 객체를 연결하기 위해 한 객체를 다른 객체로 주입시켜야 함.
<br>⇒ 주입시키는 역할을 수행하기 위해 `DI 컨테이너`가 필요한 것.
<br>⇒ 이러한 부분을 스프링 프레임워크가 완벽하게 지원(특정 위치부터 클래스를 탐색하고, 객체를 만들며 객체들의 관계까지 설정)해 주므로, 스프링은 `DI 컨테이너`라고도 불림.


## 2. 다양한 의존성 주입 방법
### 1) 생성자 주입(Constructor Injection)
```java
@Service
public class UserService {

    private UserRepository userRepository;
    private MemberService memberService;

    //@Autowired 생성자가 1개만 있을 경우에 @Autowired를 생략해도 주입이 가능
    public UserService(UserRepository userRepository, MemberService memberService) {
        this.userRepository = userRepository;
        this.memberService = memberService;
    }

}
```
## 2) 수정자 주입(Setter 주입, Setter Injection)
- 필드 값을 변경하는 `Setter`를 통해서 의존 관계를 주입하는 방법.
- 생성자 주입과 다르게 주입받는 객체가 변경될 가능성이 있는 경우에 사용.
    ```java
    @Service
    public class UserService {

        private UserRepository userRepository;
        private MemberService memberService;

        @Autowired
        public void setUserRepository(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        @Autowired
        public void setMemberService(MemberService memberService) {
            this.memberService = memberService;
        }
    }
    ```

## 3) 필드 주입(Field Injection)
필드에 바로 의존 관계를 주입하는 방법. <br>
#### 단점
- 외부에서 접근이 불가능함.
- 필드의 객체를 수정할 수 없음.
- 필드 주입은 반드시 `DI 프레임워크`가 존재해야 함.

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MemberService memberService;

}
```

## 3. 생성자 주입을 사용해야 하는 이유
1. 객체의 불변성 확보
2. 테스트 코드의 작성
3. `final` 키워드 작성 및 `Lombok`과의 결합
4. 스프링에 비침투적인 코드 작성
5. 순환 참조 에러 방지

### 1) 객체의 불변성 확보
- 실제로 개발을 하다 보면 의존 관계의 변경이 필요한 상황은 거의 없음.
- 하지만 수정자 주입이나 일반 메소드 주입을 이용하면 불필요하게 수정의 가능성을 열어두어 유지보수성을 떨어뜨리므로 생성자 주입을 통해 변경의 가능성을 배제하고 불변성을 보장하는 것이 좋음.

### 2) 테스트 코드의 작성
- 테스트가 특정 프레임워크에 의존하는 것은 침투적이므로 좋지 못하므로 가능한 순수 자바로 테스트를 작성하는 것이 가장 좋은데, 생성자 주입이 아닌 다른 주입으로 작성된 코드는 순수한 자바 코드로 단위 테스트를 작성하는 것이 어려움.
- 생성자 주입을 사용하면 컴파일 시점에 객체를 주입받아 테스트 코드를 작성할 수 있으며, 주입하는 객체가 누락된 경우 컴파일 시점에 오류를 발견할 수 있음.

#### 예시

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MemberService memberService;

    public void register(String name) {
        userRepository.add(name);
    }

}
```
↓ 위 코드에 대해 순수 자바 테스트 코드를 작성한 것
```java
public class UserServiceTest {

    @Test
    public void addTest() {
        UserService userService = new UserService();
        userService.register("MangKyu");
    }

}
```

### 3) final 키워드 작성 및 Lombok과의 결합
- 생성자 주입을 사용하면 필드 객체에 `final` 키워드를 사용할 수 있으며, 컴파일 시점에 누락된 의존성을 확인할 수 있음. (다른 주입 방법들은 객체의 생성(생성자 호출) 이후에 호출되므로 `final` 키워드를 사용할 수 없음.)
    > #### ＊final
    > - `final`로 선언된 변수가 할당되면 항상 같은 값을 가짐.<br> 
    만약 `final` 변수가 객체를 참조하고 있다면, 그 객체의 상태가 바뀌어도 `final` 변수는 매번 동일한 내용을 참조함.
    > - `final` 키워드를 붙이면 `Lombok`과 결합되어 코드를 간결하게 작성할 수 있음.<br> 
    ⇒ `@RequiredArgsConstructor` : `final` 변수를 위한 생성자를 대신 생성.

### 4) 스프링에 비침투적인 코드 작성
- 필드 주입을 사용하려면 `@Autowired`를 이용해야 하는데, 이것은 스프링이 제공하는 어노테이션이므로 `@Autowired`를 사용하면 다음과 같이 `UserService`에 스프링 의존성이 침투하게 된다. 
    ```java
    import org.springframework.beans.factory.annotation.Autowired;
    ```
- 우리가 사용하는 프레임워크는 언제 바뀔지도 모를 뿐만 아니라, 사용자와 관련된 책임을 지는 `UserService`에 스프링 코드가 박혀버리는 것은 바람직하지 않음.
- 가능하다면 스프링이 없이 코드가 작성되면 더욱 유연한 코드를 확보하게 됨.

### 5) 순환 참조 에러 방지
- 생성자 주입을 사용하면 애플리케이션 구동 시점(객체의 생성 시점)에 순환 참조 에러를 예방할 수 있음.
    > #### 순환 참조 에러(필드를 사용해 서로 호출하는 코드)
    > ```java
    > @Service
    > public class UserService {
    > 
    >     @Autowired
    >     private MemberService memberService;
    >     
    >     @Override
    >     public void register(String name) {
    >         memberService.add(name);
    >     }
    > 
    > }
    > ```
    > ```java
    > @Service
    > public class MemberService {
    > 
    >     @Autowired
    >     private UserService userService;
    > 
    >     public void add(String name){
    >         userService.register(name);
    >     }
    > 
    > }
    > ```
    > - `UserSerivce`가 이미 `MemberService`에 의존하고 있는데, `MemberService` 역시 `UserService`에 의존하고 있음. <br>
    ⇒ 위의 두 메소드는 서로를 계속 호출할 것이고, 메모리에 함수의 CallStack이 계속 쌓여 `StackOverflow` 에러가 발생하게 됨.

- 생성자 주입은 객체(`Bean`)의 생성과 조립(의존관계 주입)이 동시에 실행되다 보니 위와 같은 에러를 사전에 잡을 수 있음. <br> 하지만 `@Autowired`는 모든 객체의 생성이 완료된 후에 조립(의존관계 주입)이 처리되다 보니, 호출이 되고 나서야 순환 이슈를 확인할 수 있는 것.


## 4. 어노테이션
- `@Component` : `@Component` 어노테이션을 이용하면 `Bean Configuration` 파일에 `Bean`을 따로 등록하지 않아도 사용할 수 있음.  
⇒ 빈 등록자체를 빈 클래스 자체에다가 할 수 있다는 의미.
- `@Setter(onMethod_ = @Autowired)` : `onMethod` 속성 = 생성되는 `setter`메서드에 `@Autowired`어노테이션을 추가함
- `@Autowired` : 자신이 특정한 객체에 의존적이므로 자신에게 해당 타입의 빈을 주입해주라는 표시
    ```java
    @Autowired
    ClubService clubService;
    ClubDao clubDao;
    ```


## References
- [[Spring] 의존성 주입(Dependency Injection, DI)이란? 및 Spring이 의존성 주입을 지원하는 이유](https://mangkyu.tistory.com/150)
- [[Spring] 다양한 의존성 주입 방법과 생성자 주입을 사용해야 하는 이유 - (2/2)](https://mangkyu.tistory.com/125)
    