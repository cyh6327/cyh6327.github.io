---
title:  "[SpringBoot] #11 게시판 CRUD"
categories: 
    - SpringBoot
date: 2023-05-19
last_modified_at: 2023-05-19
---

# [Spring Boot] #11 게시판 CRUD

## 1. 게시글 등록 페이지 구현 및 등록 기능
### 1) 컨트롤러
```java
@GetMapping("/register")
public void register() {
    log.info("register get...");
}

@PostMapping("/register")
public String registerPost(GuestbookDTO dto, RedirectAttributes redirectAttributes) {
    log.info("dto..."+dto);

    //새로 추가된 엔티티의 번호
    Long gno = service.register(dto);

    //한 번만 데이터를 전달하는 용도
    redirectAttributes.addFlashAttribute("msg",gno);

    return "redirect:/guestbook/list";
}
```

### 2) register.html 생성
- `<input>`태그의 `name`값은 `GuestbookDTO`로 수집될 데이터이므로 동일하게 맞춰주면 자동으로 수집됨.
> HTML에서의 input 요소의 name 속성 값이 자동으로 DTO에 할당되는 이유: <br>
> - Spring MVC의 폼 데이터 바인딩 기능(HTTP 요청의 폼 데이터를 자동으로 DTO 객체에 매핑해주는 기능)에 의해 처리되기 때문.

```html
<!-- register.html -->
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org" xmlns="http://www.w3.org/1999/html">

<th:block th:replace="~{/layout/basic :: setContent(~{this::content})}">

  <th:block th:fragment="content">

    <h1 class="mt-4">GuestBook Register Page</h1>

    <form th:action="@{/guestbook/register}" th:method="post">
      <div class="form-group">
        <label>Title</label>
        <input type="text" class="form-control" name="title" placeholder="Enter Title">
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea class="form-control" rows="5" name="content"></textarea>
      </div>
      <div class="form-group">
        <label>Writer</label>
        <input type="text" class="form-control" name="writer" placeholder="Enter Writer">
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

  </th:block>

</th:block>
```

### 3) 처리 결과 모달창
- `msg`변수에 새로 생성된 글의 번호가 할당되므로 `msg`변수 값을 이용해서 모달창 실행.

```html
<!-- list.html -->
<div class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>

<!-- th:inline : 템플릿 파일 내에서 자바 코드를 직접 작성할 수 있게 해주는 기능 -->
<script th:inline="javascript">
    $(document).ready(function() {
        var msg = [[${msg}]];

        console.log(msg);
        //$(".modal").show(); 사용시 모달창이 안 닫히는 오류 발생함
        if(msg) {
            $(".modal").modal('show');
        }
    });
</script>
```

### 4) 등록/조회 페이지 링크 처리
- 등록 페이지 이동 버튼 추가

```html
<!-- 등록 페이지 이동하는 버튼 -->
<span>
    <a th:href="@{/guestbook/register}">
        <button type="button" class="btn btn-outline-primary">REGISTER</button>
    </a>
</span>
```

---

- 조회 페이지 이동 링크 작성

```html
<tr th:each="dto : ${result.dtoList}">
    <th scope="row">
        <a th:href="@{/guestbook/read(gno = ${dto.gno}, page = ${result.page})}">
                [[${dto.gno}]]
        </a>
    </th>
    <td>[[${dto.title}]]</td>
    <td>[[${dto.writer}]]</td>
    <td>[[${#temporals.format(dto.regDate, 'yyyy/MM/dd')}]]</td>
</tr>
```

---

- 실행 결과

![image](https://github.com/cyh6327/SpringBoot/assets/99089584/d4d4dab3-659c-4adc-8b12-94e43d91f7ad)


## 2. 조회 처리
```java
// GuestbookService
GuestbookDTO read(Long gno);
```

```java
// GuestbookServiceImpl
@Override
public GuestbookDTO read(Long gno) {
    Optional<Guestbook> result = repository.findById(gno);

    // findById() 메서드는 Optional<T> 를 리턴하고 Optional<T>의 메서드중 get()을 사용해 데이터를 가져올 수 있음
    return result.isPresent()? entityToDto(result.get()) : null;
}
```

---

- 나중에 다시 목록 페이지로 돌아가는 데이터를 같이 저장하기 위해서 `PageRequestDTO`를 파라미터로 같이 사용. 

```java
// GuestbookController
@GetMapping("/read")
public void read(long gno, @ModelAttribute("requestDTO") PageRequestDTO requestDTO, Model model) {
    log.info("gno: " + gno);

    GuestbookDTO dto = service.read(gno);

    model.addAttribute("dto", dto);
}
```

---

```html
<!-- read.html -->
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">

  <th:block th:fragment="content">

    <h1 class="mt-4">GuestBook Read Page</h1>

    <div class="form-group">
      <label>Gno</label>
      <input type="text" class="form-control" name="title" th:value="${dto.gno}" readonly>
    </div>
    <div class="form-group">
      <label>Title</label>
      <input type="text" class="form-control" name="title" th:value="${dto.title}" readonly>
    </div>
    <div class="form-group">
      <label>Content</label>
      <textarea class="form-control" rows="5" name="content" readonly>[[${dto.content}]]</textarea>
    </div>
    <div class="form-group">
      <label>Writer</label>
      <input type="text" class="form-control" name="writer" th:value="${dto.writer}" readonly>
    </div>
    <div class="form-group">
      <label>RegDate</label>
      <input type="text" class="form-control" name="regDate" th:value="${#temporals.format(dto.regDate, 'yyyy/MM/dd HH:mm:ss')}" readonly>
    </div>
    <div class="form-group">
      <label>ModDate</label>
      <input type="text" class="form-control" name="modDate" th:value="${#temporals.format(dto.modDate, 'yyyy/MM/dd HH:mm:ss')}" readonly>
    </div>

    <a th:href="@{/guestbook/modify(gno = ${dto.gno}, page=${requestDTO.page})}">
      <button type="submit" class="btn btn-primary">Modify</button>
    </a>

    <a th:href="@{/guestbook/list(page=${requestDTO.page})}">
      <button type="submit" class="btn btn-info">List</button>
    </a>

  </th:block>

</th:block>
```


## 3. 수정/삭제 기능
### 1) `read()` 메서드의 어노테이션 값에 `/modify` 추가

```java
// controller
@GetMapping({"/read", "/modify"})
public void read(long gno, @ModelAttribute("requestDTO") PageRequestDTO requestDTO, Model model) {
    ...
}
```

### 2) modify.html 생성
- read.html 복사해서 사용.
- 변경점:
    - `<form>`으로 감싸줌.
    - 수정 가능한 항목의 `readonly` 속성 삭제.
    - 날짜 부분은 수정 불가능하고 JPA에서 자동으로 처리될 것이므로 `name`속성 삭제.

```html
<!-- modify.html -->
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">

  <th:block th:fragment="content">

    <h1 class="mt-4">GuestBook Modify Page</h1>

    <form action="/guestbook/modify" method="post">
    <div class="form-group">
      <label>Gno</label>
      <input type="text" class="form-control" name="title" th:value="${dto.gno}" readonly>
    </div>
    <div class="form-group">
      <label>Title</label>
      <input type="text" class="form-control" name="title" th:value="${dto.title}">
    </div>
    <div class="form-group">
      <label>Content</label>
      <textarea class="form-control" rows="5" name="content">[[${dto.content}]]</textarea>
    </div>
    <div class="form-group">
      <label>Writer</label>
      <input type="text" class="form-control" name="writer" th:value="${dto.writer}" readonly>
    </div>
    <div class="form-group">
      <label>RegDate</label>
      <input type="text" class="form-control" th:value="${#temporals.format(dto.regDate, 'yyyy/MM/dd HH:mm:ss')}" readonly>
    </div>
    <div class="form-group">
      <label>ModDate</label>
      <input type="text" class="form-control" th:value="${#temporals.format(dto.modDate, 'yyyy/MM/dd HH:mm:ss')}" readonly>
    </div>
    </form>

    <button type="button" class="btn btn-primary">Modify</button>
    <button type="button" class="btn btn-info">List</button>
    <button type="button" class="btn btn-danger">Remove</button>

  </th:block>

</th:block>
```

### 3) 서비스 계층에서의 수정과 삭제
```java
//Service
void remove(Long gno);
void modify(GuestbookDTO dto);
```

```java
//ServiceImpl
@Override
public void remove(Long gno) {
    repository.deleteById(gno);
}

@Override
public void modify(GuestbookDTO dto) {
    Optional<Guestbook> result = repository.findById(dto.getGno());
    
    if(result.isPresent()) {
        Guestbook entity = result.get();
        
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        
        repository.save(entity);
    }
}
```

```java
//controller
@PostMapping("/remove")
public String remove(long gno, RedirectAttributes redirectAttributes) {
    log.info("gno: "+gno);
    service.remove(gno);
    redirectAttributes.addFlashAttribute("msg", gno);
    
    return "redirect:/guestbook/list"; 
}
```

### 4) 페이지에서의 삭제처리
- `<form>` 태그 내에서 여러 파라미터 중 `gno`를 추출해서 삭제시 이용.

```html
<!-- modify.html -->
<script th:inline="javascript">
    $(document).ready(function() {
        var actionForm = $("form");
        
        $(".removeBtn").click(function() {
            actionForm
                .attr("action", "/guestbook/remove")
                .attr("method", "post");
            
            actionForm.submit();
        });
    });
</script>
```

### 5) POST 방식의 수정 처리
- 수정 완료 후 동일한 read페이지로 돌아갈 수 있도록 `page`값을 `<form>`에 추가해서 전달

```html
<!-- modify.html -->
<input type="hidden" name="page" th:value="${requestDTO.page}">
```
---

- `GuestbookDTO` : 수정해야 하는 글의 정보
- `PageRequestDTO` : 기존의 페이지 정보를 유지하기 위한 용도
- `RedirectAttributes` : 리다이렉트시 데이터를 전달하는 용도
    - 리다이렉트 시에는 URL이 변경되므로 일반적인 모델 데이터 전달 방식인 `Model` 객체를 사용할 수 없음. <br>
    이때, `RedirectAttributes`를 사용하여 데이터를 유지하고 전달할 수 있음.

```java
//controller
@PostMapping("/modify")
public String modify(GuestbookDTO dto, @ModelAttribute("requestDTO") PageRequestDTO requestDTO, RedirectAttributes redirectAttributes) {
    log.info("post modify..........................");
    log.info("dto: " + dto);
    
    service.modify(dto);
    
    redirectAttributes.addAttribute("page",requestDTO.getPage());
    redirectAttributes.addAttribute("gno",dto.getGno());
    
    return "redirect:/guestbook/read";
}
```

---

### 6) 페이지에서의 수정 처리
```js
$(".modifyBtn").click(function() {
    if(!confirm("수정하시겠습니까?")) {
        return ;
    }

    actionForm
        .attr("action", "/guestbook/modify")
        .attr("method", "post")
        .submit();
});
```

> `Incorrect string value` 오류
> - INSERT 구문을 실행하던 중 한글을 입력하려고 하니 발생. <br>
> => 테이블 생성 시 UTF 8 설정이 되어있지 않았음.
> - db에서 `ALTER TABLE guestbook convert to charset UTF8;` 쿼리 실행해서 해결.
> - 테이블 생성할 때 바로 설정하는 것도 가능. <br>
> => `CREATE TABLE 테이블 (...) DEFAULT CHARACTER SET UTF8;`

> content 부분이 db에서는 정상적으로 insert되는데 화면에 출력 안되는 현상
> - `<textarea>`에서는 `th:value`로 태그 안에 값을 넣는 게 아니라 태그 바깥 부분에 넣어야 되는데 `<input>`태그와 동일하게 설정을 했음.
> - 수정한 코드: <br>
> ```<textarea class="form-control" rows="5" name="content" readonly>[[${dto.content}]]</textarea>```

---

### 7) 수정 페이지에서 목록 페이지로
- `page`와 같은 파라미터 외에 다른 파라미터들은 필요하지 않으므로 제거한 상태로 처리.

```js
$(".listBtn").click(function() {
    var pageInfo = $("input[name='page']");

    actionForm.empty(); //form 태그의 모든 내용을 지움
    actionForm.append(pageInfo);    //목록 페이지 이동에 필요한 내용을 다시 추가
    actionForm
        .attr("action", "/guestbook/list")
        .attr("method", "get");

    //console.log(actionForm.html());
    actionForm.submit();
});
```

- console.log(actionForm.html()) 실행 결과 <br>

![image](https://github.com/cyh6327/SpringBoot/assets/99089584/9dddd539-6dd7-4c5b-85f9-36305386ce90)











