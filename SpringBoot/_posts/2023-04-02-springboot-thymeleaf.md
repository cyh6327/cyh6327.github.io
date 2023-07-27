---
title:  "[SpringBoot] #7 화면 구성을 위한 Thymeleaf 사용 - 1"
categories: 
    - SpringBoot
date: 2023-04-02
last_modified_at: 2023-04-02
---

# [Spring Boot] #7 화면 구성을 위한 Thymeleaf 사용 - 1

## 1. Thymeleaf를 사용하는 프로젝트 생성
- 스프링 부트에서는 기본적으로 JSP 대신에 Thymeleaf나 FreeMarker, Mustache 등을 이용해서 화면을 처리함.
- 프로젝트 생성시 Thymeleaf 의존성 추가 <br>
![image](https://user-images.githubusercontent.com/99089584/229125641-fdefdd44-ef3d-4fb7-8239-d3d26436251d.png)
- Thymeleaf는 기본적으로 templates 폴더를 기본으로 사용함. <br>
![image](https://user-images.githubusercontent.com/99089584/229128333-18608b3f-4a96-47b8-b458-c79b0d050315.png)

### Thymeleaf를 사용한 코드
↓ ex1.html
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1 th:text="${'Hello World'}"></h1>
</body>
</html>
```
- 기본적인 사용 방법은 기존의 속성 앞에 `'th:'를 붙여주고 속성값을 지정하는 것.
- JSP와 달리 별도의 태그를 이용하지 않고 HTML을 그대로 유지한 상태에서 필요한 동작이나 값을 추가하는 방식임.


## 2. Thymeleaf의 기본 사용법
```java
@Data   //Getter/Setter, toString(), equals(), hashCode() 자동 생성
@Builder(toBuilder = true)
public class SampleDTO {

    private Long sno;
    private String first;
    private String last;
    private LocalDateTime regTime;
}
```

```java
@Controller
@RequestMapping("/sample")
@Log4j2
public class SampleController {

    @GetMapping("/ex1")
    public void ex1() {
        log.info("ex1...........");
    }

    @GetMapping({"/ex2"})
    public void exModel(Model model) {
        List<SampleDTO> list = IntStream.rangeClosed(1,20).asLongStream().mapToObj(i -> {
            SampleDTO dto = SampleDTO.builder()
                    .sno(i)
                    .first("First.."+i)
                    .last("Last.."+i)
                    .regTime(LocalDateTime.now())
                    .build();
            return dto;
        }).collect(Collectors.toList());

        model.addAttribute("list", list);
    }
}
```
- `SampleDTO` 타입의 객체를 20개 추가하고 이를 Model에 담아서 전송.


## 3. 반복문 처리
### 1) 기본 코드
`th:each = "변수 : ${목록}"`
```html
<ul>
    <li th:each="dto : ${list}">
        <!-- [[]] : 인라인 표현식. 
        별도의 태그 속성으로 지정하지 않고 사용하고자 할 때 유용 -->
        [[${dto}]]
    </li>
</ul>
```

![image](https://user-images.githubusercontent.com/99089584/229279507-ac872a34-bc78-44fa-b669-36a397b0efc1.png)


### 2) 반복문의 상태(state) 객체

> ＊ 상태변수 종류 <br>
> index : 0부터 시작하는 인덱스 <br>
> count : 1부터 시작하는 인덱스 <br>
> size : 리스트에 저장된 요소의 개수 <br>
> even : 현재 반복이 짝수인지 확인. true/false 반환 <br>
> odd : 현재 반복이 홀수인지 확인. true/false 반환 <br>
> first : 현재 반복이 첫번째인지 확인. true/false 반환 <br>
> last : 현재 반복이 마지막인지 확인. true/false 반환 <br>

- index 출력 코드

```java
<li th:each="dto, state : ${list}">
    [[${state.index}]] --- [[${dto}]]
</li>
```
![image](https://user-images.githubusercontent.com/99089584/229293836-a49dba2f-63b6-4aad-af8f-4f9af88b614f.png)


## 4. 제어문 처리
### 1) `th:if ~ th:unless`
↓ sno의 값이 5의 배수인 것들만 출력 <br>
```java
<li th:each="dto, state : ${list}" th:if="${dto.sno % 5 == 0}">
    [[${dto}]]
</li>
```
↓ sno가 5로 나눈 나머지가 0인 경우에는 `sno`만을 출력하고(if)<br>
↓ 그렇지 않다면(unless) `first`를 출력 <br>
```java
  <li th:each="dto, state : ${list}">
    <span th:if="${dto.sno % 5 == 0}" th:text="${'-----------------------' + dto.sno}"></span>
    <span th:unless="${dto.sno % 5 == 0}" th:text="${dto.first}"></span>
  </li>
```
![image](https://user-images.githubusercontent.com/99089584/229294806-62f7215d-680b-406e-b8ec-1d88542041a6.png)



### 2) 삼항연산자
↓ Thymeleaf는 특이하게도 단순 if와 같이 2개의 항만으로도 처리할 수 있음.
 ```java
<li th:each="dto, state : ${list}" th:text="${dto.sno % 5 == 0} ? ${dto.sno}"></li>
```

![image](https://user-images.githubusercontent.com/99089584/229295010-87d4b8fc-0aa3-4864-b653-873bc08aa2df.png)

↓ `sno`가 5로 나눈 나머지가 0인 경우 `sno`만을 출력, 나머지는 `first`출력.
```java
<li th:each="dto, state : ${list}" th:text="${dto.sno % 5 == 0} ? ${dto.sno} : ${dto.first}"></li>
```

![image](https://user-images.githubusercontent.com/99089584/229295332-08ae4362-f616-4e0a-bbd2-73dc30b47501.png)

↓ `sno`를 5로 나눈 나머지가 0인 경우에만 특정한 css를 적용.
```java
<style>
    .target {
        background-color: red;
    }
</style>

<ul>
    <li th:each="dto, state : ${list}" th:class="${dto.sno % 5 == 0} ? 'target'" th:text="${dto}"></li>
</ul>
```
![image](https://user-images.githubusercontent.com/99089584/229295647-116ed2a4-b30e-4fb4-8c1f-c55f42cfb3a0.png)


## 5. inline 속성
- inline 속성은 주로 자바스크립트 처리에서 유용함. <br>

↓ SampleController.java <br>

```java
@GetMapping({"/exInline"})
    public String exInline(RedirectAttributes redirectAttributes) {
        log.info("exInline................");

        SampleDTO dto = SampleDTO.builder()
                .sno(100L)
                .first("First...100")
                .last("Last...100")
                .regTime(LocalDateTime.now())
                .build();
        redirectAttributes.addFlashAttribute("result", "success");
        redirectAttributes.addFlashAttribute("dto", dto);

        return "redirect:/sample/ex3";
    }

    @GetMapping("/ex3")
    public void ex3() {
        log.info("ex3");
    }
```
↓ ex3.html
```html
<body>
  <h1 th:text="${result}"></h1>
  <h1 th:text="${dto}"></h1>

  <script th:inline="javascript">
    var msg = [[${result}]];
    var dto = [[${dto}]];
  </script>
</body>
```
↓ /sample/exInline
![image](https://user-images.githubusercontent.com/99089584/229297640-b07e0e27-df8c-425d-9c3d-9c31efc628b3.png) <br>

=> 자바스크립트 부분을 살펴보면 별도의 처리를 안했음에도 불구하고 문자열은 자동으로 ""이 추가되어 문자열이 되는 것을 볼 수 있고, 같이 전송된 dto는 JSON 포맷의 문자열이 된 것을 볼 수 있음.

### `th:block`
- 별도의 태그가 필요하지 않음.
- `th:block`은 실제 화면에서는 html로 처리되지 않음. <br>
=> 아래와 같이 루프 등을 별도로 처리하는 용도로 많이 사용함. <br>

```java
<th:block th:each="dto : ${list}">
    <li th:text="${dto.sno % 5 == 0} ? ${dto.sno} : ${dto.first}"></li>
</th:block>
```

## 6. 링크 처리
- `@{}` 를 이용해서 사용.
- `SampleController`의 `exModel()` 메서드 수정 <br>
=> `@GetMapping()`에는 배열을 이용해 하나 이상의 URL을 처리할 수 있음. <br>

```java
@GetMapping({"/ex2", "/exLink"})
public void exModel(Model model) {
    ...
}
```

### 1) 링크에 파라미터 추가
↓ exLink.html <br>
```html
<ul>
    <li th:each="dto : ${list}">
        <a th:href="@{/sample/exView(sno=${dto.sno})}">[[${dto}]]</a>
    </li>
</ul>  
```
![image](https://user-images.githubusercontent.com/99089584/229298553-f10067fd-ab11-4f4c-aeab-113a1797332a.png) <br>
![image](https://user-images.githubusercontent.com/99089584/229298702-2315ad09-17ea-4c53-9c74-09030a784006.png)

### 2) `sno`를 path로 이용하기
```html
<li th:each="dto : ${list}">
    <a th:href="@{/sample/exView/{sno}(sno = ${dto.sno})}">[[${dto}]]</a>
</li>
```
![image](https://user-images.githubusercontent.com/99089584/229299151-91e43b94-0711-4504-9f55-df46ec1033e0.png)